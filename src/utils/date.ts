export const formatDateWithShortMonth = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(date);

  return formattedDate;
};

export const formatDateWithLongMonth = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
  }).format(date);

  return formattedDate;
};

export const getLastMonthDates = () => {
  const now = new Date();

  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  lastDayOfLastMonth.setHours(23, 59, 59, 999);
  firstDayOfLastMonth.setHours(0, 0, 0, 0);

  const localStartDate = new Date(
    firstDayOfLastMonth.getTime() -
      firstDayOfLastMonth.getTimezoneOffset() * 60000
  );
  const localEndDate = new Date(
    lastDayOfLastMonth.getTime() -
      lastDayOfLastMonth.getTimezoneOffset() * 60000
  );

  return {
    startDate: localStartDate.toISOString(),
    endDate: localEndDate.toISOString(),
  };
};
