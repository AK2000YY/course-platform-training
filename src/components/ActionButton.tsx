"use client";

import { ComponentPropsWithRef, ReactNode, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LoadingTextSwap } from "./LoadingTextSwap";

export function ActionButton({
  action,
  requireAreYouSure = false,
  ...props
}: Omit<ComponentPropsWithRef<typeof Button>, "onClick"> & {
  action: () => Promise<{ error: boolean; message: string }>;
  requireAreYouSure?: boolean;
}) {
  const [isLoading, startTransiction] = useTransition();

  function performTransiction() {
    startTransiction(async () => {
      const data = await action();
      if (data.error) toast.error("Error", { description: data.message });
      else toast.success("Success", { description: data.message });
    });
  }
  return (
    <Button {...props} onClick={performTransiction} disabled={isLoading}>
      <LoadingTextSwap isLoading={isLoading}>{props.children}</LoadingTextSwap>
    </Button>
  );
}
