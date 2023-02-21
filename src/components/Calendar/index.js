import { useEffect, useState, useMemo, useCallback } from "react";
import styles from "./Calendar.css";

function createMonth(month, year) {
  const isLeapYear = (year) =>
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

  const getDatesInMonth = (y, m) => {
    const d = new Date(y, m);

    const year = d.getFullYear();
    const month = d.getMonth();

    if (isLeapYear(year) && month === 1) return 29;

    if (!isLeapYear(year) && month === 1) return 28;

    if (month === 3 || month === 5 || month === 8 || month === 10) return 30;

    return 31;
  };

  const currentMonthDatesCount = getDatesInMonth(year, month);
  const previousMonthDatesCount = getDatesInMonth(year, month - 1);
  const nextMonthDatesCount = getDatesInMonth(year, month + 1);

  const firstDays = new Date(year, month, 1).getDay(); // 0 - 6 (sunday - saturday)
  const lastDays = new Date(year, month, currentMonthDatesCount).getDay(); // 0 - 6 (sunday - saturday)

  const createDatesArr = (datesInMonthCount) => {
    let arr = [];
    for (let i = 1; i <= datesInMonthCount; i++) {
      arr.push(i);
    }
    return arr;
  };

  return createDatesArr(previousMonthDatesCount) // [ 1, 2, ..., 30, 31 ]
    .slice(previousMonthDatesCount - firstDays) // ngày của tháng trước  [ 30, 31 ]
    .map((item) => {
      // item: e.g. 30, 31

      return {
        value: new Date(year, month - 1, item),
        label: item,
        isCurrentMonth: false,
      };
    })
    .concat(
      createDatesArr(currentMonthDatesCount).map((item) => {
        // item: e.g.: 1 - 30
        return {
          value: new Date(year, month, item),
          label: item,
          isCurrentMonth: true,
        };
      })
    )
    .concat(
      createDatesArr(nextMonthDatesCount) // [ 1, 2, ..., 30, 31 ]
        .slice(0, 6 - lastDays) // ngày của tháng sau [ 1, 2 ]
        .map((item) => {
          // e.g.: 1, 2
          return {
            value: new Date(year, month + 1, item),
            label: item,
            isCurrentMonth: false,
          };
        })
    );
}

const trans = {
  sold_out: {
    en: "Sold Out",
    vi: "Đã bán hết",
  },
  available: {
    en: "Available",
    vi: "Còn hàng",
  },
  selected: {
    en: "Selected",
    vi: "Đã chọn",
  },
};

const getRange = (datesArr) => {
  const timestamps = datesArr.map((item) => item.getTime());

  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  return { min: new Date(min), max: new Date(max) };
};

// main
function Calendar({
  onSelect = function () {},
  availableDates = [],
  className = "",
  language = "vi",
}) {
  const range = getRange(availableDates);
  const [selectedDate, setSelectedDate] = useState(null);
  // current month
  const [time, setTime] = useState({
    month:
      availableDates.length > 0 ? range.min.getMonth() : new Date().getMonth(), // 0 - 11
    year:
      availableDates.length > 0
        ? range.min.getFullYear()
        : new Date().getFullYear(),
  });

  const DAYS = useMemo(
    () => [
      { en: "Sun", vi: "CN" },
      { en: "Mon", vi: "T2" },
      { en: "Tue", vi: "T3" },
      { en: "Wed", vi: "T4" },
      { en: "Thur", vi: "T5" },
      { en: "Fri", vi: "T6" },
      { en: "Sat", vi: "T7" },
    ],
    []
  );

  const MONTHS = useMemo(
    () => [
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
    ],
    []
  );

  const isSameDate = useCallback((d1, d2) => {
    return (
      new Date(d1.getTime()).setHours(0, 0, 0, 0) ===
      new Date(d2.getTime()).setHours(0, 0, 0, 0)
    );
  }, []);

  const isMinMonth =
    time.year === range.min.getFullYear() &&
    time.month === range.min.getMonth();
  const isMaxMonth =
    time.year === range.max.getFullYear() &&
    time.month === range.max.getMonth();

  const thisMonth = createMonth(time.month, time.year);

  const viewed_dates = thisMonth.map((item) => ({
    ...item,
    isSelected: selectedDate && isSameDate(item.value, selectedDate),
    isAvailable: availableDates.find((availableDate) =>
      isSameDate(availableDate, item.value)
    ),
  }));

  const paginationHandler = (step) => {
    if ((step === -1 && isMinMonth) || (step === 1 && isMaxMonth)) {
      return;
    }

    setTime((prev) => {
      const month = prev.month;
      const year = prev.year;

      if (month + step > 11) {
        return {
          year: year + 1,
          month: 0,
        };
      }

      if (month + step < 0) {
        return {
          year: year - 1,
          month: 11,
        };
      }

      return {
        year: year,
        month: month + step,
      };
    });
  };

  const onSelectDate = (dateItem) => {
    if (dateItem.isAvailable) {
      setSelectedDate(dateItem.value);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      onSelect(selectedDate);
      console.log("selected dates: ", selectedDate);
    }
  }, [selectedDate]);

  const dateClasses = (is_current_month, isSelected, isAvailable) => {
    let classes = styles.date + " ";
    if (isAvailable) {
      classes += " available ";
    }

    if (!is_current_month) {
      classes += " notCurrentMonth ";
    }

    if (isSelected) {
      classes += " isSelected ";
    }

    return classes;
  };

  // JSXs
  const Dates = ({ dates }) => (
    <ul className="dates_row">
      {dates.map((date, index) => (
        <li
          key={index}
          className={dateClasses(
            date.isCurrentMonth,
            date.isSelected,
            date.isAvailable
          )}
          onClick={() => {
            onSelectDate(date);
          }}
        >
          <span>{date.label}</span>
        </li>
      ))}
    </ul>
  );

  // classes
  let classes = "ntav_calendar " + className;

  let previousIndicatorClasses = "indicator";
  if (isMinMonth) {
    previousIndicatorClasses += " disabled";
  }

  let nextIndicatorClasses = "indicator";
  if (isMaxMonth) {
    nextIndicatorClasses += " disabled";
  }

  return (
    <div className={classes}>
      <div className="header">
        <h6 className="current_month">
          {MONTHS[time.month][language]}, {time.year}
        </h6>

        <div className="indicators">
          <button
            title={isMinMonth ? "Không có ngày sẵn có ở tháng trước" : ""}
            className={previousIndicatorClasses}
            onClick={() => paginationHandler(-1)}
          >
            &#10094;
          </button>
          <span className="indicatorMiddle">○</span>
          <button
            title={isMinMonth ? "Không có ngày sẵn có ở tháng sau" : ""}
            className={nextIndicatorClasses}
            onClick={() => paginationHandler(1)}
          >
            &#10095;
          </button>
        </div>
      </div>

      <ul className="days">
        {DAYS.map((item) => (
          <li key={item[language]}>{item[language]}</li>
        ))}
      </ul>

      <ul className="dates">
        <Dates dates={viewed_dates.slice(0, 7)} />
        <Dates dates={viewed_dates.slice(7, 14)} />
        <Dates dates={viewed_dates.slice(14, 21)} />
        <Dates dates={viewed_dates.slice(21, 28)} />
        <Dates dates={viewed_dates.slice(28, 35)} />
        <Dates dates={viewed_dates.slice(35)} />
      </ul>

      <div className="notes">
        <div className="note">
          <div className="isSelected colorBox" />
          <span>{trans.selected[language]}</span>
        </div>

        <div className="note">
          <div className="available colorBox" />
          <span>{trans.available[language]}</span>
        </div>

        <div className="note">
          <div className="unavailable colorBox" />
          <span>{trans.sold_out[language]}</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
