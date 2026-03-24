import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getBlogPost as fetchBlogPost, getBlogPostMeta as fetchBlogPostMeta, getRelatedBlogPosts } from '@/lib/data';
import type { Locale } from '@/lib/routes';
import { buildDynamicAlternates, buildOpenGraph, buildTwitter, blogPostingJsonLd, JsonLd } from '@/lib/seo';

const LOCALE: Locale = 'es';

export const revalidate = 3600;

// Mapeo de categorías
const categoryLabels: Record<string, string> = {
  'guias-ciudad': 'Guías de Ciudad',
  'procedimientos': 'Procedimientos',
  'salud': 'Seguros y Salud',
  'finanzas': 'Finanzas',
  'vida-espana': 'Vida en España',
};

const categoryImages: Record<string, string> = {
  'guias-ciudad': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200',
  'procedimientos': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  'salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
  'finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  'vida-espana': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published_at: string;
  author_name: string;
  featured_image?: string;
  views: number;
}

async function getBlogPostMeta(slug: string) {
  return fetchBlogPostMeta(slug, LOCALE);
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return fetchBlogPost(slug, LOCALE) as Promise<BlogPost | null>;
}

async function getRelatedPosts(category: string, currentSlug: string) {
  return getRelatedBlogPosts(category, currentSlug, LOCALE);
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostMeta(slug);
  
  if (!post) {
    return { title: 'Artículo no encontrado' };
  }
  
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';
  const categoryLabel = categoryLabels[post.category] || post.category;
  
  const title = `${post.title} | Health4Spain Blog`;
  const description = post.excerpt?.slice(0, 155) || `${post.title}. Guía práctica para extranjeros en España.`;
  
  return {
    title,
    description,
    alternates: buildDynamicAlternates(LOCALE, 'blog', slug),
    openGraph: buildOpenGraph(LOCALE, {
      title: post.title,
      description: description,
      url: `${BASE}/${LOCALE}/blog/${slug}`,
      type: 'article',
      publishedTime: post.published_at,
      image: post.featured_image,
    }),
    twitter: buildTwitter({
      title: post.title,
      description: description,
      image: post.featured_image,
    }),
  };
}

export async function generateStaticParams() {
  const { getBlogSlugs } = await import('@/lib/data');
  const slugs = await getBlogSlugs(LOCALE);
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug);
  const categoryLabel = categoryLabels[post.category] || post.category;
  const imageUrl = post.featured_image || categoryImages[post.category] || categoryImages['vida-espana'];

  const blogJsonLd = blogPostingJsonLd({
    title: post.title,
    description: post.excerpt,
    url: `/${LOCALE}/blog/${post.slug}`,
    image: post.featured_image,
    publishedAt: post.published_at,
    author: post.author_name || 'Health4Spain',
    locale: LOCALE,
  });

  return (
    <>
      <JsonLd data={blogJsonLd} />
      {/* ARTICLE HEADER */}
      <article className="section">
        <div className="container-narrow">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/es" className="hover:text-accent">Inicio</Link>
            <span>/</span>
            <Link href="/es/blog" className="hover:text-accent">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{categoryLabel}</span>
          </nav>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            <span className="uppercase text-[0.8rem] text-accent tracking-wider font-semibold">
              {categoryLabel}
            </span>
            <span className="text-gray-400">•</span>
            <time className="text-[0.9rem] text-gray-500">
              {new Date(post.published_at).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span className="text-[0.9rem] text-gray-500">{post.views || 0} vistas</span>
          </div>

          {/* Title */}
          <h1 className="leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-8 border-l-4 border-accent pl-6">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
            <div className="w-12 h-12 bg-[#293f92] flex items-center justify-center text-white font-bold">
              H4S
            </div>
            <div>
              <div className="font-semibold text-[#1a1a1a]">{post.author_name || 'Health4Spain Team'}</div>
              <div className="text-sm text-gray-500">Equipo Editorial</div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container-base mb-16">
          <div 
            className="w-full h-[500px] bg-cover bg-center border-[15px] border-gray-100"
            style={{
              backgroundImage: `url('${imageUrl}')`
            }}
          />
        </div>

        {/* Article Content */}
        <div className="container-narrow">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-[#293f92]
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-accent prose-a:no-underline prose-a:font-medium hover:prose-a:underline
              prose-strong:text-[#1a1a1a] prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:mb-2 prose-li:text-gray-700
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA Box */}
          <div className="mt-16 p-10 bg-gray-50 border-l-4 border-accent">
            <h3 className="text-2xl font-bold mb-4">
              ¿Necesitas ayuda para establecerte en España?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Te conectamos con profesionales verificados que hablan tu idioma y conocen tus necesidades específicas.
            </p>
            <Link
              href="/es/solicitar"
              className="btn-minimal-lg"
            >
              Hablar con un Experto
            </Link>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-bold mb-8">Artículos Relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => {
                  const relatedImage = relatedPost.featured_image || categoryImages[relatedPost.category];
                  const relatedCategory = categoryLabels[relatedPost.category] || relatedPost.category;
                  
                  return (
                    <Link key={relatedPost.slug} href={`/es/blog/${relatedPost.slug}`} className="group">
                      <div className="h-48 bg-gray-200 mb-4 overflow-hidden">
                        <div 
                          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                          style={{
                            backgroundImage: `url('${relatedImage}')`
                          }}
                        />
                      </div>
                      <div className="text-xs uppercase text-accent font-semibold mb-2">{relatedCategory}</div>
                      <h4 className="text-lg font-semibold text-[#1a1a1a] group-hover:text-accent transition-colors">
                        {relatedPost.title}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
