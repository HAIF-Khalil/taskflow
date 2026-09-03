import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>TaskFlow — a marketplace for people, with WebMCP tools for agents.</p>
        <div className="flex gap-4">
          <Link href="/#services" className="hover:text-zinc-900">
            Services
          </Link>
          <Link href="/taskers" className="hover:text-zinc-900">
            Taskers
          </Link>
          <Link href="/tasks" className="hover:text-zinc-900">
            My Tasks
          </Link>
        </div>
      </div>
    </footer>
  );
}
