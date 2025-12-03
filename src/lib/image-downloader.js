import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';

// Real image download utility (server-side, avoids Node fetch/undici quirks)
export async function downloadImage(imageUrl, filename) {
    try {
        // Ensure images directory exists
        const imagesDir = path.join(process.cwd(), 'public', 'images', 'cars');
        await fs.mkdir(imagesDir, { recursive: true });

        console.log(`Downloading image: ${imageUrl} as ${filename}`);

        // Use axios over raw fetch to avoid undici / File polyfill issues
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Some CDNs reject non-browser clients without this
            validateStatus: (status) => status >= 200 && status < 400,
            timeout: 10000
        });

        const buffer = Buffer.from(response.data);

        const filePath = path.join(imagesDir, filename);
        await fs.writeFile(filePath, buffer);

        console.log(`✅ Image downloaded successfully: ${filename}`);
        return `/images/cars/${filename}`;

    } catch (error) {
        console.error('❌ Error downloading image:', error?.message || error);
        // Return a default car image path
        return '/images/cars/default-car.svg';
    }
}

// Generate unique filename
export function generateFilename(originalUrl, carData) {
    const timestamp = Date.now();
    
    // Sanitize car identifier - remove invalid filename characters
    const carIdentifier = `${carData.make}_${carData.model}_${carData.year}`
        .replace(/\s+/g, '_')  // Replace spaces with underscores
        .replace(/[/\\:*?"<>|]/g, '_')  // Replace invalid filename characters
        .replace(/_+/g, '_');  // Replace multiple underscores with single
    
    // Try to get extension from URL
    let extension = 'jpg';
    try {
        const url = new URL(originalUrl);
        const pathname = url.pathname;
        const ext = pathname.split('.').pop();
        if (ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase())) {
            extension = ext.toLowerCase();
        }
    } catch (error) {
        // Use default extension if URL parsing fails
    }
    
    return `${carIdentifier}_${timestamp}.${extension}`;
}

// Create a default car image if it doesn't exist
export async function ensureDefaultCarImage() {
    try {
        const imagesDir = path.join(process.cwd(), 'public', 'images', 'cars');
        await fs.mkdir(imagesDir, { recursive: true });
        
        const defaultImagePath = path.join(imagesDir, 'default-car.jpg');
        
        // Check if default image already exists
        try {
            await fs.access(defaultImagePath);
            return; // File exists, no need to create
        } catch {
            // File doesn't exist, create it
        }
        
        // Create a simple SVG as default car image
        const svgContent = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f0f0f0"/>
            <rect x="50" y="100" width="300" height="100" rx="20" fill="#333"/>
            <circle cx="120" cy="220" r="30" fill="#222"/>
            <circle cx="280" cy="220" r="30" fill="#222"/>
            <rect x="80" y="110" width="60" height="40" fill="#87CEEB"/>
            <rect x="160" y="110" width="80" height="40" fill="#87CEEB"/>
            <rect x="260" y="110" width="60" height="40" fill="#87CEEB"/>
            <text x="200" y="270" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">Default Car</text>
        </svg>`;
        
        // For now, we'll create a simple text file as placeholder
        // In production, you might want to have an actual default car image
        const placeholderContent = 'Default car image placeholder';
        await fs.writeFile(defaultImagePath.replace('.jpg', '.txt'), placeholderContent);
        
        console.log('✅ Default car image placeholder created');
    } catch (error) {
        console.error('❌ Error creating default car image:', error);
    }
}
