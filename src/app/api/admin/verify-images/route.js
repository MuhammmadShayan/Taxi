import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db.js';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Get all cars with images
        const cars = await query(`
            SELECT id, make, model, year, images, created_at
            FROM cars 
            WHERE images IS NOT NULL AND images != '[]'
            ORDER BY id DESC
            LIMIT 20
        `);
        
        const imageVerification = [];
        
        for (const car of cars) {
            let parsedImages = [];
            try {
                parsedImages = JSON.parse(car.images || '[]');
            } catch (e) {
                parsedImages = [];
            }
            
            const imageStatuses = [];
            
            for (const imagePath of parsedImages) {
                if (imagePath) {
                    // Check if file exists
                    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
                    let fileExists = false;
                    let fileSize = 0;
                    
                    try {
                        const stats = await fs.stat(fullPath);
                        fileExists = true;
                        fileSize = stats.size;
                    } catch (error) {
                        fileExists = false;
                    }
                    
                    imageStatuses.push({
                        path: imagePath,
                        fullPath: fullPath,
                        exists: fileExists,
                        size: fileSize,
                        url: `http://localhost:3001${imagePath}`
                    });
                }
            }
            
            imageVerification.push({
                carId: car.id,
                carInfo: `${car.make} ${car.model} ${car.year}`,
                totalImages: parsedImages.length,
                images: imageStatuses,
                allImagesExist: imageStatuses.every(img => img.exists),
                createdAt: car.created_at
            });
        }
        
        // Summary statistics
        const totalCars = imageVerification.length;
        const carsWithAllImages = imageVerification.filter(car => car.allImagesExist).length;
        const totalImages = imageVerification.reduce((sum, car) => sum + car.totalImages, 0);
        const existingImages = imageVerification.reduce((sum, car) => 
            sum + car.images.filter(img => img.exists).length, 0
        );
        
        return NextResponse.json({
            success: true,
            message: 'Image verification completed',
            summary: {
                totalCars,
                carsWithAllImages,
                totalImages,
                existingImages,
                successRate: totalImages > 0 ? Math.round((existingImages / totalImages) * 100) : 0
            },
            cars: imageVerification,
            recommendations: [
                'Images are stored in /public/images/cars/',
                'Image paths are stored as JSON in the images column',
                'Missing images fall back to default-car.svg',
                'All images are accessible via HTTP URLs'
            ]
        });
        
    } catch (error) {
        console.error('Image verification error:', error);
        return NextResponse.json({
            error: 'Image verification failed',
            details: error.message
        }, { status: 500 });
    }
}
