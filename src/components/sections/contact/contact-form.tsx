"use client";

import { type CustomMotion } from "@/lib/types";

import { cn } from "@/lib/utils";

import { m } from "@/components/motion-wrapper";
import { ShineBorder } from "@/components/ui/shine-border";
import { Form } from "@/components/sections/contact/form/form";

const CONTACT_MOTION: CustomMotion<"div"> = {
  initial: { opacity: 0, filter: "blur(5px)", scale: 0.98 },
  whileInView: { opacity: 1, filter: "blur(0px)", scale: 1 },
  transition: {
    duration: 0.75,
    delay: 0.25,
    type: "spring",
    stiffness: 100,
    damping: 15,
  },
  viewport: { once: true, amount: 0.65 },
};

export const ContactForm = () => {
  return (
    <m.div
      {...CONTACT_MOTION}
      className={cn(
        "border-off-w/40 relative z-10 flex flex-col gap-y-3 overflow-hidden rounded-lg border bg-black p-4",
        "w-full sm:w-[425px]",
      )}
    >
      {/* Form */}
      <Form />

      <ShineBorder shineColor={["#F3E5D7bb", "#F3E5D755", "#F3E5D733"]} />
    </m.div>
  );
};
