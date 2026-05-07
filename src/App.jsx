import "./App.css";

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";

import StatsCards from "./components/StatsCards";

import Charts from "./components/Charts";

import CarsTable from "./components/CarsTable";

import AddCarPopup from "./components/AddCarPopup";

import PartsPopup from "./components/PartsPopup";

function App() {
  const [darkMode, setDarkMode] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedCar, setSelectedCar] =
    useState(null);

  const statusList = [
    "รอทำ",
    "กำลังทำ",
    "เสร็จแล้ว",
  ];

  const [cars, setCars] = useState(
    JSON.parse(
      localStorage.getItem("cars")
    ) || [
      {
        vin: "A001",

        model:
          "Honda Civic FK",

        pdi: "เสร็จแล้ว",

        custom:
          "เสร็จแล้ว",

        delivery:
          "เสร็จแล้ว",

        progress: 100,

        parts: [],
      },

      {
        vin: "A002",

        model:
          "Toyota Yaris",

        pdi: "กำลังทำ",

        custom: "รอทำ",

        delivery: "รอทำ",

        progress: 33,

        parts: [],
      },
    ]
  );

  useEffect(() => {
    localStorage.setItem(
      "cars",
      JSON.stringify(cars)
    );
  }, [cars]);

  const updateProgress = (
    updatedCars,
    index
  ) => {
    let done = 0;

    if (
      updatedCars[index].pdi ===
      "เสร็จแล้ว"
    )
      done++;

    if (
      updatedCars[index]
        .custom ===
      "เสร็จแล้ว"
    )
      done++;

    if (
      updatedCars[index]
        .delivery ===
      "เสร็จแล้ว"
    )
      done++;

    updatedCars[index].progress =
      Math.floor(
        (done / 3) * 100
      );
  };

  const changeStatus = (
    index,
    field
  ) => {
    if (field === "custom")
      return;

    const updatedCars = [...cars];

    if (
      updatedCars[index][field] ===
      "เสร็จแล้ว"
    ) {
      return;
    }

    const currentStatus =
      updatedCars[index][field];

    const currentIndex =
      statusList.indexOf(
        currentStatus
      );

    const nextIndex =
      currentIndex + 1;

    updatedCars[index][field] =
      statusList[nextIndex];

    updateProgress(
      updatedCars,
      index
    );

    setCars(updatedCars);
  };

  const resetCar = (
    index
  ) => {
    const updatedCars = [
      ...cars,
    ];

    updatedCars[index].pdi =
      "รอทำ";

    updatedCars[index].delivery =
      "รอทำ";

    updateProgress(
      updatedCars,
      index
    );

    setCars(updatedCars);
  };

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app light"
      }
    >
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="main">
        <h1 className="title">
          Dashboard
        </h1>

        <StatsCards cars={cars} />

        <AddCarPopup
          cars={cars}
          setCars={setCars}
        />

        {/* CHARTS */}

        <Charts cars={cars} />

        {/* TABLE */}

        <CarsTable
          cars={cars}
          search={search}
          setSearch={setSearch}
          setSelectedCar={
            setSelectedCar
          }
          changeStatus={
            changeStatus
          }
          resetCar={resetCar}
          setCars={setCars}
        />
      </div>

      <PartsPopup
        selectedCar={
          selectedCar
        }
        setSelectedCar={
          setSelectedCar
        }
        cars={cars}
        setCars={setCars}
      />
    </div>
  );
}

export default App;