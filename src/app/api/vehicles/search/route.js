import { NextResponse } from 'next/server';
import { Vehicle } from '../../../../models/Vehicle.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const parseNum = (val) => {
      if (val === null) return undefined;
      const s = String(val);
      if (s === '' || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') return undefined;
      const n = Number(s);
      return Number.isFinite(n) ? n : undefined;
    };

    const filters = {
      pickup_location: searchParams.get('pickup_location'),
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      pickup_time: searchParams.get('pickup_time') || '10:00',
      
      // Additional filters
      category: searchParams.get('category'),
      categories: (searchParams.get('categories') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      brand: searchParams.get('brand'),
      energy: searchParams.get('energy'),
      gear_type: searchParams.get('gear_type'),
      min_seats: searchParams.get('min_seats'),
      min_price: parseNum(searchParams.get('min_price')),
      max_price: parseNum(searchParams.get('max_price')),
      rating_min: parseNum(searchParams.get('rating_min')),
      city: searchParams.get('city'),
      sort: searchParams.get('sort') || 'rating',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 10,
      
      // Feature filters
      air_conditioning: searchParams.get('air_conditioning') === 'true',
      navigation_system: searchParams.get('navigation_system') === 'true'
    };

    // Validate required fields
    if (!filters.pickup_location || !filters.start_date || !filters.end_date) {
      return NextResponse.json({
        error: 'Pickup location, start date, and end date are required'
      }, { status: 400 });
    }

    // Validate dates
    const startDate = new Date(filters.start_date);
    const endDate = new Date(filters.end_date);
    const today = new Date();
    
    // Set today to start of day for comparison
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    console.log('Date validation:', {
      start_date: filters.start_date,
      end_date: filters.end_date,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      today: today.toISOString()
    });
    
    if (startDate >= endDate) {
      return NextResponse.json({
        error: 'End date must be after start date'
      }, { status: 400 });
    }

    if (startDate < today) {
      return NextResponse.json({
        error: 'Start date cannot be in the past'
      }, { status: 400 });
    }

    // Search vehicles
    const vehicles = await Vehicle.search(filters);

    // Get total count for pagination (simplified)
    const totalCount = vehicles.length > 0 ? vehicles.length + (filters.page - 1) * filters.limit : 0;
    const totalPages = Math.ceil(totalCount / filters.limit);

    // Calculate pricing without extra DB calls
    const isHolidayPeriod = (startDate, endDate) => {
      const holidays = [
        { start: '2025-07-01', end: '2025-08-31' },
        { start: '2025-12-20', end: '2025-01-10' },
      ];
      const start = new Date(startDate);
      const end = new Date(endDate);
      return holidays.some(holiday => {
        const hs = new Date(holiday.start);
        const he = new Date(holiday.end);
        return (start <= he && end >= hs);
      });
    };
    const isHighSeason = (startDate, endDate) => {
      const s = new Date(startDate);
      const e = new Date(endDate);
      return (s.getMonth() >= 5 && s.getMonth() <= 8) || (e.getMonth() >= 5 && e.getMonth() <= 8);
    };
    const daysBetween = (startDate, endDate) => {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.abs(e.getTime() - s.getTime());
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const vehiclesWithPricing = vehicles.map((vehicle) => {
      const days = daysBetween(filters.start_date, filters.end_date);
      const holiday = isHolidayPeriod(filters.start_date, filters.end_date);
      const highSeason = isHighSeason(filters.start_date, filters.end_date);
      const baseLow = Number(vehicle.low_price || vehicle.price_low || vehicle.daily_rate || 50);
      const baseHigh = Number(vehicle.high_price || (baseLow * 1.5));
      const baseHoliday = Number(vehicle.holidays_price || (baseLow * 2));
      let pricePerDay = baseLow;
      if (holiday) pricePerDay = baseHoliday; else if (highSeason) pricePerDay = baseHigh;
      return {
        ...vehicle,
        pricing: {
          days,
          price_per_day: pricePerDay,
          base_total: pricePerDay * Math.max(days, 1),
          is_holiday: holiday,
          is_high_season: highSeason,
        }
      };
    });

    // Apply API-side filters for price, rating, categories
    const normalize = (s) => String(s || '').toUpperCase();
    const matchCategory = (name) => {
      if (!filters.categories || filters.categories.length === 0) return true;
      const cat = normalize(vehicleCategory(name));
      const selected = filters.categories.map(normalize);
      // Map selected categories to synonyms
      const map = {
        CONVERTIBLE: ['CONVERTIBLE'],
        COUPE: ['COUPE'],
        HATCHBACK: ['HATCHBACK'],
        MINIVAN: ['MINIVAN', 'VAN'],
        SEDAN: ['SEDAN', 'SMALL CAR', 'CAR'],
        SUV: ['SUV', 'CROSSOVER']
      };
      return selected.some(key => {
        const allowed = map[key] || [key];
        return allowed.some(a => cat.includes(a));
      });
    };

    const vehicleCategory = (name) => name || '';

    const filteredVehicles = vehiclesWithPricing.filter(v => {
      // Price filter
      const pricePerDay = v.pricing?.price_per_day ?? v.low_price ?? v.price ?? 0;
      const priceOk = (
        (filters.min_price === undefined || Number(pricePerDay) >= filters.min_price) &&
        (filters.max_price === undefined || Number(pricePerDay) <= filters.max_price)
      );

      // Rating filter (uses agency_rating if available)
      const rating = Number(v.agency_rating || v.rating || 0);
      const ratingOk = filters.rating_min === undefined || rating >= filters.rating_min;

      // Category filter
      const categoryOk = matchCategory(v.category_name);

      return priceOk && ratingOk && categoryOk;
    });

    const uniqueBrands = Array.from(new Set(vehiclesWithPricing.map(v => v.brand))).filter(Boolean).sort();
    return NextResponse.json({
      vehicles: filteredVehicles,
      pagination: {
        current_page: filters.page,
        total_pages: Math.ceil(filteredVehicles.length / filters.limit) || 0,
        total_items: filteredVehicles.length,
        items_per_page: filters.limit
      },
      filters: {
        applied: filters,
        available_categories: await getAvailableCategories(),
        available_brands: uniqueBrands,
        available_cities: await getAvailableCities()
      }
    });

  } catch (error) {
    console.error('Vehicle search error:', error);
    return NextResponse.json({
      error: 'Failed to search vehicles',
      message: error.message
    }, { status: 500 });
  }
}

async function getAvailableCategories() {
  try {
    return await Vehicle.getCategories();
  } catch (error) {
    return [];
  }
}

async function getAvailableBrands() {
  try {
    return await Vehicle.getBrands();
  } catch (error) {
    return [];
  }
}

async function getAvailableCities() {
  try {
    // Get distinct cities from agencies
    const cities = [
      'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 
      'Agadir', 'Meknes', 'Oujda', 'Beni Mellal', 'Tetouan'
    ];
    return cities;
  } catch (error) {
    return [];
  }
}
