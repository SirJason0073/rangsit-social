import Link from 'next/link';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';

export default function NotFoundPage() {
  return (
    <main className="container py-12">
      <EmptyState icon={<Icon name="alert" />} title="Page not found" description="The page may have moved or the link may be incorrect." action={<Link href="/feed"><Button>Return to feed</Button></Link>} />
    </main>
  );
}
