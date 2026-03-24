/**
 * Script para verificar posts del blog en Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkBlogPosts() {
  console.log('\n🔍 Verificando posts del blog...\n');
  
  try {
    const { data: posts, error, count } = await supabase
      .from('blog_posts')
      .select('slug, title, status, published_at', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`📊 Total de posts: ${count}`);
    
    if (posts && posts.length > 0) {
      console.log('\n✅ Posts encontrados:\n');
      posts.forEach(post => {
        console.log(`   - ${post.slug}`);
        console.log(`     Título: ${post.title}`);
        console.log(`     Estado: ${post.status}`);
        console.log(`     Publicado: ${post.published_at || 'No publicado'}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay posts en la base de datos');
      console.log('\n💡 Sugerencia: Ejecuta el script de generación de posts:');
      console.log('   npm run generate-blog\n');
    }
    
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

checkBlogPosts();
