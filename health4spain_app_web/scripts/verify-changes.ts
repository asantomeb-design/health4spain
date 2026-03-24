/**
 * Verificar si los cambios se aplicaron correctamente
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function verify() {
  console.log('🔍 Verificando página de Yecla...\n');

  const { data: landing, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', 'abogados-yecla')
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('📄 CONTENIDO ACTUAL DE YECLA:\n');
  console.log('hero_title:', landing.hero_title);
  console.log('\nhero_subtitle:', landing.hero_subtitle);
  console.log('\nservices_title:', landing.services_title);
  console.log('\nServicios:');
  landing.services?.forEach((s: any, i: number) => {
    console.log(`  ${i + 1}. ${s.title}: ${s.description}`);
  });

  console.log('\n\n🔍 Buscando "extranjería" en el contenido...\n');
  const contenido = JSON.stringify(landing).toLowerCase();
  const menciones = (contenido.match(/extranjería|extranjer[ií]a/g) || []).length;
  
  if (menciones > 0) {
    console.log(`❌ PROBLEMA: Todavía hay ${menciones} menciones de "extranjería"`);
    console.log('\n¿Dónde aparece?');
    if (landing.meta_keywords?.toLowerCase().includes('extranjería')) console.log('  - meta_keywords');
    if (landing.hero_title?.toLowerCase().includes('extranjería')) console.log('  - hero_title');
    if (JSON.stringify(landing.services || []).toLowerCase().includes('extranjería')) {
      console.log('  - services');
      landing.services?.forEach((s: any, i: number) => {
        if (s.title?.toLowerCase().includes('extranjería') || s.description?.toLowerCase().includes('extranjería')) {
          console.log(`    > Servicio ${i + 1}: ${s.title}`);
        }
      });
    }
  } else {
    console.log('✅ ¡PERFECTO! Ya no hay menciones de "extranjería"');
  }

  console.log('\n\n📅 Fecha de última actualización:', landing.updated_at);
  console.log('🤖 Generado por IA:', landing.generado_por_ia);
  console.log('📅 Fecha de generación:', landing.fecha_generacion);
}

verify().catch(console.error);
