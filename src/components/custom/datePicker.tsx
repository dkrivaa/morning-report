"use client";

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  paramName: string; // e.g. "date"
  className?: string;
}

function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export default function DatePicker({ paramName, className }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const value = searchParams.get(paramName) ?? today();
  const selectedDate = new Date(value);

  function handleSelect(date: Date | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, date ? format(date, "yyyy-MM-dd") : today());
    router.push(`?${params.toString()}`);
    setOpen(false); // 👈 close on select
  }

  return (
    <div className="grid gap-2">
      <Label>Select Date</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn("w-60 justify-start text-left font-normal", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "yyyy-MM-dd")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => handleSelect(undefined)}
            >
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}