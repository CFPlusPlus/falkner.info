import type { CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectReferenceLink = {
  href: string;
  label: string;
  external: boolean;
  emphasis: "primary" | "secondary" | "tertiary";
};

const PROJECT_STATUS_LABELS = {
  active: "Aktiv",
  maintained: "Betreut",
  archived: "Archiv",
} as const;

export function sortProjects(projects: ProjectEntry[]) {
  return [...projects].sort((a, b) => {
    const aOrder = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.data.order ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.data.year - a.data.year;
  });
}

export function getProjectPath(project: ProjectEntry) {
  return `/projekte/${project.slug}/`;
}

export function getProjectStatusLabel(project: ProjectEntry) {
  return PROJECT_STATUS_LABELS[project.data.status];
}

export function getProjectMetaLine(project: ProjectEntry) {
  return `${project.data.year} / ${getProjectStatusLabel(project)}`;
}

export function getProjectExternalLink(project: ProjectEntry) {
  if (!project.data.externalUrl) return null;

  return {
    href: project.data.externalUrl,
    label: "Live-Seite öffnen",
  };
}

export function getProjectRepoLink(project: ProjectEntry) {
  if (!project.data.repoUrl) return null;

  return {
    href: project.data.repoUrl,
    label: "Repository öffnen",
  };
}

export function getProjectPrimaryLink(project: ProjectEntry) {
  return {
    href: getProjectPath(project),
    label: "Projektseite öffnen",
  };
}

export function getProjectDetailLead(project: ProjectEntry) {
  return project.data.summaryLong ?? project.data.summary;
}

export function getProjectContextLead(project: ProjectEntry) {
  return project.data.summaryShort ?? project.data.summary;
}

export function getProjectHeroMedia(project: ProjectEntry) {
  return project.data.cover ?? project.data.media[0] ?? null;
}

export function getProjectHighlights(project: ProjectEntry) {
  return project.data.highlights.length ? project.data.highlights : project.data.tags;
}

export function getProjectReferenceLinks(
  project: ProjectEntry,
): ProjectReferenceLink[] {
  const externalLink = getProjectExternalLink(project);
  const repoLink = getProjectRepoLink(project);

  return [
    ...(externalLink
      ? [{ ...externalLink, external: true, emphasis: "primary" as const }]
      : []),
    ...(repoLink
      ? [
          {
            ...repoLink,
            external: true,
            emphasis: externalLink ? ("secondary" as const) : ("primary" as const),
          },
        ]
      : []),
    {
      href: "/projekte/",
      label: "Zur Projektübersicht",
      external: false,
      emphasis: "tertiary" as const,
    },
  ];
}

export function selectHomeProjects(projects: ProjectEntry[]) {
  const sortedProjects = sortProjects(projects);
  const featuredProject =
    sortedProjects.find((project) => project.data.homeFeatured) ??
    sortedProjects.find((project) => project.data.featured) ??
    sortedProjects[0];

  return {
    featuredProject,
    supportingProjects: sortedProjects
      .filter((project) => project.id !== featuredProject?.id)
      .slice(0, 2),
  };
}

export function selectProjectOverviewProjects(projects: ProjectEntry[]) {
  const sortedProjects = sortProjects(projects);
  const featuredProjects = sortedProjects.filter(
    (project) => project.data.featured,
  );
  const leadProject = featuredProjects[0] ?? sortedProjects[0];
  const supportingFeaturedProjects = featuredProjects.filter(
    (project) => project.id !== leadProject?.id,
  );
  const supportingFeaturedIds = new Set(
    supportingFeaturedProjects.map((project) => project.id),
  );

  return {
    leadProject,
    supportingFeaturedProjects,
    remainingProjects: sortedProjects.filter(
      (project) =>
        project.id !== leadProject?.id &&
        !supportingFeaturedIds.has(project.id),
    ),
  };
}
