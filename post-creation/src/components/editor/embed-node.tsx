import {
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import { type JSX } from "react";

export type EmbedProvider = "youtube" | "soundcloud" | "mixcloud";

export type SerializedEmbedNode = Spread<
  {
    provider: EmbedProvider;
    src: string;
    originalUrl: string;
  },
  SerializedLexicalNode
>;

export class EmbedNode extends DecoratorNode<JSX.Element> {
  __provider: EmbedProvider;
  __src: string;
  __originalUrl: string;

  static getType(): string {
    return "embed";
  }

  static clone(node: EmbedNode): EmbedNode {
    return new EmbedNode(
      node.__provider,
      node.__src,
      node.__originalUrl,
      node.__key
    );
  }

  constructor(
    provider: EmbedProvider,
    src: string,
    originalUrl: string,
    key?: NodeKey
  ) {
    super(key);
    this.__provider = provider;
    this.__src = src;
    this.__originalUrl = originalUrl;
  }

  static importJSON(serialized: SerializedEmbedNode): EmbedNode {
    return new EmbedNode(
      serialized.provider,
      serialized.src,
      serialized.originalUrl
    );
  }

  exportJSON(): SerializedEmbedNode {
    return {
      type: "embed",
      version: 1,
      provider: this.__provider,
      src: this.__src,
      originalUrl: this.__originalUrl,
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "my-3";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-embed-provider", this.__provider);
    wrapper.setAttribute("data-embed-src", this.__src);
    wrapper.setAttribute("data-embed-url", this.__originalUrl);
    wrapper.className = "embed-card";
    const iframe = document.createElement("iframe");
    iframe.src = this.__src;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    );
    wrapper.appendChild(iframe);
    return { element: wrapper };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: HTMLElement) => {
        if (node.hasAttribute("data-embed-src")) {
          return {
            conversion: (el: HTMLElement): DOMConversionOutput => {
              const provider =
                (el.getAttribute("data-embed-provider") as EmbedProvider) ||
                "youtube";
              const src = el.getAttribute("data-embed-src") ?? "";
              const url = el.getAttribute("data-embed-url") ?? "";
              return { node: $createEmbedNode(provider, src, url) };
            },
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  decorate(): JSX.Element {
    const aspectClass =
      this.__provider === "soundcloud" ? "aspect-[4/1]" : "aspect-video";
    return (
      <div
        className={`embed-card overflow-hidden rounded-lg border border-[var(--border)] my-3 ${aspectClass}`}
      >
        <iframe
          src={this.__src}
          className="w-full h-full"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${this.__provider} embed`}
        />
      </div>
    );
  }
}

export function $createEmbedNode(
  provider: EmbedProvider,
  src: string,
  originalUrl: string
): EmbedNode {
  return new EmbedNode(provider, src, originalUrl);
}

export function $isEmbedNode(node: LexicalNode | null | undefined): node is EmbedNode {
  return node instanceof EmbedNode;
}
