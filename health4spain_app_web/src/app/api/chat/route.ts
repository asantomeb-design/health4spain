import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import OpenAI from 'openai';

interface ChatRequestBody {
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  lang: string;
  session_id?: string;
}

let cachedConfig: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30 seconds

async function getConfig() {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL) {
    return cachedConfig;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('chatbot_config')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) throw new Error('Chatbot config not found');

  cachedConfig = data;
  cacheTimestamp = now;
  return data;
}

function extractKeywords(message: string): string[] {
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'a', 'y', 'o', 'que',
    'es', 'por', 'con', 'para', 'como', 'no', 'si', 'me', 'mi', 'tu', 'su', 'se',
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'it',
    'i', 'you', 'we', 'he', 'she', 'they', 'my', 'your', 'our',
    'qué', 'cómo', 'dónde', 'cuánto', 'cuándo', 'quiero', 'necesito', 'puedo',
    'what', 'how', 'where', 'when', 'can', 'do', 'does', 'want', 'need',
    'hola', 'hello', 'hi', 'buenos', 'días', 'tardes', 'noches',
  ]);

  return message
    .toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

const FORBIDDEN_KNOWLEDGE_TABLES = new Set([
  'leads', 'chat_messages', 'chatbot_config', 'partners',
]);

async function fetchContext(config: any, keywords: string[]): Promise<string> {
  if (keywords.length === 0) return '';

  const supabase = createServerSupabaseClient();
  const tables = config.knowledge_tables || [];
  const maxItems = config.max_context_items || 10;
  const contextParts: string[] = [];

  const itemsPerTable = Math.max(2, Math.floor(maxItems / Math.max(tables.length, 1)));

  for (const table of tables) {
    if (FORBIDDEN_KNOWLEDGE_TABLES.has(table)) continue;
    try {
      if (table === 'servicios_catalogo') {
        const { data } = await supabase
          .from('servicios_catalogo')
          .select('*')
          .limit(itemsPerTable);
        if (data?.length) {
          contextParts.push('=== SERVICIOS DISPONIBLES ===');
          data.forEach((s: any) => {
            contextParts.push(`- ${s.nombre || s.id}: ${s.descripcion || ''}`);
          });
        }
      }

      if (table === 'ciudades_contenido') {
        let query = supabase.from('ciudades_contenido').select('ciudad_slug, idioma, hero_title, hero_subtitle, intro_text');
        for (const kw of keywords.slice(0, 3)) {
          query = supabase.from('ciudades_contenido')
            .select('ciudad_slug, idioma, hero_title, hero_subtitle, intro_text')
            .or(`ciudad_slug.ilike.%${kw}%,hero_title.ilike.%${kw}%`)
            .limit(itemsPerTable);
        }
        const { data } = await query;
        if (data?.length) {
          contextParts.push('=== CIUDADES ===');
          data.forEach((c: any) => {
            contextParts.push(`- ${c.ciudad_slug} (${c.idioma}): ${c.hero_title || ''} - ${c.hero_subtitle || ''}`);
            if (c.intro_text) contextParts.push(`  ${typeof c.intro_text === 'string' ? c.intro_text.slice(0, 200) : ''}`);
          });
        }
      }

      if (table === 'blog_posts') {
        const orConditions = keywords.slice(0, 3).map(kw =>
          `title.ilike.%${kw}%,excerpt.ilike.%${kw}%`
        ).join(',');
        const { data } = await supabase
          .from('blog_posts')
          .select('title, excerpt, slug, lang, category')
          .eq('status', 'published')
          .or(orConditions)
          .limit(itemsPerTable);
        if (data?.length) {
          contextParts.push('=== ARTÍCULOS DEL BLOG ===');
          data.forEach((p: any) => {
            contextParts.push(`- [${p.lang}] ${p.title}: ${p.excerpt || ''}`);
          });
        }
      }

      if (table === 'landing_pages') {
        const orConditions = keywords.slice(0, 3).map(kw =>
          `servicio_nombre.ilike.%${kw}%,ciudad_nombre.ilike.%${kw}%,hero_title.ilike.%${kw}%`
        ).join(',');
        const { data } = await supabase
          .from('landing_pages')
          .select('servicio_nombre, ciudad_nombre, hero_title, hero_subtitle, solution_text')
          .eq('activo', true)
          .or(orConditions)
          .limit(itemsPerTable);
        if (data?.length) {
          contextParts.push('=== SERVICIOS POR CIUDAD ===');
          data.forEach((l: any) => {
            contextParts.push(`- ${l.servicio_nombre} en ${l.ciudad_nombre}: ${l.hero_title || ''}`);
            if (l.solution_text) contextParts.push(`  ${l.solution_text.slice(0, 200)}`);
          });
        }
      }
    } catch (e) {
      // Skip failed table queries silently
    }
  }

  return contextParts.join('\n');
}

async function detectLanguageWithAI(openai: OpenAI, message: string, history: { role: string; content: string }[]): Promise<string> {
  const recentHistory = history.slice(-4).map(m =>
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 100)}`
  ).join('\n');

  const detection = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a language detector. Your ONLY job is to identify the language of the user's message.
Respond with ONLY the language name in English (e.g. "English", "French", "Spanish", "German", "Portuguese", "Italian", "Dutch", "Russian", "Arabic", "Chinese", "Japanese", "Korean", etc.).
Do NOT respond with anything else. Just the language name. One word or two words max.

Rules:
- Focus on the LAST user message only.
- If the user explicitly requests a language (e.g. "english?", "in english please", "en français"), return THAT requested language.
- If the message is ambiguous (like "ok", "hi", emojis), look at the conversation history for context. If still ambiguous, return "English".`,
      },
      {
        role: 'user',
        content: recentHistory
          ? `Conversation history:\n${recentHistory}\n\nNew message to detect: "${message}"`
          : `Detect the language of: "${message}"`,
      },
    ],
    temperature: 0,
    max_tokens: 10,
  });

  return (detection.choices[0]?.message?.content || 'English').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, history = [], lang = 'es', session_id } = body;

    if (!message?.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const config = await getConfig();

    if (!config.enabled) {
      return Response.json({ error: 'Chat is currently disabled' }, { status: 503 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // AGENTE 1: Detectar idioma del mensaje
    const detectedLanguage = await detectLanguageWithAI(openai, message, history);

    // Buscar contexto en paralelo (no depende del idioma)
    const keywords = extractKeywords(message);
    const context = await fetchContext(config, keywords);

    const contactPath = `/${lang}/contacto`;

    // AGENTE 2: Responder al usuario en el idioma detectado
    let systemContent = `You MUST respond ENTIRELY in ${detectedLanguage}. This is non-negotiable.
If the reference data is in another language, translate it to ${detectedLanguage}.
NEVER mix languages. Every single word of your response must be in ${detectedLanguage}.

FORMAT: Use Markdown. Use **bold** for key concepts. Use bullet lists with - for enumerations. To invite contact, use a link to ${contactPath} adapted to ${detectedLanguage}.

TAP-ONLY OPTIONS (very important for the web widget):
When it makes sense to offer the user a small set of discrete choices (qualifying questions such as language, country of origin, what they need, urgency/timing, or offering to talk to a human advisor), end your message with EXACTLY ONE final line using this machine-readable marker:
[[OPCIONES]] Label one | Label two | Label three
Rules for the marker:
- It must be the LAST line of the message, and there must be at most ONE such line.
- Provide between 2 and 8 options separated by " | ".
- Each label is a short tappable phrase (max ~5 words), translated to ${detectedLanguage}, with NO numbers, NO emojis and NO markdown.
- Do NOT repeat the same options as a bullet list above the marker; write the question in plain text and let the marker carry the options.
- You may attach an internal CRM tag to an option with "::tag" (lowercase, hyphen-separated). The user never sees the tag. Example: España::pais-espana | Latinoamérica::pais-latam
- Useful tags: services -> servicio-seguros, servicio-abogados, servicio-gestorias, servicio-inmobiliarias; urgency -> alta-urgencia.
- When the user could benefit from speaking to a person, ALWAYS include an option tagged ::bot-handoff-humano, e.g. "Hablar con un asesor::bot-handoff-humano".
- Only use the marker when discrete choices genuinely help. For open informational answers, do NOT add it.

`;
    systemContent += config.system_prompt || '';
    if (context) {
      systemContent += `\n\n--- REFERENCE DATA (translate to ${detectedLanguage}) ---\n${context}\n--- END ---`;
    }

    const maxHistory = config.max_history_messages || 10;
    const trimmedHistory = history.slice(-maxHistory);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...trimmedHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const stream = await openai.chat.completions.create({
      model: config.model || 'gpt-4o-mini',
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.max_tokens ?? 1024,
      top_p: config.top_p ?? 1,
      frequency_penalty: config.frequency_penalty ?? 0,
      presence_penalty: config.presence_penalty ?? 0,
      stream: true,
    });

    const encoder = new TextEncoder();
    const modelUsed = config.model || 'gpt-4o-mini';

    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

          if (fullResponse.trim()) {
            const supabase = createServerSupabaseClient();
            supabase.from('chat_messages').insert({
              session_id: session_id || 'unknown',
              user_message: message,
              assistant_message: fullResponse,
              lang: detectedLanguage,
              model: modelUsed,
            }).then(({ error: logErr }) => {
              if (logErr) console.error('Error logging chat message:', logErr.message);
            });
          }
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
