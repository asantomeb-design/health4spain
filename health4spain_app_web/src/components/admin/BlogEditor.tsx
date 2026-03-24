'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function BlogEditor({ 
  value, 
  onChange, 
  placeholder,
  minHeight = 500 
}: BlogEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="blog-editor-wrapper">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: minHeight,
          min_height: 400,
          max_height: 800,
          resize: true,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'codesample', 'quickbars', 'autoresize'
          ],
          toolbar: 
            'undo redo | styles | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | ' +
            'link image media | table | blockquote codesample | ' +
            'removeformat | fullscreen | help',
          
          // Toolbar en móvil
          mobile: {
            toolbar_mode: 'sliding',
            toolbar: 'undo redo | bold italic | link | bullist numlist',
          },
          
          // Estilos predefinidos
          style_formats: [
            { title: 'Encabezados', items: [
              { title: 'Título 1', format: 'h1' },
              { title: 'Título 2', format: 'h2' },
              { title: 'Título 3', format: 'h3' },
              { title: 'Título 4', format: 'h4' },
            ]},
            { title: 'Bloques', items: [
              { title: 'Párrafo', format: 'p' },
              { title: 'Cita', format: 'blockquote' },
              { title: 'Código', format: 'pre' },
            ]},
            { title: 'Cajas especiales', items: [
              { title: '📌 Caja Info', block: 'div', classes: 'info-box', wrapper: true },
              { title: '⚠️ Caja Alerta', block: 'div', classes: 'warning-box', wrapper: true },
              { title: '✅ Caja Éxito', block: 'div', classes: 'success-box', wrapper: true },
              { title: '💡 Caja Tip', block: 'div', classes: 'tip-box', wrapper: true },
              { title: '🎯 Caja CTA', block: 'div', classes: 'cta-box', wrapper: true },
            ]},
          ],
          
          // Formatos válidos (incluyendo corchetes, negritas, etc)
          valid_elements: '*[*]',
          extended_valid_elements: 'span[*],div[*],a[*],img[*],strong,em,b,i,u,s,sub,sup,br,hr,table[*],tr[*],td[*],th[*],thead,tbody,tfoot,ul,ol,li,blockquote,pre,code,h1,h2,h3,h4,h5,h6,p,figure,figcaption,iframe[*]',
          
          // Permitir todo tipo de contenido
          verify_html: false,
          
          // Estilos del contenido
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              font-size: 16px;
              line-height: 1.7;
              color: #374151;
              max-width: 100%;
              padding: 16px;
              margin: 0;
            }
            
            h1 { font-size: 2em; font-weight: 700; margin: 1.5em 0 0.5em; color: #111827; }
            h2 { font-size: 1.5em; font-weight: 700; margin: 1.3em 0 0.5em; color: #111827; }
            h3 { font-size: 1.25em; font-weight: 600; margin: 1.2em 0 0.4em; color: #111827; }
            h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0 0.3em; color: #111827; }
            
            p { margin: 0 0 1em; }
            
            strong, b { font-weight: 600; color: #111827; }
            em, i { font-style: italic; }
            u { text-decoration: underline; }
            s { text-decoration: line-through; }
            
            a { color: #2563eb; text-decoration: underline; }
            a:hover { color: #1d4ed8; }
            
            ul, ol { margin: 1em 0; padding-left: 1.5em; }
            li { margin: 0.3em 0; }
            
            blockquote {
              border-left: 4px solid #3b82f6;
              padding: 0.5em 1em;
              margin: 1.5em 0;
              background: #eff6ff;
              color: #1e40af;
              font-style: italic;
            }
            
            pre {
              background: #1e293b;
              color: #e2e8f0;
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
              font-family: 'Fira Code', monospace;
              font-size: 0.9em;
            }
            
            code {
              background: #f1f5f9;
              padding: 0.2em 0.4em;
              border-radius: 4px;
              font-family: 'Fira Code', monospace;
              font-size: 0.9em;
              color: #3bbdda;
            }
            
            img { 
              max-width: 100%; 
              height: auto; 
              border-radius: 8px;
              margin: 1em 0;
            }
            
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 1em 0;
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 10px 14px; 
              text-align: left; 
            }
            th { 
              background: #f9fafb; 
              font-weight: 600; 
            }
            
            hr {
              border: none;
              border-top: 2px solid #e5e7eb;
              margin: 2em 0;
            }
            
            /* Cajas especiales */
            .info-box {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-left: 4px solid #3b82f6;
              padding: 16px;
              margin: 16px 0;
              border-radius: 0 8px 8px 0;
            }
            
            .warning-box {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              border-left: 4px solid #f59e0b;
              padding: 16px;
              margin: 16px 0;
              border-radius: 0 8px 8px 0;
            }
            
            .success-box {
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-left: 4px solid #10b981;
              padding: 16px;
              margin: 16px 0;
              border-radius: 0 8px 8px 0;
            }
            
            .tip-box {
              background: #faf5ff;
              border: 1px solid #e9d5ff;
              border-left: 4px solid #a855f7;
              padding: 16px;
              margin: 16px 0;
              border-radius: 0 8px 8px 0;
            }
            
            .cta-box {
              background: linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%);
              border: 2px solid #3b82f6;
              padding: 24px;
              margin: 24px 0;
              border-radius: 12px;
              text-align: center;
            }
          `,
          
          placeholder: placeholder || 'Escribe el contenido del artículo...',
          
          // Configuración de imágenes
          images_upload_url: '/api/upload',
          automatic_uploads: true,
          images_reuse_filename: true,
          file_picker_types: 'image',
          
          // Configuración de enlaces
          link_default_target: '_blank',
          link_assume_external_targets: true,
          link_context_toolbar: true,
          
          // Quick toolbar para selección de texto
          quickbars_selection_toolbar: 'bold italic | link | h2 h3 | blockquote',
          quickbars_insert_toolbar: 'image media table hr',
          
          // Pegar contenido limpio
          paste_as_text: false,
          paste_word_valid_elements: 'p,b,strong,i,em,h1,h2,h3,h4,h5,h6,ul,ol,li,a[href],span,table,tr,td,th,thead,tbody,br',
          
          // Autosave
          autosave_interval: '30s',
          autosave_prefix: 'health4spain-blog-{path}{query}-{id}-',
          autosave_restore_when_empty: true,
          
          // Accesibilidad
          a11y_advanced_options: true,
          
          // Templates predefinidos
          templates: [
            {
              title: 'Caja de CTA',
              description: 'Llamada a la acción destacada',
              content: `
                <div class="cta-box">
                  <h3>¿Necesitas ayuda con esto?</h3>
                  <p>Te conectamos con profesionales verificados en menos de 24 horas.</p>
                  <p><a href="/es/solicitar" style="display:inline-block;background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Solicitar contacto →</a></p>
                </div>
              `
            },
            {
              title: 'Caja de Información',
              description: 'Información importante destacada',
              content: `<div class="info-box"><strong>ℹ️ Información importante:</strong><p>Tu contenido aquí...</p></div>`
            },
            {
              title: 'Caja de Advertencia',
              description: 'Advertencia o nota importante',
              content: `<div class="warning-box"><strong>⚠️ Importante:</strong><p>Tu contenido aquí...</p></div>`
            },
            {
              title: 'Caja de Tip',
              description: 'Consejo útil',
              content: `<div class="tip-box"><strong>💡 Consejo:</strong><p>Tu contenido aquí...</p></div>`
            },
            {
              title: 'Tabla comparativa',
              description: 'Tabla de comparación',
              content: `
                <table>
                  <thead>
                    <tr><th>Característica</th><th>Opción A</th><th>Opción B</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Precio</td><td>€50/mes</td><td>€80/mes</td></tr>
                    <tr><td>Cobertura</td><td>Básica</td><td>Completa</td></tr>
                  </tbody>
                </table>
              `
            },
          ],
          
          // Configuración de tabla
          table_default_styles: {
            width: '100%',
          },
          table_responsive_width: true,
          
          // Permitir caracteres especiales incluyendo corchetes
          entities: '',
          entity_encoding: 'raw',
        }}
      />
    </div>
  );
}
