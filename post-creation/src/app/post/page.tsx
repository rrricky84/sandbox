"use client";
import Link from "next/link";
import { usePostStore } from "@/lib/post-store";
import { AddToCalendar } from "@/components/add-to-calendar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share, UserPlus } from "lucide-react";

function formatStreamTime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${time} – ${date}`;
}

export default function PostPage() {
  const {
    title,
    bodyHtml,
    tags,
    postType,
    liveStreamAt,
  } = usePostStore();

  const empty = !title && !bodyHtml;

  return (
    <div className="mx-auto max-w-[800px] px-6 py-10">
      {empty ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-10 text-center">
          <p className="text-[var(--muted-foreground)] mb-4">
            No post yet. Create one to see it rendered here.
          </p>
          <Button asChild variant="brand">
            <Link href="/">Write a post</Link>
          </Button>
        </div>
      ) : (
        <article className="space-y-6">
          <header className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-amber-300 to-rose-400" />
              <div>
                <p className="font-semibold flex items-center gap-1">
                  Colleen &lsquo;Cosmo&rsquo; Murphy
                  <span className="text-[var(--brand)]">✓</span>
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  14,108 Followers
                </p>
              </div>
            </div>
            <Button variant="default" size="sm">
              <UserPlus className="size-4" /> Follow
            </Button>
          </header>

          <h1 className="text-3xl font-bold leading-tight">{title}</h1>

          <div className="flex items-center gap-3 text-sm">
            {tags.length > 0 && (
              <div className="flex gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-[var(--secondary)] px-2.5 py-0.5 capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <span className="text-[var(--muted-foreground)]">1 day ago</span>
            <span className="text-[var(--muted-foreground)]">5 comments</span>
            <div className="ml-auto flex items-center gap-3 text-[var(--muted-foreground)]">
              <MessageCircle className="size-4" />
              <Share className="size-4" />
            </div>
          </div>

          {postType === "live-stream" && liveStreamAt && (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-4">
              <div>
                <p className="font-semibold">
                  Colleen &lsquo;Cosmo&rsquo; Murphy is going live
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {formatStreamTime(liveStreamAt)}
                </p>
              </div>
              <AddToCalendar
                event={{
                  title,
                  description: "Live stream on Mixcloud",
                  start: new Date(liveStreamAt),
                  durationMinutes: 60,
                  url:
                    typeof window !== "undefined"
                      ? window.location.href
                      : undefined,
                }}
              />
            </div>
          )}

          <div
            className="prose prose-sm max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          <div className="flex justify-between border-t border-[var(--border)] pt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">← Edit post</Link>
            </Button>
          </div>
        </article>
      )}
    </div>
  );
}
