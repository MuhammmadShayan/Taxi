import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { query } from './db.js';
import { downloadImage, generateFilename, ensureDefaultCarImage } from './image-downloader.js';

// Extract price from text
function extractPrice(priceText) {
    if (!priceText) return 0;
    
    // Remove currency symbols and convert to number
    const cleanPrice = priceText.replace(/[^0-9.,]/g, '');
    const price = parseFloat(cleanPrice.replace(/,/g, ''));
    
    // Convert different currencies/units to daily rate
    if (priceText.toLowerCase().includes('lacs') || priceText.toLowerCase().includes('lakh')) {
        return price * 100000 / 30; // Convert lacs to daily rate (rough estimation)
    } else if (priceText.toLowerCase().includes('crore')) {
        return price * 10000000 / 30; // Convert crore to daily rate (rough estimation)
    }
    
    return price || 0;
}

// PakWheels scraper
export async function scrapePakWheels(maxPages = 3) {
    const cars = [];
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`Scraping PakWheels page ${pageNum}...`);
            
            const url = pageNum === 1 
                ? 'https://www.pakwheels.com/used-cars/search/-/'
                : `https://www.pakwheels.com/used-cars/search/-/?page=${pageNum}`;
            
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for car listings to load
            await page.waitForSelector('.car-listing, .featured-listing', { timeout: 10000 });
            
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);
            
            $('.car-listing, .featured-listing').each((index, element) => {
                try {
                    const $car = $(element);
                    
                    const title = $car.find('.car-name a, h3 a').text().trim();
                    const priceText = $car.find('.price-details, .price').text().trim();
                    const location = $car.find('.car-location, .ads-locations').text().trim();
                    const imageUrl = $car.find('img').attr('src') || $car.find('img').attr('data-src');
                    const detailUrl = $car.find('.car-name a, h3 a').attr('href');
                    
                    if (title && priceText) {
                        // Extract make, model, year from title
                        const titleParts = title.split(' ');
                        const make = titleParts[0] || 'Unknown';
                        let model = titleParts.slice(1, -1).join(' ') || 'Unknown';
                        let year = titleParts[titleParts.length - 1];
                        
                        // If last part isn't a year, adjust
                        if (!/^\d{4}$/.test(year)) {
                            model = titleParts.slice(1).join(' ');
                            year = new Date().getFullYear();
                        } else {
                            year = parseInt(year);
                        }
                        
                        const carData = {
                            make: make,
                            model: model,
                            year: year,
                            price_per_day: extractPrice(priceText),
                            location: location || 'Pakistan',
                            description: title,
                            image_url: imageUrl,
                            source: 'PakWheels',
                            source_url: detailUrl ? `https://www.pakwheels.com${detailUrl}` : null,
                            fuel_type: 'Petrol', // Default
                            transmission: 'Manual', // Default
                            seats: 5, // Default
                            color: 'Unknown'
                        };
                        
                        cars.push(carData);
                    }
                } catch (error) {
                    console.error('Error parsing PakWheels car:', error);
                }
            });
            
            // Wait between pages to be respectful
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } catch (error) {
        console.error('Error scraping PakWheels:', error);
    } finally {
        await browser.close();
    }
    
    return cars;
}

// Cars.com scraper
export async function scrapeCarscom(maxPages = 3) {
    const cars = [];
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`Scraping Cars.com page ${pageNum}...`);
            
            const offset = (pageNum - 1) * 20;
            const url = `https://www.cars.com/shopping/results/?page=${pageNum}&per_page=20&sort=best_match_desc`;
            
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for car listings to load
            await page.waitForSelector('.vehicle-card, [data-testid="vehicle-card"]', { timeout: 10000 });
            
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);
            
            $('.vehicle-card, [data-testid="vehicle-card"]').each((index, element) => {
                try {
                    const $car = $(element);
                    
                    const title = $car.find('.vehicle-card-title, [data-testid="vehicle-card-title"]').text().trim();
                    const priceText = $car.find('.primary-price, [data-testid="listing-price"]').text().trim();
                    const mileage = $car.find('.mileage, [data-testid="vehicle-mileage"]').text().trim();
                    const location = $car.find('.dealer-name, .listing-location, [data-testid="vehicle-dealer-name"]').text().trim();
                    const imageUrl = $car.find('img').attr('src') || $car.find('img').attr('data-src');
                    
                    if (title && priceText) {
                        // Extract make, model, year from title
                        const titleParts = title.split(' ');
                        const year = titleParts.find(part => /^\d{4}$/.test(part)) || new Date().getFullYear();
                        const yearIndex = titleParts.findIndex(part => /^\d{4}$/.test(part));
                        const make = titleParts[yearIndex + 1] || titleParts[0] || 'Unknown';
                        const model = titleParts.slice(yearIndex + 2).join(' ') || titleParts.slice(1).join(' ') || 'Unknown';
                        
                        const carData = {
                            make: make,
                            model: model,
                            year: parseInt(year),
                            price_per_day: Math.round(extractPrice(priceText) / 30), // Convert purchase price to daily rental estimate
                            location: location || 'USA',
                            description: title,
                            image_url: imageUrl,
                            source: 'Cars.com',
                            mileage: mileage,
                            fuel_type: 'Gasoline', // Default for US
                            transmission: 'Automatic', // Default for US
                            seats: 5, // Default
                            color: 'Unknown'
                        };
                        
                        cars.push(carData);
                    }
                } catch (error) {
                    console.error('Error parsing Cars.com car:', error);
                }
            });
            
            // Wait between pages to be respectful
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } catch (error) {
        console.error('Error scraping Cars.com:', error);
    } finally {
        await browser.close();
    }
    
    return cars;
}

// Save scraped cars to database
export async function saveScrapedCars(cars) {
    const savedCars = [];
    const failedCars = [];
    
    for (const carData of cars) {
        try {
            // Download image if available
            let imagePath = null;
            if (carData.image_url) {
                const filename = generateFilename(carData.image_url, carData);
                imagePath = await downloadImage(carData.image_url, filename);
            }
            
            // Get or create category_id (default to 1 if not found)
            let categoryId = 1;
            try {
                const categoryResult = await query(
                    'SELECT id FROM car_categories WHERE name = ? LIMIT 1',
                    ['Sedan'] // Default category
                );
                if (categoryResult.length > 0) {
                    categoryId = categoryResult[0].id;
                }
            } catch (error) {
                console.error('Error getting category:', error);
            }
            
            // Prepare image array
            const images = imagePath ? [imagePath] : [];
            
            // Insert car into database
            const result = await query(`
                INSERT INTO cars (
                    category_id, make, model, year, color, seats, fuel_type, 
                    transmission, price_per_day, price_per_hour, images, 
                    description, is_available, location, mileage, rating
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                categoryId,
                carData.make,
                carData.model,
                carData.year,
                carData.color || 'Unknown',
                carData.seats || 5,
                carData.fuel_type || 'Petrol',
                carData.transmission || 'Manual',
                carData.price_per_day || 0,
                Math.round((carData.price_per_day || 0) / 24), // Hourly rate
                JSON.stringify(images),
                carData.description || `${carData.make} ${carData.model} ${carData.year}`,
                1, // is_available
                carData.location || 'Unknown',
                carData.mileage || 0,
                4.0 // Default rating
            ]);
            
            savedCars.push({
                id: result.insertId,
                ...carData,
                image_path: imagePath
            });
            
        } catch (error) {
            console.error('Error saving car:', error);
            failedCars.push({ ...carData, error: error.message });
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
    const { pakwheelsPages = 2, carsdotcomPages = 2 } = options;
    
    console.log('Starting car scraping from all sites...');
    
    const allCars = [];
    
    // Scrape PakWheels
    try {
        console.log('Scraping PakWheels...');
        const pakwheelsCars = await scrapePakWheels(pakwheelsPages);
        allCars.push(...pakwheelsCars);
        console.log(`Scraped ${pakwheelsCars.length} cars from PakWheels`);
    } catch (error) {
        console.error('PakWheels scraping failed:', error);
    }
    
    // Scrape Cars.com
    try {
        console.log('Scraping Cars.com...');
        const carsdotcomCars = await scrapeCarscom(carsdotcomPages);
        allCars.push(...carsdotcomCars);
        console.log(`Scraped ${carsdotcomCars.length} cars from Cars.com`);
    } catch (error) {
        console.error('Cars.com scraping failed:', error);
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
