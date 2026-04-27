"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FooterBar } from "@/components/footer-bar";
import { usePostStore } from "@/lib/post-store";
import { X } from "lucide-react";

const SUGGESTED_TAGS = [
  "soul",
  "amsterdam",
  "digging",
  "balaeric",
  "house",
  "disco",
  "live stream",
  "techno",
  "ambient",
];

export default function FinishPage() {
  const { imageUrl, tags, teaser, setField } = usePostStore();
  const [tagInput, setTagInput] = useState("");

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setField("tags", [...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setField(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const filtered = SUGGESTED_TAGS.filter(
    (t) =>
      t.includes(tagInput.toLowerCase()) && !tags.includes(t)
  ).slice(0, 6);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <h1 className="text-3xl font-semibold mb-8">Finish your post</h1>

          <section className="space-y-3 mb-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Post image</h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Give your post a high quality image to help attract people
                </p>
              </div>
              <Button variant="outline">Replace image</Button>
            </div>
            <div className="bg-neutral-900 rounded-md aspect-[2.4/1] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                alt="Post hero"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </section>

          <section className="space-y-3 mb-10">
            <div>
              <h2 className="text-lg font-semibold">Tag your post</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Help get your post seen by people that don&rsquo;t follow you yet
              </p>
            </div>
            <div className="relative">
              <Input
                placeholder="Search for genres / tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
              />
              {tagInput && filtered.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[var(--border)] rounded-md shadow-md py-1">
                  {filtered.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => addTag(t)}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--accent)]"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => removeTag(t)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 text-sm capitalize"
                  >
                    {t}
                    <X className="size-3.5" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2 mb-10">
            <Label htmlFor="teaser" className="text-lg font-semibold">
              Teaser
            </Label>
            <p className="text-sm text-[var(--muted-foreground)]">
              If you don&rsquo;t enter a teaser we will use the first 250 characters of
              your post
            </p>
            <Textarea
              id="teaser"
              rows={4}
              value={teaser}
              onChange={(e) => setField("teaser", e.target.value)}
              placeholder="Write a short summary..."
            />
          </section>
        </div>
      </div>
      <FooterBar primaryLabel="Publish post" primaryHref="/post" />
    </div>
  );
}
