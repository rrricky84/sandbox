"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/date-time-picker";
import { FooterBar } from "@/components/footer-bar";
import { ImagePicker } from "@/components/image-picker";
import { usePostStore, type PostType } from "@/lib/post-store";
import { Editor } from "@/components/editor/editor";
import { Info, Plus, X } from "lucide-react";

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "general", label: "General update" },
  { value: "promote-upload", label: "Promote an upload" },
  { value: "live-stream", label: "Upcoming live stream" },
  { value: "other", label: "Other" },
];

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

export default function CreatePostPage() {
  const {
    title,
    postType,
    liveStreamAt,
    tags,
    teaser,
    setField,
    reset,
  } = usePostStore();

  const [teaserOpen, setTeaserOpen] = useState(Boolean(teaser));
  const [tagInput, setTagInput] = useState("");

  const startOver = () => {
    if (!confirm("Clear the form and start over? This can't be undone.")) return;
    reset();
    window.location.reload();
  };

  const canPublish =
    title.trim().length > 0 &&
    (postType !== "live-stream" || Boolean(liveStreamAt));

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

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    (t) => t.includes(tagInput.toLowerCase()) && !tags.includes(t)
  ).slice(0, 6);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="flex items-start justify-between mb-8">
            <h1 className="text-3xl font-semibold">Create post</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={startOver}>
                Start over
              </Button>
              <Button variant="outline">Read our guides</Button>
            </div>
          </div>

          <div className="space-y-6">
            <ImagePicker />

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Add a title for your post"
                value={title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Post type:</Label>
              <Select
                value={postType}
                onValueChange={(v) => setField("postType", v as PostType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {postType === "live-stream" && (
              <DateTimePicker
                value={liveStreamAt}
                onChange={(iso) => setField("liveStreamAt", iso)}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="relative">
                <Input
                  id="tags"
                  placeholder="Search for tags / genres"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                />
                {tagInput && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-[var(--border)] rounded-md shadow-md py-1">
                    {filteredSuggestions.map((t) => (
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
              <p className="text-sm text-[var(--muted-foreground)]">
                Help get your post seen by people that don&rsquo;t follow you yet
              </p>
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
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setTeaserOpen((o) => !o)}
                className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
              >
                <Plus className="size-4" />
                Add teaser text
                <Info className="size-4 text-[var(--muted-foreground)]" />
              </button>
              {teaserOpen && (
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    If you don&rsquo;t enter a teaser we will use the first 250
                    characters of your post
                  </p>
                  <Textarea
                    rows={4}
                    value={teaser}
                    onChange={(e) => setField("teaser", e.target.value)}
                    placeholder="Write a short summary..."
                  />
                </div>
              )}
            </div>

            <Editor />
          </div>
        </div>
      </div>
      <FooterBar
        primaryLabel="Publish post"
        primaryHref="/post"
        primaryDisabled={!canPublish}
        showPreview
        previewHref="/post"
        previewDisabled={!canPublish}
      />
    </div>
  );
}
