"use client";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  PASTE_COMMAND,
  COMMAND_PRIORITY_LOW,
  $insertNodes,
} from "lexical";
import { $createEmbedNode, type EmbedProvider } from "@/components/editor/embed-node";

interface MatchResult {
  provider: EmbedProvider;
  src: string;
}

function matchUrl(url: string): MatchResult | null {
  // YouTube: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/shorts/<id>
  const yt =
    url.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/) ||
    url.match(/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]+)/) ||
    url.match(/^https?:\/\/youtu\.be\/([\w-]+)/);
  if (yt) {
    return {
      provider: "youtube",
      src: `https://www.youtube.com/embed/${yt[1]}`,
    };
  }

  // SoundCloud: soundcloud.com/<user>/<track> -> use their player
  if (/^https?:\/\/(www\.)?soundcloud\.com\/[\w-]+\/[\w-]+/.test(url)) {
    return {
      provider: "soundcloud",
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        url
      )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
    };
  }

  // Mixcloud: mixcloud.com/<user>/<show>/
  const mx = url.match(/^https?:\/\/(?:www\.)?mixcloud\.com\/([\w-]+\/[\w-]+\/?)/);
  if (mx) {
    const feed = `/${mx[1].replace(/\/?$/, "/")}`;
    return {
      provider: "mixcloud",
      src: `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(
        feed
      )}`,
    };
  }

  // Spotify: open.spotify.com/<type>/<id>
  // Types: track, album, playlist, episode, show, artist
  const sp = url.match(
    /^https?:\/\/open\.spotify\.com\/(track|album|playlist|episode|show|artist)\/([\w]+)/
  );
  if (sp) {
    return {
      provider: "spotify",
      src: `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`,
    };
  }

  return null;
}

export function AutoEmbedPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (!text) return false;
        if (!/^https?:\/\//i.test(text)) return false;

        const match = matchUrl(text);
        if (!match) return false;

        event.preventDefault();
        editor.update(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;
          const embed = $createEmbedNode(match.provider, match.src, text);
          const para = $createParagraphNode();
          $insertNodes([embed, para]);
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
