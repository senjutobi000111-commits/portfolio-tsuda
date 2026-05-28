import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ProjectTagProps {
  status: string;
}

export const ProjectTag = ({ status }: ProjectTagProps) => {
  const t = useTranslations("ProjectStatus");

  return (
    <div
      className={cn(
        "text-off-w absolute top-3 right-3 z-10 rounded-md border px-2 py-1 text-xs font-medium tracking-tight shadow-sm",
        status === "Current" && "border-blue-400/60 bg-blue-700",
        status === "Complete" && "border-green-400/60 bg-green-700",
        status === "On-hold" && "border-orange-400/60 bg-orange-700",
        status === "Abandoned" && "border-red-400/60 bg-red-700",
      )}
    >
      {t(status)}
    </div>
  );
};
