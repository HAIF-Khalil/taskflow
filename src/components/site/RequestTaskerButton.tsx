"use client";

import { useState } from "react";
import { BookingDialog } from "@/components/site/BookingDialog";
import { Button } from "@/components/ui/button";
import type { Tasker } from "@/types";

export function RequestTaskerButton({
  tasker,
  defaultService,
}: {
  tasker: Tasker;
  defaultService?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-500"
      >
        Request this Tasker
      </Button>
      <BookingDialog
        tasker={tasker}
        open={open}
        onOpenChange={setOpen}
        defaultService={defaultService}
      />
    </>
  );
}
