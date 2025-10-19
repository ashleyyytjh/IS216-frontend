export default function PageHeader() {
  return (
    <header className="mx-auto max-w-7xl px-5 xl:px-0 pt-8 fade-in">
      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ring)_1px,transparent_1px)] [background-size:18px_18px] opacity-[0.08]" />
        <div className="relative p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Degree Flow</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Modules organized by year. Click a module to find relevant notes.
          </p>
        </div>
      </div>
    </header>
  );
}