export const formatDateWithShortMonth = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(date);

  return formattedDate;
};
