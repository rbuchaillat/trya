export const formatDateWithDayAndShortMonth = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

export const formatDateWithShortMonth = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);
};

export const getMonthDates = (date: Date = new Date()) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    startDate: formatDate(firstDayOfMonth),
    endDate: formatDate(lastDayOfMonth),
  };
};
