import { Card } from './ui/Card';

export default function EmptyState({ title, description, action }) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <span className="text-xl">•</span>
      </div>
      <p className="mt-4 text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
