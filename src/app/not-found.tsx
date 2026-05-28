import { useTranslations } from "next-intl";

import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-y-8 px-8">
        <Image
          src={"/images/torii.webp"}
          alt="Torii Gate"
          width={300}
          height={300}
          quality={75}
          className="absolute -bottom-14 left-1/2 -translate-x-[calc(50%-15px)] opacity-25 max-md:top-0"
        />

        <Image
          src={"/images/kazyel-icon.png"}
          alt="Website Logo"
          width={300}
          height={300}
          quality={75}
          className="z-10 size-24"
        />

        <div className="z-10 flex flex-col items-center justify-center gap-y-4">
          <h2 className="text-off-w text-4xl font-extrabold tracking-tight max-lg:text-center">
            {t("title")}
          </h2>
          <p className="text-off-w/50 font-light tracking-tight italic max-md:text-center">
            {t("message")}
          </p>
        </div>

        <Link
          href="/"
          className="bg-off-w hover:bg-off-w/60 z-10 flex items-center gap-x-1.5 rounded-sm p-2 font-extrabold text-black transition-all duration-200 ease-in-out"
        >
          <ArrowLeftIcon className="size-5" />
          {t("return")}
        </Link>
      </div>
    </div>
  );
}
