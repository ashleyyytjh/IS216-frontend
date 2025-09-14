import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
      <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">404</h1>
      <p className="mt-4 text-lg sm:text-xl font-semibold">Oops, Page Not Found!</p>
      <p className="mt-1 text-sm sm:text text-muted-foreground">
        The link might be corrupted, or the page may have been removed.
      </p>
      <Button asChild className="mt-6 px-6 py-2 font-semibold uppercase">
        <Link to="/home">Go Back Home</Link>
      </Button>
    </div>
  );
}
