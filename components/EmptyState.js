import BaseEmptyState from './ui/EmptyState';
import Icon from './ui/Icon';

export default function EmptyState({ title, description, action }) {
  return <BaseEmptyState icon={<Icon name="bookmark" />} title={title} description={description} action={action} />;
}
