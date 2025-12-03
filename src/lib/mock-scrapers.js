import { query } from './db.js';

// Enhanced PakWheels data with more comprehensive car listings
const mockPakWheelsData = [
    // Sedans
    { make: 'Toyota', model: 'Corolla', year: 2020, price_per_day: 120, location: 'Karachi', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'White' },
    { make: 'Honda', model: 'Civic', year: 2019, price_per_day: 150, location: 'Lahore', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Manual', seats: 5, color: 'Black' },
    { make: 'Honda', model: 'City', year: 2021, price_per_day: 130, location: 'Islamabad', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'CVT', seats: 5, color: 'Silver' },
    { make: 'Toyota', model: 'Camry', year: 2018, price_per_day: 200, location: 'Karachi', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Hybrid', transmission: 'Automatic', seats: 5, color: 'Red' },
    
    // Hatchbacks
    { make: 'Suzuki', model: 'Alto', year: 2021, price_per_day: 80, location: 'Islamabad', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Manual', seats: 4, color: 'Red' },
    { make: 'Suzuki', model: 'Swift', year: 2020, price_per_day: 110, location: 'Lahore', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Manual', seats: 5, color: 'Blue' },
    { make: 'Toyota', model: 'Vitz', year: 2019, price_per_day: 100, location: 'Faisalabad', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'White' },
    
    // SUVs
    { make: 'Toyota', model: 'Fortuner', year: 2020, price_per_day: 300, location: 'Karachi', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Diesel', transmission: 'Automatic', seats: 7, color: 'Black' },
    { make: 'Honda', model: 'BR-V', year: 2019, price_per_day: 180, location: 'Lahore', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'CVT', seats: 7, color: 'Grey' },
    { make: 'Hyundai', model: 'Tucson', year: 2021, price_per_day: 250, location: 'Islamabad', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1606016159991-fd5b14cb7999?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'White' },
    
    // Pickups
    { make: 'Toyota', model: 'Hilux', year: 2019, price_per_day: 220, location: 'Peshawar', category: 'Pickup', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Diesel', transmission: 'Manual', seats: 5, color: 'White' },
    { make: 'Isuzu', model: 'D-Max', year: 2020, price_per_day: 200, location: 'Quetta', category: 'Pickup', image_url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Diesel', transmission: 'Manual', seats: 5, color: 'Silver' },
    
    // Luxury
    { make: 'Mercedes', model: 'C-Class', year: 2018, price_per_day: 400, location: 'Karachi', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Black' },
    { make: 'BMW', model: '3 Series', year: 2019, price_per_day: 450, location: 'Lahore', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Blue' },
    { make: 'Audi', model: 'A4', year: 2020, price_per_day: 420, location: 'Islamabad', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1606016159991-fd5b14cb7999?w=400&h=300&fit=crop&crop=center', source: 'PakWheels', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Grey' }
];

// Enhanced Cars.com data with comprehensive US market cars
const mockCarsDotComData = [
    // Sports Cars
    { make: 'Ford', model: 'Mustang', year: 2018, price_per_day: 200, location: 'New York', category: 'Sports', image_url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 4, color: 'Blue' },
    { make: 'Chevrolet', model: 'Camaro', year: 2019, price_per_day: 180, location: 'Los Angeles', category: 'Sports', image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Manual', seats: 4, color: 'Yellow' },
    { make: 'Dodge', model: 'Challenger', year: 2020, price_per_day: 220, location: 'Miami', category: 'Sports', image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 5, color: 'Orange' },
    
    // Electric Vehicles
    { make: 'Tesla', model: 'Model 3', year: 2022, price_per_day: 250, location: 'San Francisco', category: 'Electric', image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Electric', transmission: 'Automatic', seats: 5, color: 'White' },
    { make: 'Tesla', model: 'Model Y', year: 2021, price_per_day: 300, location: 'Seattle', category: 'Electric', image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Electric', transmission: 'Automatic', seats: 7, color: 'Red' },
    { make: 'Nissan', model: 'Leaf', year: 2020, price_per_day: 160, location: 'Portland', category: 'Electric', image_url: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Electric', transmission: 'Automatic', seats: 5, color: 'Blue' },
    
    // Sedans
    { make: 'Honda', model: 'Accord', year: 2019, price_per_day: 140, location: 'Chicago', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Silver' },
    { make: 'Nissan', model: 'Altima', year: 2020, price_per_day: 130, location: 'Dallas', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Black' },
    { make: 'Toyota', model: 'Camry', year: 2021, price_per_day: 150, location: 'Phoenix', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Hybrid', transmission: 'CVT', seats: 5, color: 'White' },
    
    // SUVs
    { make: 'Ford', model: 'Explorer', year: 2020, price_per_day: 190, location: 'Denver', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 7, color: 'Blue' },
    { make: 'Chevrolet', model: 'Tahoe', year: 2019, price_per_day: 280, location: 'Houston', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 8, color: 'Black' },
    { make: 'Jeep', model: 'Grand Cherokee', year: 2018, price_per_day: 170, location: 'Atlanta', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1606016159991-fd5b14cb7999?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 5, color: 'Red' },
    
    // Luxury
    { make: 'BMW', model: 'X5', year: 2019, price_per_day: 350, location: 'Beverly Hills', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 5, color: 'White' },
    { make: 'Mercedes', model: 'GLE', year: 2020, price_per_day: 380, location: 'Las Vegas', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 5, color: 'Silver' },
    { make: 'Lexus', model: 'RX', year: 2021, price_per_day: 320, location: 'San Diego', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1606016159991-fd5b14cb7999?w=400&h=300&fit=crop&crop=center', source: 'Cars.com', fuel_type: 'Hybrid', transmission: 'CVT', seats: 5, color: 'Black' }
];

// AutoTrader data - UK/European cars
const mockAutoTraderData = [
    // Hatchbacks
    { make: 'Volkswagen', model: 'Golf', year: 2020, price_per_day: 120, location: 'London', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Petrol', transmission: 'Manual', seats: 5, color: 'Grey' },
    { make: 'Ford', model: 'Focus', year: 2019, price_per_day: 110, location: 'Manchester', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Blue' },
    { make: 'Mini', model: 'Cooper', year: 2021, price_per_day: 140, location: 'Edinburgh', category: 'Hatchback', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Petrol', transmission: 'Manual', seats: 4, color: 'Red' },
    
    // Sedans
    { make: 'BMW', model: '5 Series', year: 2018, price_per_day: 280, location: 'Birmingham', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Diesel', transmission: 'Automatic', seats: 5, color: 'Black' },
    { make: 'Audi', model: 'A6', year: 2019, price_per_day: 300, location: 'Liverpool', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1606016159991-fd5b14cb7999?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Diesel', transmission: 'Automatic', seats: 5, color: 'Silver' },
    { make: 'Mercedes', model: 'E-Class', year: 2020, price_per_day: 320, location: 'Bristol', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Hybrid', transmission: 'Automatic', seats: 5, color: 'White' },
    
    // SUVs
    { make: 'Land Rover', model: 'Discovery', year: 2019, price_per_day: 250, location: 'Leeds', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Diesel', transmission: 'Automatic', seats: 7, color: 'Green' },
    { make: 'Range Rover', model: 'Evoque', year: 2020, price_per_day: 220, location: 'Cardiff', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center', source: 'AutoTrader', fuel_type: 'Petrol', transmission: 'Automatic', seats: 5, color: 'White' }
];

// CarGurus data - Canadian market
const mockCarGurusData = [
    // Sedans
    { make: 'Honda', model: 'Civic', year: 2020, price_per_day: 125, location: 'Toronto', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Silver' },
    { make: 'Toyota', model: 'Corolla', year: 2019, price_per_day: 115, location: 'Vancouver', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'White' },
    { make: 'Hyundai', model: 'Elantra', year: 2021, price_per_day: 120, location: 'Montreal', category: 'Sedan', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Blue' },
    
    // SUVs
    { make: 'Subaru', model: 'Forester', year: 2020, price_per_day: 180, location: 'Calgary', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Green' },
    { make: 'Mazda', model: 'CX-5', year: 2019, price_per_day: 170, location: 'Ottawa', category: 'SUV', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 5, color: 'Red' },
    
    // Pickups
    { make: 'Ford', model: 'F-150', year: 2018, price_per_day: 200, location: 'Edmonton', category: 'Pickup', image_url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 6, color: 'Blue' },
    { make: 'Chevrolet', model: 'Silverado', year: 2019, price_per_day: 210, location: 'Winnipeg', category: 'Pickup', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'CarGurus', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 6, color: 'Black' }
];

// CarMax data - Used car dealer
const mockCarMaxData = [
    // Economy
    { make: 'Kia', model: 'Rio', year: 2020, price_per_day: 90, location: 'Austin', category: 'Economy', image_url: 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'White' },
    { make: 'Hyundai', model: 'Accent', year: 2019, price_per_day: 85, location: 'San Antonio', category: 'Economy', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'Manual', seats: 5, color: 'Blue' },
    { make: 'Nissan', model: 'Versa', year: 2021, price_per_day: 95, location: 'Fort Worth', category: 'Economy', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Silver' },
    
    // Minivans
    { make: 'Honda', model: 'Odyssey', year: 2018, price_per_day: 160, location: 'Columbus', category: 'Minivan', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 8, color: 'Grey' },
    { make: 'Toyota', model: 'Sienna', year: 2019, price_per_day: 170, location: 'Indianapolis', category: 'Minivan', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 8, color: 'White' },
    
    // Convertibles
    { make: 'Mazda', model: 'MX-5 Miata', year: 2020, price_per_day: 150, location: 'Nashville', category: 'Convertible', image_url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'Manual', seats: 2, color: 'Red' },
    { make: 'BMW', model: '2 Series', year: 2019, price_per_day: 220, location: 'Charlotte', category: 'Convertible', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center', source: 'CarMax', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 4, color: 'Blue' }
];

// Vroom data - Online car marketplace
const mockVroomData = [
    // Electric
    { make: 'Chevrolet', model: 'Bolt', year: 2020, price_per_day: 140, location: 'Boston', category: 'Electric', image_url: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Electric', transmission: 'Automatic', seats: 5, color: 'White' },
    { make: 'Volkswagen', model: 'ID.4', year: 2021, price_per_day: 180, location: 'Philadelphia', category: 'Electric', image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Electric', transmission: 'Automatic', seats: 5, color: 'Blue' },
    
    // Sports
    { make: 'Porsche', model: '911', year: 2018, price_per_day: 500, location: 'Miami Beach', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Gasoline', transmission: 'Manual', seats: 2, color: 'Yellow' },
    { make: 'Jaguar', model: 'F-Type', year: 2019, price_per_day: 350, location: 'Scottsdale', category: 'Luxury', image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Gasoline', transmission: 'Automatic', seats: 2, color: 'Green' },
    
    // Compact
    { make: 'Toyota', model: 'Yaris', year: 2020, price_per_day: 80, location: 'Tampa', category: 'Economy', image_url: 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Red' },
    { make: 'Honda', model: 'Fit', year: 2019, price_per_day: 85, location: 'Orlando', category: 'Economy', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&crop=center', source: 'Vroom', fuel_type: 'Gasoline', transmission: 'CVT', seats: 5, color: 'Silver' }
];

// Mock PakWheels scraper
export async function scrapePakWheels(maxPages = 3) {
    console.log(`Mock scraping PakWheels for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockPakWheelsData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockPakWheelsData.length);
    
    return mockPakWheelsData.slice(0, totalCars);
}

// Mock Cars.com scraper
export async function scrapeCarscom(maxPages = 3) {
    console.log(`Mock scraping Cars.com for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockCarsDotComData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockCarsDotComData.length);
    
    return mockCarsDotComData.slice(0, totalCars);
}

// Mock AutoTrader scraper
export async function scrapeAutoTrader(maxPages = 3) {
    console.log(`Mock scraping AutoTrader for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockAutoTraderData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockAutoTraderData.length);
    
    return mockAutoTraderData.slice(0, totalCars);
}

// Mock CarGurus scraper
export async function scrapeCarGurus(maxPages = 3) {
    console.log(`Mock scraping CarGurus for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1600));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockCarGurusData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockCarGurusData.length);
    
    return mockCarGurusData.slice(0, totalCars);
}

// Mock CarMax scraper
export async function scrapeCarMax(maxPages = 3) {
    console.log(`Mock scraping CarMax for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockCarMaxData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockCarMaxData.length);
    
    return mockCarMaxData.slice(0, totalCars);
}

// Mock Vroom scraper
export async function scrapeVroom(maxPages = 3) {
    console.log(`Mock scraping Vroom for ${maxPages} pages...`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1300));
    
    // Return mock data based on pages
    const carsPerPage = Math.ceil(mockVroomData.length / maxPages);
    const totalCars = Math.min(maxPages * carsPerPage, mockVroomData.length);
    
    return mockVroomData.slice(0, totalCars);
}

// Save scraped cars to database
export async function saveScrapedCars(cars) {
    const savedCars = [];
    const failedCars = [];
    
    for (const carData of cars) {
        try {
            // Use image URL directly (no downloading for now)
            let imagePath = carData.image_url || null;
            
            // Get default agency_id and category_id
            let agencyId = 1; // Default agency
            let categoryId = 1; // Default category
            
            try {
                // Get or create agency
                const agencyResult = await query(
                    'SELECT agency_id FROM agencies WHERE status = "approved" LIMIT 1'
                );
                if (agencyResult.length > 0) {
                    agencyId = agencyResult[0].agency_id;
                }
                
                // Get or create category
                const categoryResult = await query(
                    'SELECT category_id FROM vehicle_categories WHERE name = ? LIMIT 1',
                    [carData.category || 'Sedan'] // Use car category or default to Sedan
                );
                if (categoryResult.length > 0) {
                    categoryId = categoryResult[0].category_id;
                } else {
                    // Create new category if it doesn't exist
                    const newCategory = await query(
                        'INSERT INTO vehicle_categories (name, description) VALUES (?, ?)',
                        [carData.category || 'Sedan', `${carData.category || 'Sedan'} vehicles`]
                    );
                    categoryId = newCategory.insertId;
                }
            } catch (error) {
                console.error('Error getting agency/category, using defaults:', error);
            }
            
            // Prepare image array
            const images = imagePath ? [imagePath] : [];
            
            // Map fuel_type to energy enum
            let energy = 'petrol';
            if (carData.fuel_type) {
                switch (carData.fuel_type.toLowerCase()) {
                    case 'gasoline':
                    case 'petrol':
                        energy = 'petrol';
                        break;
                    case 'diesel':
                        energy = 'diesel';
                        break;
                    case 'electric':
                        energy = 'electric';
                        break;
                    case 'hybrid':
                        energy = 'hybrid';
                        break;
                    default:
                        energy = 'petrol';
                }
            }
            
            // Map transmission
            let gearType = 'manual';
            if (carData.transmission) {
                switch (carData.transmission.toLowerCase()) {
                    case 'automatic':
                    case 'cvt':
                        gearType = 'automatic';
                        break;
                    case 'manual':
                    default:
                        gearType = 'manual';
                }
            }
            
            // Check if vehicle already exists (using brand instead of make)
            const existingVehicle = await query(
                'SELECT vehicle_id FROM vehicles WHERE brand = ? AND model = ? AND year = ? LIMIT 1',
                [carData.make, carData.model, carData.year]
            );
            
            if (existingVehicle.length === 0) {
                // Insert vehicle into database with vehicles table structure
                const result = await query(`
                    INSERT INTO vehicles (
                        agency_id, vehicle_number, category_id, type, brand, model, year,
                        energy, gear_type, doors, seats, air_conditioning, airbags,
                        navigation_system, bluetooth, wifi, price_low, price_high, price_holiday,
                        daily_rate, description, images, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    agencyId,
                    `${carData.source}-${carData.make}-${carData.year}-${Date.now()}`, // Unique vehicle number
                    categoryId,
                    'small_car', // type (default)
                    carData.make, // brand
                    carData.model,
                    carData.year,
                    energy,
                    gearType,
                    4, // doors (default)
                    carData.seats || 5,
                    1, // air_conditioning (default yes)
                    1, // airbags (default yes)
                    1, // navigation_system (default yes)
                    1, // bluetooth (default yes)
                    0, // wifi (default no)
                    carData.price_per_day || 100, // price_low
                    (carData.price_per_day || 100) * 1.5, // price_high (50% higher)
                    (carData.price_per_day || 100) * 2, // price_holiday (double)
                    carData.price_per_day || 100, // daily_rate
                    carData.description || `${carData.make} ${carData.model} ${carData.year} from ${carData.source}`,
                    JSON.stringify(images),
                    'available' // status
                ]);
                
                savedCars.push({
                    id: result.insertId,
                    ...carData,
                    brand: carData.make,
                    image_path: imagePath
                });
            } else {
                // Vehicle already exists
                failedCars.push({ 
                    ...carData, 
                    error: 'Vehicle already exists in database' 
                });
            }
            
        } catch (error) {
            console.error('Error saving vehicle:', error);
            failedCars.push({ 
                ...carData, 
                error: error.message 
            });
        }
    }
    
    return {
        saved: savedCars,
        failed: failedCars,
        totalScraped: cars.length,
        totalSaved: savedCars.length,
        totalFailed: failedCars.length
    };
}

// Main scraping function
export async function scrapeAllSites(options = {}) {
    const { 
        pakwheelsPages = 2, 
        carsdotcomPages = 2,
        autotraderPages = 2,
        cargurusPages = 2,
        carmaxPages = 2,
        vroomPages = 2,
        includeAllSources = false
    } = options;
    
    console.log('Starting mock car scraping from all sites...');
    
    const allCars = [];
    
    // Scrape PakWheels
    try {
        console.log('Mock scraping PakWheels...');
        const pakwheelsCars = await scrapePakWheels(pakwheelsPages);
        allCars.push(...pakwheelsCars);
        console.log(`Mock scraped ${pakwheelsCars.length} cars from PakWheels`);
    } catch (error) {
        console.error('Mock PakWheels scraping failed:', error);
    }
    
    // Scrape Cars.com
    try {
        console.log('Mock scraping Cars.com...');
        const carsdotcomCars = await scrapeCarscom(carsdotcomPages);
        allCars.push(...carsdotcomCars);
        console.log(`Mock scraped ${carsdotcomCars.length} cars from Cars.com`);
    } catch (error) {
        console.error('Mock Cars.com scraping failed:', error);
    }
    
    // Scrape additional sources if requested
    if (includeAllSources) {
        // Scrape AutoTrader
        try {
            console.log('Mock scraping AutoTrader...');
            const autotraderCars = await scrapeAutoTrader(autotraderPages);
            allCars.push(...autotraderCars);
            console.log(`Mock scraped ${autotraderCars.length} cars from AutoTrader`);
        } catch (error) {
            console.error('Mock AutoTrader scraping failed:', error);
        }
        
        // Scrape CarGurus
        try {
            console.log('Mock scraping CarGurus...');
            const cargurusCars = await scrapeCarGurus(cargurusPages);
            allCars.push(...cargurusCars);
            console.log(`Mock scraped ${cargurusCars.length} cars from CarGurus`);
        } catch (error) {
            console.error('Mock CarGurus scraping failed:', error);
        }
        
        // Scrape CarMax
        try {
            console.log('Mock scraping CarMax...');
            const carmaxCars = await scrapeCarMax(carmaxPages);
            allCars.push(...carmaxCars);
            console.log(`Mock scraped ${carmaxCars.length} cars from CarMax`);
        } catch (error) {
            console.error('Mock CarMax scraping failed:', error);
        }
        
        // Scrape Vroom
        try {
            console.log('Mock scraping Vroom...');
            const vroomCars = await scrapeVroom(vroomPages);
            allCars.push(...vroomCars);
            console.log(`Mock scraped ${vroomCars.length} cars from Vroom`);
        } catch (error) {
            console.error('Mock Vroom scraping failed:', error);
        }
    }
    
    // Remove duplicates based on make, model, year combination
    const uniqueCars = allCars.filter((car, index, self) => 
        index === self.findIndex(c => 
            c.make === car.make && 
            c.model === car.model && 
            c.year === car.year &&
            c.source === car.source
        )
    );
    
    console.log(`Found ${allCars.length} cars total, ${uniqueCars.length} unique cars`);
    
    // Save to database
    const saveResult = await saveScrapedCars(uniqueCars);
    
    return {
        totalScraped: allCars.length,
        uniqueCars: uniqueCars.length,
        ...saveResult
    };
}
