/**
 * Audita meta_title y meta_description de todas las páginas.
 * Detecta duplicados en landings (ninguna página debe tener los mismos metas).
 *
 * Uso:
 *   npx tsx scripts/audit-metas.ts
 *
 * Requiere .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🔍 AUDITORÍA DE METAS (meta_title, meta_description)\n');
  console.log('═'.repeat(60));

  const { data: landings, error } = await supabase
    .from('landing_pages')
    .select('id, slug, servicio_slug, ciudad_slug, ciudad_nombre, meta_title, meta_description')
    .eq('activo', true)
    .eq('idioma', 'es')
    .order('servicio_slug', { ascending: true })
    .order('ciudad_slug', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!landings || landings.length === 0) {
    console.log('No hay landings activas.');
    return;
  }

  console.log(`\n📋 Total landings: ${landings.length}\n`);

  // Detectar duplicados de meta_title
  const byTitle = new Map<string, typeof landings>();
  landings.forEach((l) => {
    const t = (l.meta_title || '').trim();
    if (!byTitle.has(t)) byTitle.set(t, []);
    byTitle.get(t)!.push(l);
  });

  const duplicadosTitle = [...byTitle.entries()].filter(([, arr]) => arr.length > 1);
  if (duplicadosTitle.length > 0) {
    console.log('⚠️  DUPLICADOS EN meta_title:');
    duplicadosTitle.forEach(([title, arr]) => {
      console.log(`   "${title}" (${arr.length} veces):`);
      arr.forEach((l) => console.log(`     - ${l.slug}`));
      console.log('');
    });
  } else {
    console.log('✅ Ningún meta_title duplicado.\n');
  }

  // Detectar duplicados de meta_description
  const byDesc = new Map<string, typeof landings>();
  landings.forEach((l) => {
    const d = (l.meta_description || '').trim();
    if (!byDesc.has(d)) byDesc.set(d, []);
    byDesc.get(d)!.push(l);
  });

  const duplicadosDesc = [...byDesc.entries()].filter(([, arr]) => arr.length > 1);
  if (duplicadosDesc.length > 0) {
    console.log('⚠️  DUPLICADOS EN meta_description:');
    duplicadosDesc.forEach(([desc, arr]) => {
      const preview = desc.length > 60 ? desc.slice(0, 57) + '...' : desc;
      console.log(`   "${preview}" (${arr.length} veces):`);
      arr.forEach((l) => console.log(`     - ${l.slug}`));
      console.log('');
    });
  } else {
    console.log('✅ Ninguna meta_description duplicada.\n');
  }

  // Listar metas que no incluyen ciudad/servicio (posible problema SEO)
  const sinCiudad = landings.filter((l) => {
    const ciudad = (l.ciudad_nombre || l.ciudad_slug || '').toLowerCase();
    const title = (l.meta_title || '').toLowerCase();
    return ciudad && !title.includes(ciudad);
  });

  if (sinCiudad.length > 0) {
    console.log('⚠️  meta_title SIN mencionar la ciudad:');
    sinCiudad.slice(0, 10).forEach((l) => {
      console.log(`   ${l.slug}: "${(l.meta_title || '').slice(0, 60)}..."`);
    });
    if (sinCiudad.length > 10) console.log(`   ... y ${sinCiudad.length - 10} más\n`);
  }

  console.log('═'.repeat(60));
  console.log('\nPara corregir duplicados en landings, ejecuta:');
  console.log('  npm run regenerate-abogados-landings   (solo abogados)');
  console.log('  npm run regenerate-seguros-landings  (solo seguros)');
  console.log('  npm run regenerate-inmobiliarias-landings');
  console.log('  npm run regenerate-gestorias-landings');
  console.log('\nO regenera todas las landings con el script correspondiente.');
}

main().catch(console.error);
