import { BentoProjectCard } from "~/components/public/bento-project-card";
import { cn } from "~/lib/utils";
import type { ProjectItem } from "~/types/content";

interface FeaturedProjectsSectionProps {
  projects: ProjectItem[];
  theme?: "light" | "dark";
}

export function FeaturedProjectsSection({
  projects,
  theme = "light",
}: FeaturedProjectsSectionProps) {
  const isLight = theme === "light";
  const publishedProjects = projects.filter((p) => p.isPublished);

  return (
    <section
      id="proyek"
      className={cn(
        "deferred-section w-full rounded-[20px] p-6 sm:p-10 lg:rounded-[24px] lg:p-14 outline-none scroll-mt-20",
        isLight
          ? "bg-white border border-card-border shadow-xs"
          : "bg-bg2 border-0",
      )}
    >
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12.5px] font-bold uppercase tracking-wider text-rust">
            Portofolio Terpilih
          </p>
          <h2 className="font-display-anton mt-1 text-[clamp(2rem,3.8vw,3.25rem)] uppercase leading-none text-cream">
            Proyek Unggulan
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {publishedProjects.map((project, index) => (
          <BentoProjectCard
            key={project.id}
            project={project}
            index={index}
            isPrimary={index === 0}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
}
