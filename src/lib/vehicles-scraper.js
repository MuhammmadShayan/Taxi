import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import axios from 'axios';
import dns from 'dns';
import { query } from './database.js';
import { downloadImage, generateFilename } from './image-downloader.js';

// Columns we want in vehicles catalog
const VEHICLE_COLUMNS = [
    { name: 'make', type: "varchar(100) NOT NULL" },
    { name: 'model', type: "varchar(150) NOT NULL" },
    { name: 'year', type: "int(11) NOT NULL" },
    { name: 'daily_rate', type: "decimal(10,2) DEFAULT NULL" },
    { name: 'price_usd', type: "int(11) DEFAULT NULL" },
    { name: 'mileage', type: "int(11) DEFAULT NULL" },
    { name: 'location', type: "varchar(150) DEFAULT NULL" },
    { name: 'energy', type: "varchar(50) DEFAULT NULL" },
    { name: 'gear_type', type: "varchar(50) DEFAULT NULL" },
    { name: 'seats', type: "int(11) DEFAULT NULL" },
    { name: 'doors', type: "int(11) DEFAULT NULL" },
    { name: 'color', type: "varchar(50) DEFAULT NULL" },
    { name: 'body_type', type: "varchar(100) DEFAULT NULL" },
    { name: 'trim', type: "varchar(150) DEFAULT NULL" },
    { name: 'images', type: "text DEFAULT NULL" },
    { name: 'description', type: "text DEFAULT NULL" },
    { name: 'source', type: "varchar(100) DEFAULT NULL" },
    { name: 'source_url', type: "text DEFAULT NULL" },
    { name: 'status', type: "varchar(50) DEFAULT 'active'" },
    { name: 'created_at', type: "datetime DEFAULT CURRENT_TIMESTAMP" },
    { name: 'updated_at', type: "datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
];

async function columnExists(columnName) {
    const rows = await query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = ?`,
        [columnName]
    );
    return rows.length > 0;
}

export async function ensureVehiclesSchema() {
    await query(`CREATE TABLE IF NOT EXISTS vehicles (
        id int(11) NOT NULL AUTO_INCREMENT,
        make varchar(100) NOT NULL,
        model varchar(150) NOT NULL,
        year int(11) NOT NULL,
        daily_rate decimal(10,2) DEFAULT NULL,
        price_usd int(11) DEFAULT NULL,
        mileage int(11) DEFAULT NULL,
        location varchar(150) DEFAULT NULL,
        energy varchar(50) DEFAULT NULL,
        gear_type varchar(50) DEFAULT NULL,
        seats int(11) DEFAULT NULL,
        doors int(11) DEFAULT NULL,
        color varchar(50) DEFAULT NULL,
        body_type varchar(100) DEFAULT NULL,
        trim varchar(150) DEFAULT NULL,
        images text DEFAULT NULL,
        description text DEFAULT NULL,
        source varchar(100) DEFAULT NULL,
        source_url text DEFAULT NULL,
        status varchar(50) DEFAULT 'active',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )`);

    for (const col of VEHICLE_COLUMNS) {
        const exists = await columnExists(col.name);
        if (!exists) {
            await query(`ALTER TABLE vehicles ADD COLUMN ${col.name} ${col.type}`);
        }
    }
}

function extractPriceUSD(text) {
    if (!text) return null;
    const match = text.replace(/[,\s]/g, '').match(/\$?(\d{3,})/);
    if (match) return parseInt(match[1]);
    return null;
}

export async function scrapeCarsDotCom(pages = 2) {
    const cars = [];
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-blink-features=AutomationControlled','--disable-dev-shm-usage'] });
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 900 });
        await page.setJavaScriptEnabled(true);
        for (let p = 1; p <= pages; p++) {
            const url = `https://www.cars.com/shopping/results/?page=${p}&page_size=20&sort=best_match_desc&maximum_distance=all&zip=10001&stock_type=used%2Cnew`;
            await withRetry(() => page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }), 3, 1500);
            for (let i = 0; i < 6; i++) {
                await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
                await new Promise(r => setTimeout(r, 1000));
            }
            try {
                await page.waitForFunction(() => {
                    const sel = '.vehicle-card, [data-testid="vehicle-card"], [data-qa="VehicleCard"]';
                    return document.querySelectorAll(sel).length > 0;
                }, { timeout: 25000 });
            } catch (e) {}
            const html = await page.content();
            const $ = cheerio.load(html);
            const nodes = $('.vehicle-card, [data-testid="vehicle-card"], [data-qa="VehicleCard"]');
            nodes.each((_, el) => {
                try {
                    const $el = $(el);
                    const title = $el.find('.vehicle-card-title, [data-testid="vehicle-card-title"], h2, .title').text().trim();
                    const priceText = $el.find('.primary-price, [data-testid="listing-price"], .price').text().trim();
                    const mileageText = $el.find('.mileage, [data-testid="vehicle-mileage"], .mileage-estimate').text().trim();
                    const dealer = $el.find('.dealer-name, .listing-location, [data-testid="vehicle-dealer-name"], .dealer-name').text().trim();
                    const detailHref = $el.find('a').attr('href');
                    const img = $el.find('img').attr('src') || $el.find('img').attr('data-src') || $el.find('img').attr('data-original');

                    if (!title) return;
                    const parts = title.split(' ');
                    const yearIndex = parts.findIndex(x => /^\d{4}$/.test(x));
                    const year = yearIndex >= 0 ? parseInt(parts[yearIndex]) : null;
                    const make = yearIndex >= 0 ? (parts[yearIndex + 1] || parts[0]) : parts[0];
                    const model = yearIndex >= 0 ? parts.slice(yearIndex + 2).join(' ') : parts.slice(1).join(' ');
                    const mileage = mileageText ? parseInt(mileageText.replace(/[^0-9]/g, '')) : null;
                    const priceUSD = extractPriceUSD(priceText);
                    const dailyRate = priceUSD ? Math.round(priceUSD / 30) : null;

                    cars.push({
                        make: make || 'Unknown',
                        model: model || 'Unknown',
                        year: year || new Date().getFullYear(),
                        price_usd: priceUSD || null,
                        daily_rate: dailyRate || null,
                        mileage: mileage || null,
                        location: dealer || null,
                        energy: 'Gasoline',
                        gear_type: 'Automatic',
                        seats: 5,
                        doors: 4,
                        color: 'Unknown',
                        body_type: null,
                        trim: null,
                        image_url: img || null,
                        source: 'cars.com',
                        source_url: detailHref ? (detailHref.startsWith('http') ? detailHref : `https://www.cars.com${detailHref}`) : null,
                        description: title
                    });
                } catch (e) {
                    // ignore one card errors
                }
            });
            await new Promise(r => setTimeout(r, 1500));
        }
    } finally {
        await browser.close();
    }
    return cars;
}

export async function saveVehicles(scraped, options = {}) {
    const { skipExisting = false } = options;
    const saved = [];
    const failed = [];
    const skipped = [];
    for (const car of scraped) {
        try {
            // De-dup check by make/model/year (simple)
            const existing = await query(
                'SELECT id, images FROM vehicles WHERE make = ? AND model = ? AND year = ? LIMIT 1',
                [car.make, car.model, car.year]
            );
            if (existing.length > 0) {
                if (skipExisting) {
                    skipped.push({ id: existing[0].id, ...car });
                    continue;
                }
            }

            let imagePath = null;
            if (car.image_url) {
                const filename = generateFilename(car.image_url, { make: car.make, model: car.model, year: car.year });
                imagePath = await downloadImage(car.image_url, filename);
            }
            const images = imagePath ? [imagePath] : [];

            if (existing.length > 0) {
                // Update lightweight fields and keep existing images if present
                const keepImages = existing[0].images && existing[0].images !== '' && existing[0].images !== '[]' ? existing[0].images : JSON.stringify(images);
                await query(
                    `UPDATE vehicles SET price_usd = COALESCE(?, price_usd), daily_rate = COALESCE(?, daily_rate), mileage = COALESCE(?, mileage), location = COALESCE(?, location), images = ?, source = COALESCE(?, source), source_url = COALESCE(?, source_url), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [car.price_usd, car.daily_rate, car.mileage, car.location, keepImages, car.source, car.source_url, existing[0].id]
                );
                saved.push({ id: existing[0].id, ...car, image_path: imagePath });
                continue;
            }

            const result = await query(
                `INSERT INTO vehicles (make, model, year, daily_rate, price_usd, mileage, location, energy, gear_type, seats, doors, color, body_type, trim, images, description, source, source_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    car.make, car.model, car.year,
                    car.daily_rate, car.price_usd, car.mileage, car.location,
                    car.energy, car.gear_type, car.seats, car.doors, car.color,
                    car.body_type, car.trim, JSON.stringify(images), car.description,
                    car.source, car.source_url, 'active'
                ]
            );
            saved.push({ id: result.insertId, ...car, image_path: imagePath });
        } catch (e) {
            failed.push({ ...car, error: e.message });
        }
    }
    return { saved, failed, skipped };
}

export async function scrapeCarsComToVehicles(options = {}) {
    const { carsdotcomPages = 2, skipExisting = false, maxVehicles = 0 } = options;
    await ensureVehiclesSchema();
    let scraped = await scrapeCarsDotCom(carsdotcomPages);
    if (maxVehicles && scraped.length > maxVehicles) {
        scraped = scraped.slice(0, maxVehicles);
    }
    // Deduplicate within batch
    const unique = scraped.filter((c, i, arr) => i === arr.findIndex(x => x.make === c.make && x.model === c.model && x.year === c.year));
    const { saved, failed, skipped } = await saveVehicles(unique, { skipExisting });
    return {
        totalScraped: scraped.length,
        uniqueCars: unique.length,
        totalSaved: saved.length,
        totalFailed: failed.length,
        totalSkipped: skipped.length,
        saved,
        failed,
        skipped
    };
}

// Enrich existing vehicles (fill NULL/empty fields and add images) using Cars.com search per make/model/year
export async function enrichExistingVehicles({ batchSize = 50, maxVehicles = 200 } = {}) {
    await ensureVehiclesSchema();
    const toEnrich = await query(`
        SELECT id, make, model, year
        FROM vehicles
        WHERE (
            daily_rate IS NULL OR price_usd IS NULL OR mileage IS NULL OR
            energy IS NULL OR gear_type IS NULL OR seats IS NULL OR doors IS NULL OR
            images IS NULL OR images = '' OR images = '[]'
        )
        ORDER BY id ASC
        LIMIT ?
    `, [Math.min(maxVehicles, batchSize)]);

    const enriched = [];
    const failed = [];

    for (const v of toEnrich) {
        try {
            const details = await enrichVehicleFromCarsCom(v.make, v.model, v.year);
            if (!details) {
                failed.push({ id: v.id, make: v.make, model: v.model, year: v.year, error: 'Not found on Cars.com' });
                continue;
            }

            // Download image if present
            let imagePath = null;
            if (details.image_url) {
                const filename = generateFilename(details.image_url, { make: v.make, model: v.model, year: v.year });
                imagePath = await downloadImage(details.image_url, filename);
            }
            const images = imagePath ? [imagePath] : [];

            await query(`
                UPDATE vehicles SET
                    daily_rate = COALESCE(?, daily_rate),
                    price_usd = COALESCE(?, price_usd),
                    mileage = COALESCE(?, mileage),
                    location = COALESCE(?, location),
                    energy = COALESCE(?, energy),
                    gear_type = COALESCE(?, gear_type),
                    seats = COALESCE(?, seats),
                    doors = COALESCE(?, doors),
                    color = COALESCE(?, color),
                    body_type = COALESCE(?, body_type),
                    trim = COALESCE(?, trim),
                    images = CASE WHEN images IS NULL OR images = '' OR images = '[]' THEN ? ELSE images END,
                    description = COALESCE(?, description),
                    source = 'cars.com',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [
                details.daily_rate, details.price_usd, details.mileage, details.location, details.energy,
                details.gear_type, details.seats, details.doors, details.color, details.body_type, details.trim,
                JSON.stringify(images), details.description, v.id
            ]);

            enriched.push({ id: v.id, ...details, fieldsAdded: Object.keys(details).length, hasImage: images.length > 0 });
        } catch (e) {
            failed.push({ id: v.id, make: v.make, model: v.model, year: v.year, error: e.message });
        }
    }

    return {
        totalProcessed: toEnrich.length,
        totalEnriched: enriched.length,
        totalFailed: failed.length,
        enriched,
        failed
    };
}

async function enrichVehicleFromCarsCom(make, model, year) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-blink-features=AutomationControlled','--disable-dev-shm-usage'] });
    const queryUrl = `https://www.cars.com/shopping/results/?page=1&page_size=20&maximum_distance=all&zip=10001&stock_type=used%2Cnew&makes[]=${encodeURIComponent(make)}&models[]=${encodeURIComponent(make.toLowerCase() + '-' + model.toLowerCase().replace(/\s+/g,'_'))}&list_price_max=&minimum_year=${year}&maximum_year=${year}`;
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(45000);
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await page.goto(queryUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
                break;
            } catch (navErr) {
                const msg = navErr?.message || String(navErr);
                console.warn(`enrich navigate attempt ${attempt} failed: ${msg}`);
                try { await page.close(); } catch {}
                page = await browser.newPage();
                await page.setDefaultNavigationTimeout(45000);
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
                if (attempt === 3) throw navErr;
                await wait(500 * attempt);
            }
        }
        const html = await page.content();
        const $ = cheerio.load(html);
        let node = $('.vehicle-card, [data-testid="vehicle-card"], [data-qa="VehicleCard"]').first();
        if (!node || node.length === 0) {
            // Fallback: fetch via axios
            try {
                const res = await axios.get(queryUrl, {
                    timeout: 8000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                    validateStatus: s => s >= 200 && s < 500
                });
                const $alt = cheerio.load(res.data);
                node = $alt('.vehicle-card, [data-testid="vehicle-card"], [data-qa="VehicleCard"]').first();
                if (!node || node.length === 0) throw new Error('No listing card found in fallback HTML');
                return extractDetailsFromNode($alt, node);
            } catch {
                throw new Error('Fallback fetch failed');
            }
        }
        return extractDetailsFromNode($, node);
    } catch (e) {
        console.error('enrichVehicleFromCarsCom failed:', e?.message || e);
        throw e;
    } finally {
        try { if (page && !page.isClosed()) await page.close(); } catch {}
        await browser.close();
    }
}

function extractDetailsFromNode($, node) {
    const title = node.find('.vehicle-card-title, [data-testid="vehicle-card-title"], h2, .title').text().trim();
    const priceText = node.find('.primary-price, [data-testid="listing-price"], .price').text().trim();
    const mileageText = node.find('.mileage, [data-testid="vehicle-mileage"], .mileage-estimate').text().trim();
    const dealer = node.find('.dealer-name, .listing-location, [data-testid="vehicle-dealer-name"], .dealer-name').text().trim();
    const img = node.find('img').attr('src') || node.find('img').attr('data-src') || node.find('img').attr('data-original');

    const mileage = mileageText ? parseInt(mileageText.replace(/[^0-9]/g, '')) : null;
    const priceUSD = extractPriceUSD(priceText);
    const dailyRate = priceUSD ? Math.round(priceUSD / 30) : null;

    return {
        daily_rate: dailyRate,
        price_usd: priceUSD,
        mileage,
        location: dealer || null,
        energy: 'Gasoline',
        gear_type: 'Automatic',
        seats: 5,
        doors: 4,
        color: 'Unknown',
        body_type: null,
        trim: null,
        image_url: img || null,
        description: title
    };
}
        
export async function scrapeAutoTrader(pages = 2) {
    const cars = [];
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-blink-features=AutomationControlled','--disable-dev-shm-usage'] });
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 900 });
        
        for (let p = 1; p <= pages; p++) {
            const url = `https://www.autotrader.com/cars-for-sale/all-cars?zip=10001&startYear=2015&numRecords=25&sortBy=relevance&firstRecord=${(p-1)*25}&marketExtension=true`;
            await withRetry(() => page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }), 3, 1500);
            
            // Scroll to trigger lazy loading
            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
                await new Promise(r => setTimeout(r, 1000));
            }
            
            const html = await page.content();
            const $ = cheerio.load(html);
            
            $('.item-card').each((_, el) => {
                try {
                    const $el = $(el);
                    const title = $el.find('.listing-title').text().trim();
                    const priceText = $el.find('.first-price').text().trim();
                    const mileageText = $el.find('.item-card-specifications li').first().text().trim();
                    const location = $el.find('.item-card-location').text().trim();
                    const img = $el.find('.item-card-picture img').attr('src');
                    const detailUrl = $el.find('.item-card-link').attr('href');
                    
                    if (!title) return;
                    
                    const parts = title.split(' ');
                    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
                    const year = yearMatch ? parseInt(yearMatch[0]) : null;
                    const titleParts = title.replace(yearMatch?.[0] || '', '').trim().split(' ');
                    const make = titleParts[0] || 'Unknown';
                    const model = titleParts.slice(1).join(' ') || 'Unknown';
                    
                    const mileage = mileageText ? parseInt(mileageText.replace(/[^0-9]/g, '')) : null;
                    const priceUSD = extractPriceUSD(priceText);
                    const dailyRate = priceUSD ? Math.round(priceUSD / 30) : null;
                    
                    cars.push({
                        make,
                        model,
                        year: year || new Date().getFullYear(),
                        price_usd: priceUSD,
                        daily_rate: dailyRate,
                        mileage,
                        location: location || null,
                        energy: 'Gasoline', // Default
                        gear_type: 'Automatic', // Default
                        seats: 5, // Default
                        doors: 4, // Default
                        color: 'Unknown',
                        body_type: null,
                        trim: null,
                        image_url: img,
                        source: 'autotrader.com',
                        source_url: detailUrl ? `https://www.autotrader.com${detailUrl}` : null,
                        description: title
                    });
                } catch (e) {
                    // Ignore individual card errors
                }
            });
            
            await new Promise(r => setTimeout(r, 2000));
        }
    } finally {
        await browser.close();
    }
    return cars;
}

// Scrape CarGurus
export async function scrapeCarGurus(pages = 2) {
    const cars = [];
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-blink-features=AutomationControlled','--disable-dev-shm-usage'] });
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 900 });
        
        for (let p = 1; p <= pages; p++) {
            const url = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=10001&showNegotiable=true&sortDir=ASC&sourceContext=carGurusHomePageModel&distance=50000&sortType=DEAL_SCORE&entitySelectingHelper.selectedEntity=d259#resultsPage=${p}`;
            await withRetry(() => page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }), 3, 1500);
            
            const html = await page.content();
            const $ = cheerio.load(html);
            
            $('[data-cg-ft="car-blade"]').each((_, el) => {
                try {
                    const $el = $(el);
                    const title = $el.find('[data-cg-ft="car-blade-link"]').text().trim();
                    const priceText = $el.find('[data-testid="srp-tile-price"]').text().trim();
                    const mileageText = $el.find('[data-testid="srp-tile-mileage"]').text().trim();
                    const dealerText = $el.find('[data-testid="srp-tile-dealer-name"]').text().trim();
                    const img = $el.find('img').attr('src');
                    
                    if (!title) return;
                    
                    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
                    const year = yearMatch ? parseInt(yearMatch[0]) : null;
                    const titleParts = title.replace(yearMatch?.[0] || '', '').trim().split(' ');
                    const make = titleParts[0] || 'Unknown';
                    const model = titleParts.slice(1).join(' ') || 'Unknown';
                    
                    const mileage = mileageText ? parseInt(mileageText.replace(/[^0-9]/g, '')) : null;
                    const priceUSD = extractPriceUSD(priceText);
                    const dailyRate = priceUSD ? Math.round(priceUSD / 30) : null;
                    
                    cars.push({
                        make,
                        model,
                        year: year || new Date().getFullYear(),
                        price_usd: priceUSD,
                        daily_rate: dailyRate,
                        mileage,
                        location: dealerText || null,
                        energy: 'Gasoline',
                        gear_type: 'Automatic',
                        seats: 5,
                        doors: 4,
                        color: 'Unknown',
                        body_type: null,
                        trim: null,
                        image_url: img,
                        source: 'cargurus.com',
                        source_url: null,
                        description: title
                    });
                } catch (e) {
                    // Ignore individual card errors
                }
            });
            
            await new Promise(r => setTimeout(r, 2000));
        }
    } finally {
        await browser.close();
    }
    return cars;
}

// Multi-source comprehensive scraper
export async function scrapeAllSources(options = {}) {
    const {
        carsdotcomPages = 2,
        autotraderPages = 2,
        cargurusPages = 2,
        enableAllSources = true
    } = options;
    
    console.log('🚀 Starting comprehensive vehicle scraping...');
    await ensureVehiclesSchema();
    
    let allCars = [];
    const results = {
        sources: {},
        totalScraped: 0,
        totalUnique: 0,
        totalSaved: 0,
        totalFailed: 0
    };
    
    // Scrape Cars.com
    try {
        console.log('🚗 Scraping Cars.com...');
        const carsDotComResults = await scrapeCarsDotCom(carsdotcomPages);
        allCars = [...allCars, ...carsDotComResults];
        results.sources['cars.com'] = {
            scraped: carsDotComResults.length,
            status: 'success'
        };
        console.log(`✅ Cars.com: ${carsDotComResults.length} vehicles scraped`);
    } catch (error) {
        console.error('❌ Cars.com scraping failed:', error.message);
        results.sources['cars.com'] = {
            scraped: 0,
            status: 'failed',
            error: error.message
        };
    }
    
    if (enableAllSources) {
        // Scrape AutoTrader
        try {
            console.log('🚗 Scraping AutoTrader...');
            const autoTraderResults = await scrapeAutoTrader(autotraderPages);
            allCars = [...allCars, ...autoTraderResults];
            results.sources['autotrader.com'] = {
                scraped: autoTraderResults.length,
                status: 'success'
            };
            console.log(`✅ AutoTrader: ${autoTraderResults.length} vehicles scraped`);
        } catch (error) {
            console.error('❌ AutoTrader scraping failed:', error.message);
            results.sources['autotrader.com'] = {
                scraped: 0,
                status: 'failed',
                error: error.message
            };
        }
        
        // Scrape CarGurus
        try {
            console.log('🚗 Scraping CarGurus...');
            const carGurusResults = await scrapeCarGurus(cargurusPages);
            allCars = [...allCars, ...carGurusResults];
            results.sources['cargurus.com'] = {
                scraped: carGurusResults.length,
                status: 'success'
            };
            console.log(`✅ CarGurus: ${carGurusResults.length} vehicles scraped`);
        } catch (error) {
            console.error('❌ CarGurus scraping failed:', error.message);
            results.sources['cargurus.com'] = {
                scraped: 0,
                status: 'failed',
                error: error.message
            };
        }
    }
    
    results.totalScraped = allCars.length;
    
    // Deduplicate
    console.log('🔄 Deduplicating vehicles...');
    const unique = allCars.filter((c, i, arr) => 
        i === arr.findIndex(x => 
            x.make.toLowerCase() === c.make.toLowerCase() && 
            x.model.toLowerCase() === c.model.toLowerCase() && 
            x.year === c.year
        )
    );
    
    results.totalUnique = unique.length;
    console.log(`📊 Found ${unique.length} unique vehicles from ${allCars.length} total scraped`);
    
    // Save to database
    console.log('💾 Saving vehicles to database...');
    const { saved, failed } = await saveVehicles(unique);
    
    results.totalSaved = saved.length;
    results.totalFailed = failed.length;
    results.saved = saved;
    results.failed = failed;
    
    return results;
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function withRetry(fn, retries = 3, delayMs = 1000) {
    let lastErr;
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fn();
            if (i > 0) console.log(`retry succeeded on attempt ${i + 1}`);
            return res;
        } catch (e) {
            lastErr = e;
            console.warn(`retry attempt ${i + 1} failed: ${e?.message || e}`);
            await wait(delayMs * Math.pow(2, i));
        }
    }
    throw lastErr;
}

export async function checkTargetReachability(url) {
    const result = { url, reachable: false, method: null, status: null, reason: null };
    try {
        // Try HEAD first with a browser-like UA
        const head = await axios.head(url, {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            validateStatus: s => s >= 200 && s < 500
        });
        result.method = 'HEAD';
        result.status = head.status;
        if (head.status >= 200 && head.status < 500) {
            result.reachable = true;
            return result;
        }
    } catch (e) {
        result.reason = `HEAD failed: ${e?.message || e}`;
    }

    try {
        const get = await axios.get(url, {
            timeout: 7000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            validateStatus: s => s >= 200 && s < 500
        });
        result.method = 'GET';
        result.status = get.status;
        if (get.status >= 200 && get.status < 500) {
            result.reachable = true;
            return result;
        }
    } catch (e) {
        result.reason = `GET failed: ${e?.message || e}`;
    }

    try {
        const { address } = await dns.promises.lookup(new URL(url).hostname);
        if (address) {
            result.method = 'DNS';
            result.status = 0;
            result.reachable = true; // DNS resolves → consider reachable despite HTTP hardening
            return result;
        }
    } catch (e) {
        result.reason = `DNS failed: ${e?.message || e}`;
    }
    return result;
}



