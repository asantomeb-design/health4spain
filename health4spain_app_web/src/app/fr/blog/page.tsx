import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPosts as fetchBlogPosts, getPopularBlogPosts } from '@/lib/data';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildAlternates } from '@/lib/seo';

const LOCALE: Locale = 'fr';
const t = getDictionary(LOCALE);

export const revalidate = 3600;
export const metadata: Metadata = {
  title: t.blog.metaTitle,
  description: t.blog.metaDesc,
  alternates: buildAlternates(LOCALE, '/blog'),
};

const categoryImages: Record<string, string> = {
  'guias-ciudad': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80',
  'procedimientos': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
  'salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  'finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  'vida-espana': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
};

interface BlogPost { slug: string; title: string; excerpt: string; category: string; published_at: string; featured_image?: string; views?: number; }

export default async function BlogPage() {
  const posts = (await fetchBlogPosts(LOCALE)) as BlogPost[];
  const popularPosts = (await getPopularBlogPosts(LOCALE)) as BlogPost[];
  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <>
      <section className="section-blue-dark">
        <div className="container-base">
          <h1 className="text-white mb-4">{t.blog.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{t.blog.subtitle}</p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container-base">
          {posts.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500 text-lg">{t.blog.noArticles}</p></div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 max-w-6xl mx-auto">{t.blog.allArticles}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {posts.map((post) => {
                    const imageUrl = post.featured_image || categoryImages[post.category] || categoryImages['vida-espana'];
                    const categoryLabel = t.blog.categoryLabels[post.category] || post.category;
                    return (
                      <article key={post.slug} className="group bg-white border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                        <div className="relative h-40 overflow-hidden">
                          <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-xs uppercase tracking-wider font-semibold">{categoryLabel}</span>
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            <Link href={`/fr/blog/${post.slug}`}>{post.title}</Link>
                          </h2>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                          <Link href={`/fr/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:gap-2 transition-all border-b-2 border-accent">{t.blog.readMore}</Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
