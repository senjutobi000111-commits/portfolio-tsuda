"use client";

import type { CustomMotion } from "@/lib/types";

import { m } from "@/components/motion-wrapper";

const FORM_ERROR_MOTION: CustomMotion<"p"> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  transition: { duration: 0.25, ease: "easeInOut" },
};

interface FormErrorsProps {
  message: string;
}

export const FormErrors = ({ message }: FormErrorsProps) => {
  return (
    <m.p {...FORM_ERROR_MOTION} className="text-[10px] text-red-300/75 italic">
      * {message}.
    </m.p>
  );
};
