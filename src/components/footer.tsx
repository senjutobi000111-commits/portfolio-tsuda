import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/constants/socials";

import { SiNextdotjs } from "@icons-pack/react-simple-icons";
import { LoveIcon } from "@/components/svgs/LoveIcon";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const dragonImageClasses = cn(
  "absolute -top-12 opacity-45 grayscale",
  "w-[360px] h-[160px]",
);

const socialLinkClasses = cn("transition-colors duration-150 hover:text-off-w");

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer
      className={cn(
        "border-off-w/15 relative flex h-20 w-full items-center overflow-hidden border-t bg-gradient-to-t from-black/60 to-black/10 py-4",
        "px-8 xl:px-16",
      )}
    >
      {/* Right Dragon */}
      <Image
        src="/images/dragon.avif"
        alt="Dragon"
        width={360}
        height={160}
        quality={75}
        className={cn(
          dragonImageClasses,
          "right-0 -rotate-12",
          "max-lg:-right-24 max-sm:-right-32 sm:translate-y-4",
        )}
      />

      {/* Left Dragon */}
      <Image
        src="/images/dragon.avif"
        alt="Dragon"
        width={360}
        height={160}
        quality={75}
        className={cn(
          dragonImageClasses,
          "left-0 translate-y-4 -scale-x-100 rotate-[10deg]",
          "max-lg:-left-24 max-sm:hidden",
        )}
      />

      {/* Built With Section */}
      <div className={cn("text-off-w/85 z-10 flex flex-1 items-center", "max-md:hidden")}>
        <p className="text-xs">{t("made-with")}</p>
        <LoveIcon className="text-off-w mx-1 size-5" />
        <p className="text-xs">{t("and")}</p>
        <Link
          href="https://nextjs.org/"
          target="_blank"
          rel="noreferrer"
          className="ml-1.5 transition-opacity duration-200 hover:opacity-65"
        >
          <SiNextdotjs className="text-off-w size-5" />
        </Link>
      </div>

      {/* Copyright Section */}
      <div
        className={cn(
          "z-10 flex flex-1 flex-col items-center gap-y-0.5",
          "max-md:items-start",
        )}
      >
        <p className="text-off-w text-xs font-bold tracking-tight">
          © {new Date().getFullYear()} • Kazyel
        </p>
        <p className="text-off-w/50 max-xs:text-[0.5rem] text-[0.65rem]">
          {t("copyright")}
        </p>
      </div>

      {/* Social Links Section */}
      <div className="text-off-w/75 z-10 flex flex-1 items-center justify-end gap-x-3 text-xs">
        {Object.entries(SOCIAL_LINKS)
          .flatMap(([key, social], index) => [
            <Link
              key={key}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={socialLinkClasses}
            >
              <social.icon className="size-6" />
            </Link>,

            index < Object.entries(SOCIAL_LINKS).length - 1 && (
              <p key={`separator-${index}`}>●</p>
            ),
          ])
          .filter(Boolean)}
      </div>
    </footer>
  );
};
