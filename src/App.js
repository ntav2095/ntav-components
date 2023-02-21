import Calendar from "./components/Calendar";

export default function App() {
  return (
    <div className="app">
      <h1 className="ntavTitle">Ntav component</h1>
      <h2 className="ntavSubTitle">Calendar - 21/02/2023</h2>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <Calendar
          availableDates={[
            new Date("2023-02-22"),
            new Date("2023-02-23"),
            new Date("2023-02-25"),
          ]}
        />
      </div>
    </div>
  );
}
