import { Card } from './Card';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <Card className="p-8 text-center">
      {icon ? <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-card bg-brand-subtle text-brand-strong">{icon}</div> : null}
      <h2 className="mt-4 type-h3">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground-secondary">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
