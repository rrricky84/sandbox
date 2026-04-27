"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/lib/post-store";

interface FooterBarProps {
  primaryLabel: string;
  primaryHref?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  showPreview?: boolean;
  previewHref?: string;
  previewDisabled?: boolean;
}

export function FooterBar({
  primaryLabel,
  primaryHref,
  onPrimary,
  primaryDisabled,
  secondaryLabel = "Save draft",
  showPreview = false,
  previewHref = "/post",
  previewDisabled = false,
}: FooterBarProps) {
  const router = useRouter();
  const exclusive = usePostStore((s) => s.exclusive);
  const setField = usePostStore((s) => s.setField);

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    if (primaryHref) router.push(primaryHref);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-[900px] items-center gap-4 px-6 py-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            id="exclusive"
            checked={exclusive}
            onCheckedChange={(checked) =>
              setField("exclusive", Boolean(checked))
            }
          />
          <Label htmlFor="exclusive" className="cursor-pointer">
            Exclusive to my Subscribers only
          </Label>
        </label>
        <div className="ml-auto flex items-center gap-3">
          <Button variant="ghost">{secondaryLabel}</Button>
          {showPreview && (
            <Button asChild variant="outline" disabled={previewDisabled}>
              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={previewDisabled}
                onClick={(e) => {
                  if (previewDisabled) e.preventDefault();
                }}
                className={previewDisabled ? "pointer-events-none opacity-50" : ""}
              >
                Preview
              </Link>
            </Button>
          )}
          <Button
            variant="brand"
            onClick={handlePrimary}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
