"use client";

import { Provider } from "jotai";

export default function JotaiProvider({
  children: children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
