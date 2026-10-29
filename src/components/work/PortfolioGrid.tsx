"use client";

import { useSearchParams } from "next/navigation";
import { startTransition, useState, ViewTransition } from "react";
import { projects, workCategories, type WorkCategory } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

type Filter = WorkCategory | "all";

const isFilter = (v: string | null): v is Filter => workCategories.some((c) => c.id === v);

/**
 * Filterable editorial grid. The filter is mirrored in ?category= so it can
 * be linked to and survives refresh/back. Cards morph to their new positions
 * via React <ViewTransition> when the filter changes.
 */
export function PortfolioGrid() {
  const params = useSearchParams();
  const initial = params.get("category");
  const [filter, setFilter] = useState<Filter>(isFilter(initial) ? initial : "all");

  const shown = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));

  const choose = (next: Filter) => {
    startTransition(() => setFilter(next));
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter projects by discipline">
        {workCategories.map((c) => {
          const count = c.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(c.id as WorkCategory)).length;
          if (!count) return null;
          return (
            <button
              key={c.id}
              type="button"
              className={`glass ${styles.filter}`}
              aria-pressed={filter === c.id}
              onClick={() => choose(c.id)}
            >
              {c.label}
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      <GridList items={shown} />
    </>
  );
}

/** Static (server-renderable) version used as the Suspense fallback. */
export function GridList({ items = projects }: { items?: typeof projects }) {
  return (
    <div className={styles.grid}>
      {items.map((project, i) => {
        const row = Math.floor(i / 2);
        const first = i % 2 === 0;
        const lastAlone = first && i === items.length - 1;
        const wide = lastAlone ? "full" : (row % 2 === 0) === first ? "wide" : "narrow";
        return (
          <ViewTransition key={project.slug} name={`work-${project.slug}`}>
            <div className={`${styles.cell} ${styles[`cell_${wide}`]} ${!first ? styles.offset : ""}`}>
              <ProjectCard
                project={project}
                priority={i < 2}
                sizes={wide === "full" ? "100vw" : wide === "wide" ? "(min-width: 1000px) 58vw, 100vw" : "(min-width: 1000px) 42vw, 100vw"}
              />
            </div>
          </ViewTransition>
        );
      })}
    </div>
  );
}
