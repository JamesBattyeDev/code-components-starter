import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, type ComponentType } from "react";

const modules = import.meta.glob([
  "../components/*.tsx",
  "!../components/*.webflow.tsx",
]) as Record<string, () => Promise<{ default: ComponentType }>>;

const entries = Object.entries(modules);
const componentRegister: Record<string, ComponentType> = {};

for (const [path, loader] of entries) {
  const slug = path.split("/").pop()!.replace(/.tsx$/, "");
  componentRegister[slug] = lazy(loader);
}

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <div className="p-15">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Component Index</h1>
          <p className="mt-2 text-gray-600">
            This page lists all components exported from the codebase. Built
            using TanStack Router for file-based routing and type-safe
            navigation.
          </p>
        </header>
        <div className="flex flex-wrap gap-3">
          {Object.entries(componentRegister).map(([slug, _component]) => {
            return (
              <div key={slug}>
                <Link
                  preload="intent"
                  className="hover:bg-orange-400 transition-colors py-2 px-3 rounded-full bg-orange-300"
                  to={"/" + slug}
                >
                  {slug}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
