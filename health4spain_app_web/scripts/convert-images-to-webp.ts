/**
 * Convierte imágenes PNG/JPG de public/images a WebP para mejor LCP y rendimiento.
 * Ejecutar: npx tsx scripts/convert-images-to-webp.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

async function convertToWebP() {
  const files = fs.readdirSync(IMAGES_DIR);
  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;
    
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(IMAGES_DIR, `${baseName}.webp`);
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 4 })
        .toFile(outputPath);
      console.log(`✓ ${file} → ${baseName}.webp`);
    } catch (err) {
      console.error(`✗ Error convirtiendo ${file}:`, err);
    }
  }
}

convertToWebP().then(() => console.log('\nConversión completada.'));
