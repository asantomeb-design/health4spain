interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Skeleton para Cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      <div className="p-6 space-y-3">
        <Skeleton variant="text" height={24} width="30%" />
        <Skeleton variant="text" height={28} width="80%" />
        <Skeleton variant="text" height={16} width="100%" />
        <Skeleton variant="text" height={16} width="60%" />
      </div>
    </div>
  );
}

// Skeleton para Blog Posts
export function BlogPostSkeleton() {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton variant="rounded" height={24} width={80} />
          <Skeleton variant="rounded" height={24} width={100} />
        </div>
        <Skeleton variant="text" height={32} width="90%" />
        <Skeleton variant="text" height={20} width="100%" />
        <Skeleton variant="text" height={20} width="75%" />
        <div className="flex items-center gap-3 pt-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton variant="text" height={16} width={100} />
            <Skeleton variant="text" height={14} width={80} />
          </div>
        </div>
      </div>
    </article>
  );
}

// Skeleton para Servicios Grid
export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-50 p-8 rounded-2xl">
          <Skeleton variant="circular" width={64} height={64} className="mb-4" />
          <Skeleton variant="text" height={28} width="70%" className="mb-2" />
          <Skeleton variant="text" height={16} width="100%" className="mb-1" />
          <Skeleton variant="text" height={16} width="80%" className="mb-4" />
          <Skeleton variant="rounded" height={40} width={140} />
        </div>
      ))}
    </div>
  );
}

// Skeleton para Hero
export function HeroSkeleton() {
  return (
    <section className="py-16 lg:py-24 px-[5%]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Skeleton variant="rounded" height={32} width={150} />
          <Skeleton variant="text" height={64} width="90%" />
          <Skeleton variant="text" height={64} width="70%" />
          <Skeleton variant="text" height={24} width="100%" />
          <Skeleton variant="text" height={24} width="80%" />
          <div className="flex gap-4 pt-4">
            <Skeleton variant="rounded" height={56} width={200} />
            <Skeleton variant="rounded" height={56} width={150} />
          </div>
        </div>
        <Skeleton variant="rounded" className="aspect-[4/3] w-full" />
      </div>
    </section>
  );
}

// Skeleton para Form
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="text-center mb-6 space-y-2">
        <Skeleton variant="text" height={28} width="60%" className="mx-auto" />
        <Skeleton variant="text" height={20} width="80%" className="mx-auto" />
      </div>
      <div className="space-y-4">
        <Skeleton variant="rounded" height={48} width="100%" />
        <Skeleton variant="rounded" height={48} width="100%" />
        <Skeleton variant="rounded" height={48} width="100%" />
        <Skeleton variant="rounded" height={56} width="100%" />
      </div>
    </div>
  );
}

// Skeleton para Lista de Leads (Admin)
export function LeadListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={20} width="30%" />
            <Skeleton variant="text" height={16} width="50%" />
          </div>
          <Skeleton variant="rounded" height={32} width={80} />
          <Skeleton variant="rounded" height={32} width={100} />
        </div>
      ))}
    </div>
  );
}
