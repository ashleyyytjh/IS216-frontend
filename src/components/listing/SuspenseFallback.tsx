import { Skeleton } from "../ui/skeleton";

export default function SuspenseFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
      <Skeleton className="h-6 w-1/3 rounded-md" />
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
