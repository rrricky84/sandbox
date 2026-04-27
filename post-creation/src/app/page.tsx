"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/date-time-picker";
import { FooterBar } from "@/components/footer-bar";
import { usePostStore, type PostType } from "@/lib/post-store";
import { Editor } from "@/components/editor/editor";

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "general", label: "General update" },
  { value: "promote-upload", label: "Promote an upload" },
  { value: "live-stream", label: "Upcoming live stream" },
  { value: "other", label: "Other" },
];

export default function WritePage() {
  const {
    title,
    postType,
    liveStreamAt,
    setField,
  } = usePostStore();

  const canContinue =
    title.trim().length > 0 &&
    (postType !== "live-stream" || Boolean(liveStreamAt));

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <h1 className="text-3xl font-semibold mb-8">Write your post</h1>

          <div className="space-y-6">
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
              <Label>Post type</Label>
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

            <Editor />
          </div>
        </div>
      </div>
      <FooterBar
        primaryLabel="Continue"
        primaryHref="/finish"
        primaryDisabled={!canContinue}
      />
    </div>
  );
}
