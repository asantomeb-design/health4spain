import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition?: string;
}

// Placeholder blur genérico para imágenes sin blur específico
const DEFAULT_BLUR_DATA_URL = 
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzXR9Ss7q3SS3uI3DKGUqwOQfRqbKsMt5PIiKsbyMVRRgKCeAPQ+CgpOgxMqnscKJQZ//2Q==';

// Helper para generar URL de Supabase Storage
export const getSupabaseImageUrl = (
  bucket: string, 
  path: string, 
  options?: { width?: number; height?: number; quality?: number }
) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return path;
  
  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  
  // Añadir transformaciones si están disponibles (Supabase Pro)
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (options.quality) params.set('quality', options.quality.toString());
    
    if (params.toString()) {
      url = `${supabaseUrl}/storage/v1/render/image/public/${bucket}/${path}?${params.toString()}`;
    }
  }
  
  return url;
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  objectFit = 'cover',
  objectPosition = 'center',
}: OptimizedImageProps) {
  // Determinar sizes automático si no se proporciona
  const defaultSizes = fill 
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes || defaultSizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={{
        objectFit,
        objectPosition,
      }}
    />
  );
}

// Componente específico para Hero images (LCP critical)
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroImage({ 
  src, 
  alt, 
  className = '',
  overlay = true,
  overlayOpacity = 0.3,
}: HeroImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority // Siempre priority para LCP
        quality={90}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_DATA_URL}
        className="object-cover"
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Componente para imágenes de tarjetas/grid
interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4';
  className?: string;
}

export function CardImage({ 
  src, 
  alt, 
  aspectRatio = '16/9',
  className = '',
}: CardImageProps) {
  const aspectClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/4': 'aspect-[3/4]',
  };

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={80}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_DATA_URL}
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

// Componente para avatares/thumbnails pequeños
interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 'md',
  className = '',
}: AvatarImageProps) {
  const sizeConfig = {
    sm: { dimension: 32, className: 'w-8 h-8' },
    md: { dimension: 48, className: 'w-12 h-12' },
    lg: { dimension: 64, className: 'w-16 h-16' },
    xl: { dimension: 96, className: 'w-24 h-24' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative rounded-full overflow-hidden ${config.className} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={config.dimension}
        height={config.dimension}
        quality={80}
        className="object-cover"
      />
    </div>
  );
}
