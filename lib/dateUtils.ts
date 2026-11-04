const BUSINESS_TIME_ZONE = "Europe/Amsterdam";

export function getAmsterdamDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function getMinimumLunchroomDate(date = new Date()): string {
  const [year, month, day] = getAmsterdamDate(date).split("-").map(Number);
  const amsterdamTomorrow = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  const localTomorrowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const localTomorrow = [
    localTomorrowDate.getFullYear(),
    String(localTomorrowDate.getMonth() + 1).padStart(2, "0"),
    String(localTomorrowDate.getDate()).padStart(2, "0"),
  ].join("-");

  return localTomorrow > amsterdamTomorrow ? localTomorrow : amsterdamTomorrow;
}
