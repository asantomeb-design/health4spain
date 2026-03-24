import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const INTERVALS = [9, 13, 16];

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandomInterval(): number {
  return INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  const randomHour = 8 + Math.floor(Math.random() * 12); // entre 8:00 y 19:59
  const randomMinute = Math.floor(Math.random() * 60);
  result.setHours(randomHour, randomMinute, Math.floor(Math.random() * 60), 0);
  return result;
}

async function main() {
  console.log('📰 Redistribuyendo fechas de artículos del blog...\n');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, category, lang, published_at')
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error obteniendo posts:', error);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('⚠️  No se encontraron artículos publicados.');
    process.exit(0);
  }

  console.log(`📊 Artículos encontrados: ${posts.length}`);

  const shuffledPosts = shuffle(posts);

  console.log('\n🔀 Orden aleatorio generado:');
  shuffledPosts.forEach((p, i) => {
    console.log(`   ${i + 1}. [${p.category}] ${p.title} (${p.lang})`);
  });

  const today = new Date();
  today.setHours(10, 0, 0, 0);

  let currentDate = new Date(today);
  const updates: { id: string; title: string; published_at: string; created_at: string; updated_at: string; daysAgo: number }[] = [];

  // El artículo más reciente es "hoy" (o ayer para que no sea exactamente ahora)
  currentDate = subtractDays(today, 1 + Math.floor(Math.random() * 2));

  for (const post of shuffledPosts) {
    const publishDate = new Date(currentDate);
    const createdDate = subtractDays(publishDate, Math.floor(Math.random() * 3));
    const updatedDate = new Date(publishDate);

    const daysAgo = Math.round((today.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));

    updates.push({
      id: post.id,
      title: post.title,
      published_at: publishDate.toISOString(),
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      daysAgo,
    });

    const interval = pickRandomInterval();
    currentDate = subtractDays(currentDate, interval);
  }

  const oldestDate = updates[updates.length - 1]?.published_at;
  const newestDate = updates[0]?.published_at;
  const totalDaysSpan = Math.round(
    (new Date(newestDate).getTime() - new Date(oldestDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  console.log(`\n📅 Rango de fechas:`);
  console.log(`   Más reciente: ${new Date(newestDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Más antiguo:  ${new Date(oldestDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Período total: ~${totalDaysSpan} días (~${(totalDaysSpan / 365).toFixed(1)} años)\n`);

  console.log('📝 Distribución de fechas:');
  for (const u of updates) {
    const dateStr = new Date(u.published_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    console.log(`   ${dateStr} (hace ${u.daysAgo} días) → ${u.title}`);
  }

  console.log('\n🔄 Aplicando actualizaciones en Supabase...');

  let successCount = 0;
  let errorCount = 0;

  for (const u of updates) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        published_at: u.published_at,
        created_at: u.created_at,
        updated_at: u.updated_at,
      })
      .eq('id', u.id);

    if (updateError) {
      console.error(`   ❌ Error actualizando "${u.title}":`, updateError);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log('\n========================================');
  console.log('🎉 Redistribución completada!');
  console.log(`✅ Actualizados: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📅 Período cubierto: ~${(totalDaysSpan / 365).toFixed(1)} años`);
  console.log('========================================\n');
}

main().catch(console.error);
