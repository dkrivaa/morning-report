"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ExpenseStatusResponse } from "@/lib/types";
import ExpenseStatusList from "@/components/custom/expenseStatusList";

interface DrawerProps {
  data: ExpenseStatusResponse;
  date: string;
}

export default function ExpenseDrawer({ data, date }: DrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Expense Report Status</Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col w-full items-center gap-4">
        <div className="flex flex-col w-full items-center gap-2 p-4 shrink-0">
          <DrawerTitle>Expense Reporting Status</DrawerTitle>
          <DrawerDescription>`Reporting status for {date}`</DrawerDescription>
        </div>
        <div className="flex-1 w-full overflow-y-auto px-4 pt-4 pb-4">
          <ExpenseStatusList data={data} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
