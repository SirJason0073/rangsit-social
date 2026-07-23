import { cn } from '@/utils/cn';

export default function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-end md:justify-between', className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
        ) : null}
        {title ? <h2 className="section-title text-2xl">{title}</h2> : null}
        {description ? <p className="max-w-2xl text-sm leading-7 text-slate-500">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
