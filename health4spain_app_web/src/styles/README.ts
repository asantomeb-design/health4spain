/**
 * HEALTH4SPAIN - Documentación de estilos de contenido para Blog
 * 
 * Los estilos prose están definidos en globals.css.
 * Este archivo documenta cómo usar las clases especiales.
 */

/* ===========================================
   USO DE PROSE
   =========================================== */

/**
 * Para renderizar contenido de blog de TinyMCE:
 * 
 * <article 
 *   className="prose prose-lg max-w-none"
 *   dangerouslySetInnerHTML={{ __html: post.content }}
 * />
 * 
 * Las clases "prose" aplican estilos automáticos a:
 * - Headings (h1-h6)
 * - Párrafos
 * - Links
 * - Listas (ul, ol)
 * - Blockquotes
 * - Code y pre
 * - Imágenes
 * - Tablas
 */

/* ===========================================
   CAJAS ESPECIALES
   =========================================== */

/**
 * Las cajas especiales se crean en TinyMCE usando templates.
 * Clases disponibles:
 * 
 * .info-box     - Azul, para información importante
 * .warning-box  - Amarillo, para advertencias
 * .success-box  - Verde, para éxitos/consejos
 * .tip-box      - Púrpura, para tips
 * .cta-box      - Gradiente, para llamadas a acción
 * 
 * Ejemplo de uso en HTML del editor:
 * <div class="info-box">
 *   <strong>ℹ️ Importante:</strong>
 *   <p>Tu contenido aquí...</p>
 * </div>
 */

/* ===========================================
   RESPONSIVE
   =========================================== */

/**
 * Los estilos prose son responsive automáticamente:
 * 
 * Móvil (< 640px):
 * - Texto base más pequeño
 * - Headings reducidos
 * - Padding de blockquotes reducido
 * 
 * Tablet (640px - 1023px):
 * - Texto intermedio
 * - Headings intermedios
 * 
 * Desktop (1024px+):
 * - Tamaños completos
 */

/* ===========================================
   EJEMPLO DE COMPONENTE
   =========================================== */

/**
 * // src/components/BlogContent.tsx
 * 
 * interface BlogContentProps {
 *   content: string;
 * }
 * 
 * export default function BlogContent({ content }: BlogContentProps) {
 *   return (
 *     <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8">
 *       <article 
 *         className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
 *         dangerouslySetInnerHTML={{ __html: content }}
 *       />
 *     </div>
 *   );
 * }
 */

export {};
