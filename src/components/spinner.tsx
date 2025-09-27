'use client';
import { Spinner, type SpinnerProps } from '@/components/ui/shadcn-io/spinner';
const variants: SpinnerProps['variant'][] = [
  'default',
  'circle',
  'pinwheel',
  'circle-filled',
  'ellipsis',
  'ring',
  'bars',
  'infinite',
];
const SpinItem = () => (
<Spinner className="text-black-500" variant = {'ellipsis'}size={64} />
);
export default SpinItem;