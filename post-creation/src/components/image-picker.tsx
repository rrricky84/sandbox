"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/lib/post-store";

export function ImagePicker() {
  const imageUrl = usePostStore((s) => s.imageUrl);
  const setField = usePostStore((s) => s.setField);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => inputRef.current?.click();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setField("imageUrl", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-md bg-[var(--secondary)] aspect-[2.4/1] overflow-hidden relative flex items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Post hero"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            className="absolute top-3 right-3"
            onClick={open}
          >
            Replace image
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Button type="button" onClick={open}>
            Choose an image
          </Button>
          <p className="text-sm text-[var(--muted-foreground)]">
            PNG, JPG or GIF (up to 10MB). Suggested image size: 3240 x 1830
          </p>
        </div>
      )}
    </div>
  );
}
