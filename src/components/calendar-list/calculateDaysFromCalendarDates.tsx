import { CalendarDate } from 'typings';

export const calculateDaysFromCalendarDates = (calendarDates: CalendarDate[]) => {
  const disabledDays = [] as string[];
  const days = calendarDates.map((cd: CalendarDate) => {
    const isDisabled = cd.exception_type === '2';
    if (isDisabled) {
      disabledDays.push(cd.date);
    }
    return cd.date;
  });
  return { days: days, disabledDays: disabledDays };
};
