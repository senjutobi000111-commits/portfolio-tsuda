import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendEmail } from "@/app/actions/send-email";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { emailSchema, type EmailFormSchema } from "@/lib/validations/form";

import { toast } from "sonner";
import { FormField } from "@/components/sections/contact/form/form-field";
import { SubmitButton } from "@/components/sections/contact/form/submit-button";

export type FormEntries = keyof EmailFormSchema;

type TypeOptions = "text" | "email";
type AsOptions = "textarea" | "input";

export function Form() {
  const turnstileRef = useRef<TurnstileInstance>(null);

  const t = useTranslations("ContactForm");
  const locale = useLocale() as string;

  const siteKey =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE!
      : "1x00000000000000000000AA";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormSchema>({
    resolver: yupResolver(emailSchema),
    defaultValues: { name: "", message: "", email: "" },
  });

  const formEntries: FormEntries[] = ["name", "email", "message"];
  const labels = [t("name"), t("email"), t("message")];

  const onSubmit = async (data: EmailFormSchema) => {
    try {
      turnstileRef.current?.execute();
      const token = await turnstileRef.current?.getResponsePromise();
      if (!token) throw new Error("Captcha timed out");
      await handleSubmitForm(data, token);
    } catch (error) {
      toast.error(t("captcha-error"));
    } finally {
      turnstileRef.current?.reset();
    }
  };

  const handleSubmitForm = async (data: EmailFormSchema, token: string | null) => {
    if (!token) {
      toast.error(t("captcha-error"));
      return;
    }

    const emailResponse = await sendEmail(data, token);
    if (emailResponse) {
      toast.success(t("success"));
      reset();
      return;
    }
    toast.error(t("error"));
  };

  const getFieldProps = (entry: string, index: number) => ({
    register,
    errors,
    label: labels[index],
    name: entry as FormEntries,
    type: entry === "email" ? "email" : ("text" as TypeOptions),
    as: entry === "message" ? "textarea" : ("input" as AsOptions),
  });

  return (
    <form
      id="email-form"
      className="text-off-w flex flex-col gap-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {formEntries.map((entry, index) => (
        <FormField key={entry} {...getFieldProps(entry, index)} />
      ))}

      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{
          execution: "execute",
          retry: "never",
          size: "invisible",
          theme: "dark",
          language: locale,
        }}
        className="-mt-[20px]"
      />

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
