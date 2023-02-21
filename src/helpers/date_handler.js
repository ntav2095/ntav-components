const MAX_YEAR = 9999;
const MIN_YEAR = 1800;

const isLeapYear = (year) =>
  (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

export function isValidDate(date, month, year) {
  if (isNaN(Number(date)) || isNaN(Number(month)) || isNaN(Number(year))) {
    return false;
  }

  const d = Number(date);
  const m = Number(month);
  const y = Number(year);

  if (d > 31 || d < 1 || m < 1 || m > 12 || y > MAX_YEAR || y < MIN_YEAR) {
    return false;
  }

  if (m === 2) {
    if (isLeapYear(y)) {
      return d <= 29;
    }
    return d <= 28;
  }

  if (m === 4 || m === 6 || m === 9 || m === 11) return d <= 30;

  return true;
}

// ddMMyyyy => [error, timestamp]
export const stringToDate = (dateString) => {
  let val = dateString.trim();
  if (!(val.length === 6 || val.length === 8)) {
    return [new Error("Ngày không hợp lệ"), null];
  }

  let d, m, y;

  d = val.slice(0, 2);
  m = val.slice(2, 4);
  y = val.slice(4);

  if (val.length === 6) {
    y = "20" + y;
  }

  if (!isValidDate(d, m, y)) {
    return [new Error("Ngày không hợp lệ"), null];
  }

  return [null, new Date(Number(y), Number(m) - 1, Number(d)).getTime()];
};

// m: 0 - 11
export const getDatesInMonth = (y, m) => {
  const d = new Date(y, m);

  const year = d.getFullYear();
  const month = d.getMonth();

  if (isLeapYear(year) && month === 1) return 29;

  if (!isLeapYear(year) && month === 1) return 28;

  if (month === 3 || month === 5 || month === 8 || month === 10) return 30;

  return 31;
};

export const isSameDate = (d1, d2) => {
  return (
    new Date(d1.getTime()).setHours(0, 0, 0, 0) ===
    new Date(d2.getTime()).setHours(0, 0, 0, 0)
  );
};

export const DAYS = [
  { en: "Sun", vi: "CN" },
  { en: "Mon", vi: "T2" },
  { en: "Tue", vi: "T3" },
  { en: "Wed", vi: "T4" },
  { en: "Thur", vi: "T5" },
  { en: "Fri", vi: "T6" },
  { en: "Sat", vi: "T7" },
];

export const MONTHS = [
  { en: "January", vi: "Tháng 1" },
  { en: "February", vi: "Tháng 2" },
  { en: "March", vi: "Tháng 3" },
  { en: "April", vi: "Tháng 4" },
  { en: "May", vi: "Tháng 5" },
  { en: "June", vi: "Tháng 6" },
  { en: "July", vi: "Tháng 7" },
  { en: "August", vi: "Tháng 8" },
  { en: "September", vi: "Tháng 9" },
  { en: "October", vi: "Tháng 10" },
  { en: "November", vi: "Tháng 11" },
  { en: "December", vi: "Tháng 12" },
];

export const createDatesArr = (dates_in_month_count) => {
  let arr = [];
  for (let i = 1; i <= dates_in_month_count; i++) {
    arr.push(i);
  }
  return arr;
};
