import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ProjectTagProps {
  status: string;
  role?: string;
  hasDemo?: boolean;
}

export const ProjectTag = ({ status, role, hasDemo }: ProjectTagProps) => {
  const t = useTranslations("ProjectStatus");

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
      {role && (
        <div className="text-off-w border-off-w/30 rounded-md border bg-black/70 px-2 py-1 text-xs font-medium tracking-tight shadow-sm backdrop-blur-sm">
          {role}
        </div>
      )}
      <div
        className={cn(
          "text-off-w rounded-md border px-2 py-1 text-xs font-medium tracking-tight shadow-sm",
          status === "Current" && "border-blue-400/60 bg-blue-700",
          status === "Complete" && "border-green-400/60 bg-green-700",
          status === "On-hold" && "border-orange-400/60 bg-orange-700",
          status === "Abandoned" && "border-red-400/60 bg-red-700",
        )}
      >
        {t(status)}
      </div>
      {hasDemo && (
        <div className="text-darkest border-acc-yellow-3/70 bg-acc-yellow-2 rounded-md border px-2 py-1 text-xs font-semibold tracking-tight shadow-sm">
          Demo
        </div>
      )}
    </div>
  );
};
