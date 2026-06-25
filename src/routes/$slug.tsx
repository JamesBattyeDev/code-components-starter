import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { ShadowRoot } from "../base-ui/shadow-dom.tsx";

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

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => ({
    meta: [
      {
        title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
      },
      {
        name: "description",
        content: `Preview of the ${params.slug} component, rendered inside the shadow DOM.`,
      },
    ],
  }),
  component: () => {
    const { slug } = Route.useParams();
    const Component = componentRegister[slug];

    if (!Component) {
      redirect({
        to: "/",
      });
    }

    return (
      <Suspense>
        <div className="border-b border-blue-300 bg-white p-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
        <div className="py-10">
          <ShadowRoot>
            <Component></Component>
          </ShadowRoot>
        </div>
      </Suspense>
    );
  },
});
