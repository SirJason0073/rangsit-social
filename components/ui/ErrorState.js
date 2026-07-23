import Button from './Button';
import { Card } from './Card';
import Icon from './Icon';

export default function ErrorState({ title = 'Something went wrong', description = 'The requested content could not be loaded.', onRetry, compact = false }) {
  return (
    <Card className={compact ? 'p-6 text-center shadow-none' : 'p-8 text-center'} role="alert">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-card bg-danger-subtle text-danger"><Icon name="alert" /></div>
      <h2 className="mt-4 type-h3">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground-secondary">{description}</p>
      {onRetry ? <Button className="mt-5" variant="outline" onClick={onRetry}>Try again</Button> : null}
    </Card>
  );
}
