import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getBlogPost as fetchBlogPost, getBlogPostMeta as fetchBlogPostMeta, getRelatedBlogPosts } from '@/lib/data';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';
import { buildDynamicAlternates, buildOpenGraph, buildTwitter, blogPostingJsonLd, JsonLd } from '@/lib/seo';

const LOCALE: Locale = 'fr';
const t = getDictionary(LOCALE);

export const revalidate = 3600;

export async function generateStaticParams() {
  const { getBlogSlugs } = await import('@/lib/data');
  const slugs = await getBlogSlugs(LOCALE);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostMeta(slug, LOCALE);
  if (!post) return { title: t.blog.articleNotFound };
  
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';
  const description = post.excerpt?.slice(0, 155) || '';
  
  return {
    title: `${post.title} | Health4Spain Blog`,
    description,
    alternates: buildDynamicAlternates(LOCALE, 'blog', slug),
    openGraph: buildOpenGraph(LOCALE, {
      title: post.title,
      description,
      url: `${BASE}/${LOCALE}/blog/${slug}`,
      type: 'article',
      publishedTime: post.published_at,
      image: post.featured_image,
    }),
    twitter: buildTwitter({
      title: post.title,
      description,
      image: post.featured_image,
    }),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug, LOCALE);
  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(post.category, post.slug, LOCALE);
  const categoryLabel = t.blog.categoryLabels[post.category] || post.category;

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
      <article className="section">
      <div className="container-narrow">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/fr" className="hover:text-accent">{t.common.home}</Link><span>/</span>
          <Link href="/fr/blog" className="hover:text-accent">{t.blog.title}</Link><span>/</span>
          <span className="text-gray-900">{categoryLabel}</span>
        </nav>
        <div className="flex items-center gap-4 mb-6">
          <span className="uppercase text-[0.8rem] text-accent tracking-wider font-semibold">{categoryLabel}</span>
          <span className="text-gray-400">•</span>
          <span className="text-[0.9rem] text-gray-500">{post.views || 0} {t.blog.views}</span>
        </div>
        <h1 className="leading-[1.2] mb-6">{post.title}</h1>
        <p className="text-[1.3rem] text-gray-600 leading-relaxed mb-8 border-l-4 border-accent pl-6">{post.excerpt}</p>
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
          <div className="w-12 h-12 bg-[#293f92] flex items-center justify-center text-white font-bold">H4S</div>
          <div><div className="font-semibold">{post.author_name || 'Health4Spain Team'}</div><div className="text-sm text-gray-500">{t.blog.editorialTeam}</div></div>
        </div>
      </div>
      <div className="container-narrow">
        <div className="prose prose-lg max-w-none prose-headings:text-[#293f92] prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-accent" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-16 p-10 bg-gray-50 border-l-4 border-accent">
          <h3 className="text-2xl font-bold mb-4">{t.blog.needHelp}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{t.blog.needHelpDesc}</p>
          <Link href="/fr/demande" className="btn-minimal-lg">{t.blog.talkToExpert}</Link>
        </div>
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-8">{t.blog.relatedArticles}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.slug} href={`/fr/blog/${rp.slug}`} className="group">
                  <div className="text-xs uppercase text-accent font-semibold mb-2">{t.blog.categoryLabels[rp.category] || rp.category}</div>
                  <h4 className="text-lg font-semibold group-hover:text-accent transition-colors">{rp.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
    </>
  );
}
