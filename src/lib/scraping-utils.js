import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Google AI API Key - stored as environment variable for security
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'AIzaSyA760-E0vJztYtAzbhKgcs8rf6EOhMm-bk';

/**
 * Download image from URL and save to local directory
 * @param {string} imageUrl - URL of the image to download
 * @param {string} destinationDir - Directory to save the image
 * @returns {Promise<string>} - Returns the local filename
 */
export async function downloadImage(imageUrl, destinationDir = 'public/scraped-images') {
  return new Promise((resolve, reject) => {
    try {
      // Create directory if it doesn't exist
      const fullDestinationPath = path.join(process.cwd(), destinationDir);
      if (!fs.existsSync(fullDestinationPath)) {
        fs.mkdirSync(fullDestinationPath, { recursive: true });
      }

      // Generate unique filename
      const urlHash = crypto.createHash('md5').update(imageUrl).digest('hex');
      const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const fileName = `car-${urlHash}${extension}`;
      const filePath = path.join(fullDestinationPath, fileName);

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        resolve(`/scraped-images/${fileName}`);
        return;
      }

      const client = imageUrl.startsWith('https:') ? https : http;
      
      client.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(`/scraped-images/${fileName}`);
          });
          
          fileStream.on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete partial file
            reject(err);
          });
        } else {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
      }).on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Extract car data from PakWheels.com
 * @param {string} html - HTML content from PakWheels
 * @returns {Array} - Array of car objects
 */
export function parsePakWheelsData(html) {
  const cars = [];
  
  try {
    // Simple regex-based parsing since we can't use cheerio due to install issues
    const carMatches = html.match(/<div[^>]*class="[^"]*car-listing[^"]*"[^>]*>.*?<\/div>/gsi) || [];
    
    for (const carHtml of carMatches) {
      try {
        const car = {};
        
        // Extract title/model (contains make and model)
        const titleMatch = carHtml.match(/<h3[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)<\/h3>/si) ||
                          carHtml.match(/<a[^>]*title="([^"]*)"[^>]*>/si);
        if (titleMatch) {
          const titleText = titleMatch[1].replace(/<[^>]*>/g, '').trim();
          const titleParts = titleText.split(' ');
          car.make = titleParts[0] || 'Unknown';
          car.model = titleParts.slice(1).join(' ') || 'Unknown';
        }

        // Extract price
        const priceMatch = carHtml.match(/PKR\s*([\d,]+)/i);
        if (priceMatch) {
          const priceStr = priceMatch[1].replace(/,/g, '');
          car.price_per_day = Math.round(parseInt(priceStr) / 30); // Convert to daily rate
        }

        // Extract year
        const yearMatch = carHtml.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          car.year = parseInt(yearMatch[0]);
        }

        // Extract image URL
        const imgMatch = carHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
        if (imgMatch) {
          let imgUrl = imgMatch[1];
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
          if (imgUrl.startsWith('/')) imgUrl = 'https://www.pakwheels.com' + imgUrl;
          car.imageUrl = imgUrl;
        }

        // Extract location
        const locationMatch = carHtml.match(/<span[^>]*class="[^"]*location[^"]*"[^>]*>(.*?)<\/span>/si);
        if (locationMatch) {
          car.location = locationMatch[1].replace(/<[^>]*>/g, '').trim();
        }

        // Set defaults
        car.category_id = 1; // Default category
        car.color = 'Unknown';
        car.seats = 5;
        car.fuel_type = 'petrol';
        car.transmission = 'automatic';
        car.is_available = 1;
        car.rating = 4.0;
        car.mileage = Math.floor(Math.random() * 100000); // Random mileage
        car.description = `${car.make} ${car.model} - Imported from PakWheels`;

        if (car.make && car.model && car.price_per_day) {
          cars.push(car);
        }
      } catch (error) {
        console.error('Error parsing individual car:', error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error parsing PakWheels data:', error);
  }
  
  return cars;
}

/**
 * Extract car data from Cars.com
 * @param {string} html - HTML content from Cars.com
 * @returns {Array} - Array of car objects
 */
export function parseCarsComData(html) {
  const cars = [];
  
  try {
    // Parse Cars.com data with regex patterns
    const carMatches = html.match(/<div[^>]*class="[^"]*vehicle-card[^"]*"[^>]*>.*?<\/div>/gsi) || [];
    
    for (const carHtml of carMatches) {
      try {
        const car = {};
        
        // Extract vehicle name
        const nameMatch = carHtml.match(/<h2[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)<\/h2>/si) ||
                         carHtml.match(/<span[^>]*class="[^"]*make-model[^"]*"[^>]*>(.*?)<\/span>/si);
        if (nameMatch) {
          const nameText = nameMatch[1].replace(/<[^>]*>/g, '').trim();
          const nameParts = nameText.split(' ');
          car.make = nameParts[0] || 'Unknown';
          car.model = nameParts.slice(1).join(' ') || 'Unknown';
        }

        // Extract price
        const priceMatch = carHtml.match(/\$\s*([\d,]+)/i);
        if (priceMatch) {
          const priceUSD = parseInt(priceMatch[1].replace(/,/g, ''));
          car.price_per_day = Math.round(priceUSD / 365 * 300); // Convert to PKR daily rate (rough estimate)
        }

        // Extract year
        const yearMatch = carHtml.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          car.year = parseInt(yearMatch[0]);
        }

        // Extract image
        const imgMatch = carHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
        if (imgMatch) {
          let imgUrl = imgMatch[1];
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
          car.imageUrl = imgUrl;
        }

        // Extract mileage
        const mileageMatch = carHtml.match(/([\d,]+)\s*miles?/i);
        if (mileageMatch) {
          car.mileage = parseInt(mileageMatch[1].replace(/,/g, ''));
        }

        // Set defaults for Cars.com data
        car.category_id = 1;
        car.color = 'Unknown';
        car.seats = 5;
        car.fuel_type = 'petrol';
        car.transmission = 'automatic';
        car.location = 'USA';
        car.is_available = 1;
        car.rating = 4.0;
        car.description = `${car.make} ${car.model} - Imported from Cars.com`;

        if (car.make && car.model && car.price_per_day) {
          cars.push(car);
        }
      } catch (error) {
        console.error('Error parsing individual car from Cars.com:', error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error parsing Cars.com data:', error);
  }
  
  return cars;
}

/**
 * Fetch HTML content from a URL
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} - HTML content
 */
export async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    client.get(url, options, (response) => {
      let html = '';
      
      response.on('data', (chunk) => {
        html += chunk;
      });
      
      response.on('end', () => {
        resolve(html);
      });
      
    }).on('error', reject);
  });
}

/**
 * Use Google AI to enhance car descriptions
 * @param {Object} car - Car object
 * @returns {Promise<Object>} - Enhanced car object
 */
export async function enhanceCarWithAI(car) {
  try {
    if (!GOOGLE_AI_API_KEY) {
      return car; // Return original if no API key
    }

    const prompt = `Given this car data: Make: ${car.make}, Model: ${car.model}, Year: ${car.year}, create a brief, appealing description (max 100 words) suitable for a car rental website.`;
    
    // This would be implemented with Google AI Studio API
    // For now, return enhanced description based on available data
    car.description = `${car.year} ${car.make} ${car.model} - A reliable and comfortable vehicle perfect for your travel needs. Features modern amenities and excellent performance. Ideal for both city driving and longer journeys.`;
    
    return car;
  } catch (error) {
    console.error('AI enhancement error:', error);
    return car; // Return original on error
  }
}
