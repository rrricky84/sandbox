import Link from "next/link";
import { Bell, Plus, Search, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          M<span className="text-[var(--brand)]">—</span>XCLOUD
        </Link>
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]" />
            <input
              className="w-full rounded-full bg-[var(--secondary)] pl-9 pr-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none"
              placeholder="Music, creators, genres..."
            />
          </div>
        </div>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
          <span className="text-[var(--muted-foreground)]">Creator tools</span>
          <span className="text-[var(--muted-foreground)]">Listen</span>
          <span className="text-[var(--muted-foreground)]">Upgrade</span>
        </nav>
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
        >
          <Plus className="size-4" /> Create
        </Link>
        <Bell className="size-5 text-[var(--muted-foreground)]" />
        <Menu className="size-5 text-[var(--muted-foreground)]" />
      </div>
    </header>
  );
}
