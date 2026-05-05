import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import {
  ensureUniqueSlug,
  isSupportedCategory,
  isSupportedLang,
  sanitizeAIHtml,
  slugify,
  type SupportedLang,
} from '@/lib/ai/openai-blog';
import type { BlogPost } from '@/lib/types';

interface SaveDraftBody {
  title: string;
  slug?: string;
  excerpt?: string;
  content_html: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  category: string;
  language: SupportedLang;
  tags?: string[];
  sources?: Array<{ title?: string; url?: string }>;
  translation_group_id?: string;
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: SaveDraftBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ success: false, error: 'title es obligatorio' }, { status: 400 });
  }
  if (!body.content_html?.trim()) {
    return NextResponse.json(
      { success: false, error: 'content_html es obligatorio' },
      { status: 400 }
    );
  }
  if (!isSupportedLang(body.language)) {
    return NextResponse.json(
      { success: false, error: 'language inválido' },
      { status: 400 }
    );
  }
  if (!isSupportedCategory(body.category)) {
    return NextResponse.json(
      { success: false, error: 'category inválida' },
      { status: 400 }
    );
  }

  const baseSlug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
  const finalSlug = await ensureUniqueSlug(baseSlug, body.language);

  const sanitizedHtml = sanitizeAIHtml(body.content_html);

  const sourcesAppendix = Array.isArray(body.sources) && body.sources.length > 0
    ? `\n<hr/>\n<p><em><strong>Fuentes consultadas por la IA</strong></em></p>\n<ul>${body.sources
        .filter((s) => s?.url)
        .map(
          (s) =>
            `<li><a href="${(s.url as string).replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">${(s.title || s.url) as string}</a></li>`
        )
        .join('')}</ul>`
    : '';

  const finalHtml = sanitizedHtml + sourcesAppendix;

  const nowIso = new Date().toISOString();

  const insertData: Partial<BlogPost> & { translation_group_id?: string } = {
    slug: finalSlug,
    title: body.title.trim(),
    excerpt: (body.excerpt || '').trim().slice(0, 280),
    content: finalHtml,
    featured_image: body.featured_image?.trim() || undefined,
    category: body.category as BlogPost['category'],
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 8)
      : [],
    meta_title: (body.meta_title || body.title).trim().slice(0, 70),
    meta_description: (body.meta_description || body.excerpt || '').trim().slice(0, 200),
    lang: body.language,
    status: 'draft',
    author_name: 'IA (Health4Spain)',
    published_at: undefined,
    created_at: nowIso,
    updated_at: nowIso,
  };

  if (body.translation_group_id) {
    insertData.translation_group_id = body.translation_group_id;
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json(handleSupabaseError(error), { status: 500 });
  }

  const adminUrl = `/administrator/blog/${data.slug}`;
  const previewUrl = `/${data.lang}/blog/${data.slug}`;

  return NextResponse.json(
    {
      success: true,
      data: {
        id: data.id,
        slug: data.slug,
        lang: data.lang,
        status: data.status,
        admin_url: adminUrl,
        preview_url: previewUrl,
      },
      message: 'Borrador guardado correctamente. Pendiente de revisión humana.',
    },
    { status: 201 }
  );
}
