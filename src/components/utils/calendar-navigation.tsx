"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarNavigation } from "@/hooks/use-calendar-navigation";
import { formatDateWithShortMonth } from "@/utils/date";

export const CalendarNavigation = ({ date }: { date?: Date }) => {
  const { year, month, isNextMonthDisabled, nextMonth, previousMonth } =
    useCalendarNavigation({ date });

  return (
    <div className="flex gap-x-5 items-center">
      <Button variant="outline" size="icon" onClick={previousMonth}>
        <ChevronLeftIcon />
      </Button>
      <strong>
        {formatDateWithShortMonth(new Date(`${year}-${month}`))} {year}
      </strong>
      <Button
        variant="outline"
        size="icon"
        onClick={nextMonth}
        disabled={isNextMonthDisabled}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
