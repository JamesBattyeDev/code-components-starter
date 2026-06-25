import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./styles.css?inline";

// One constructable stylesheet shared by every ShadowRoot instance. It holds the
// compiled Tailwind/global CSS so class-based components (e.g. Button) render
// styled inside the shadow boundary — global stylesheets don't cross it.
let sheet: CSSStyleSheet | null = null;

function getStyleSheet(): CSSStyleSheet | null {
  if (typeof CSSStyleSheet === "undefined") return null; // SSR guard
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
  }
  return sheet;
}

interface ShadowRootProps {
  children: ReactNode;
  mode?: ShadowRootMode;
}

export function ShadowRoot({ children, mode = "open" }: ShadowRootProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // `ShadowRoot` (the DOM type) is shadowed by this component's name, so refer
  // to it via globalThis in type position.
  const [shadowRoot, setShadowRoot] = useState<globalThis.ShadowRoot | null>(
    null,
  );

  // attachShadow / adoptedStyleSheets are client-only, so wire them up after
  // hydration. Children portal in once the root exists.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = host.shadowRoot ?? host.attachShadow({ mode });
    const styleSheet = getStyleSheet();
    if (styleSheet) {
      root.adoptedStyleSheets = [styleSheet];
    }
    setShadowRoot(root);
  }, [mode]);

  return (
    <div ref={hostRef}>
      {shadowRoot ? createPortal(children, shadowRoot) : null}
    </div>
  );
}
