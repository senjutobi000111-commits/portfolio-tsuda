import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  let locale = "en";
  const cookieStore = await cookies();
  const headerList = await headers();

  const localeCookie = cookieStore.get("NEXT_LOCALE");

  if (!localeCookie) {
    const acceptLanguage = headerList.get("accept-language");

    if (acceptLanguage?.includes("pt") || acceptLanguage?.includes("pt-BR")) {
      locale = "pt";
    }
  } else {
    locale = localeCookie.value;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
