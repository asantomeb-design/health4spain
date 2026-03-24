#!/usr/bin/env node

/**
 * Script para corregir masivamente todos los links de /es/contacto? a /es/solicitar?
 * 
 * Busca y reemplaza en todos los archivos:
 * - /es/contacto?servicio= → /es/solicitar?servicio=
 * - /es/contacto?ciudad= → /es/solicitar?ciudad=
 * - /es/contacto?perfil= → /es/solicitar?perfil=
 * - /es/contacto?slug= → /es/solicitar?slug=
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/es/destinos/page.tsx',
  'src/app/es/servicios/[slug]/page.tsx',
];

console.log('🔧 Iniciando corrección masiva de links...\n');

let totalChanges = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  No existe: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Reemplazar todos los patrones
  content = content.replace(/\/es\/contacto\?servicio=/g, '/es/solicitar?servicio=');
  content = content.replace(/\/es\/contacto\?ciudad=/g, '/es/solicitar?ciudad=');
  content = content.replace(/\/es\/contacto\?perfil=/g, '/es/solicitar?perfil=');
  content = content.replace(/\/es\/contacto\?slug=/g, '/es/solicitar?slug=');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    const changes = (originalContent.match(/\/es\/contacto\?/g) || []).length;
    totalChanges += changes;
    console.log(`✅ ${filePath} - ${changes} cambios`);
  } else {
    console.log(`✓  ${filePath} - sin cambios`);
  }
});

console.log(`\n🎉 Completado! Total de cambios: ${totalChanges}`);
console.log('\nArchivos corregidos:');
filesToFix.forEach(f => console.log(`  - ${f}`));
