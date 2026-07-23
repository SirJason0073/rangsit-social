import LoadingState from './ui/LoadingState';

export default function Loading({ label = 'Loading...' }) {
  return <LoadingState label={label} />;
}
