export const dateFormat = (dateTime) => {
  const date = new Date(dateTime).toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return date;
};
