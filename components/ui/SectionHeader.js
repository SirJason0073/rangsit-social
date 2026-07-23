import { cn } from '@/utils/cn';

export default function SectionHeader({ eyebrow, title, description, action, className = '', tone = 'default' }) {
  const inverse = tone === 'inverse';
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-end md:justify-between', className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${inverse ? 'text-foreground-inverse/75' : 'text-foreground-muted'}`}>{eyebrow}</p>
        ) : null}
        {title ? <h2 className={`type-h2 ${inverse ? 'text-foreground-inverse' : 'text-foreground'}`}>{title}</h2> : null}
        {description ? <p className={`max-w-2xl text-sm leading-7 ${inverse ? 'text-foreground-inverse/80' : 'text-foreground-secondary'}`}>{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
