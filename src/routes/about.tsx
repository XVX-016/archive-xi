import { createFileRoute } from "@tanstack/react-router";

import { StaticPageLayout } from "@/components/StaticPageLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ARCHIVE XI" },
      {
        name: "description",
        content: "About ARCHIVE XI — curated clothing sourced with intent.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StaticPageLayout activeNav="about">
      <article className="static-page-content">
        <p className="static-page-kicker">About us</p>
        <h1>About ARCHIVE XI</h1>

        <div className="static-page-body">
          <p className="static-page-placeholder">
            Final brand copy will be added here. This page is a placeholder structure only.
          </p>
          <p className="static-page-placeholder">
            Body copy block — headline narrative, sourcing approach, and editorial tone to follow.
          </p>
        </div>

        <div className="static-page-image-slot" aria-hidden="true">
          <span>Optional image slot</span>
        </div>
      </article>
    </StaticPageLayout>
  );
}
