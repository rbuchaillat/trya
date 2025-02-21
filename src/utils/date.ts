export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateWithDayAndShortMonth = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

export const formatDateWithMonth = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
};

export const getLastMonthDates = () => {
  const now = new Date();

  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const localStartDate = new Date(
    firstDayOfLastMonth.getTime() -
      firstDayOfLastMonth.getTimezoneOffset() * 60000
  );

  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const localEndDate = new Date(
    lastDayOfLastMonth.getTime() -
      lastDayOfLastMonth.getTimezoneOffset() * 60000
  );

  return {
    startDate: formatDate(localStartDate),
    endDate: formatDate(localEndDate),
  };
};
