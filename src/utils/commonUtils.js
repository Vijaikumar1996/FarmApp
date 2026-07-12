// src/utils/dateUtils.js

export const formatDate = (date) => {
  if (!date) return "";
  return date.includes("T") ? date.split("T")[0] : date;
};

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export const isFutureDate = (date) => {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const requestDate = new Date(date);
  requestDate.setHours(0, 0, 0, 0);

  return requestDate > today;
};
