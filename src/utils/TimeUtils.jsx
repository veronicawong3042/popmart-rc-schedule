export function addBreaks(startTime, endTime) {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (endMinutes - startMinutes > 330) {
    const breakStart =
      startMinutes +
      Math.floor((endMinutes - startMinutes) / 2) -
      15;

    const breakEnd = breakStart + 30;

    const format = m =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(
        m % 60
      ).padStart(2, "0")}`;

    return [`${format(breakStart)}-${format(breakEnd)}`];
  }

  return [];
}
