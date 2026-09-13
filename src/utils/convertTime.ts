export const convertTimeToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date(1970, 0, 1);
  date.setHours(hours, minutes, 0, 0);

  return date;
};
