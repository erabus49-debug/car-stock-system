import { useEffect, useState } from "react";
import "./App.css";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

function App() {
  const [cars, setCars] = useState([]);
  const [vin, setVin] = useState("");
  const [model, setModel] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cars"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCars(data);
    });

    return () => unsub();
  }, []);

  const addCar = async () => {
    if (!vin || !model) return;

    await addDoc(collection(db, "cars"), {
      vin,
      model,
      progress: 0,
      status: "กำลังผลิต",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    });

    setVin("");
    setModel("");
  };

  const deleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
  };

  const increaseProgress = async (car) => {
    if (car.progress >= 100) return;

    await updateDoc(doc(db, "cars", car.id), {
      progress: car.progress + 10,
    });
  };

  const filteredCars = cars.filter(
    (car) =>
      car.vin.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <div className="topbar">
        <h1>🚗 CAR STOCK SYSTEM</h1>

        <input
          className="search"
          placeholder="ค้นหา VIN / รุ่นรถ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="add-box">
        <input
          placeholder="VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />

        <input
          placeholder="รุ่นรถ"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <button onClick={addCar}>เพิ่มรถ</button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{cars.length}</h3>
          <p>รถทั้งหมด</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              cars.filter((car) => car.progress >= 100)
                .length
            }
          </h3>
          <p>เสร็จแล้ว</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              cars.filter((car) => car.progress < 100)
                .length
            }
          </h3>
          <p>กำลังผลิต</p>
        </div>
      </div>

      <div className="car-list">
        {filteredCars.map((car) => (
          <div className="car-card" key={car.id}>
            <img src={car.image} alt="car" />

            <div className="status">
              {car.progress >= 100
                ? "เสร็จแล้ว"
                : "กำลังผลิต"}
            </div>

            <h2>{car.model}</h2>

            <p>VIN: {car.vin}</p>

            <p>Progress: {car.progress}%</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${car.progress}%` }}
              ></div>
            </div>

            <div className="card-buttons">
              <button
                className="progress-btn"
                onClick={() => increaseProgress(car)}
              >
                + เพิ่ม Progress
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteCar(car.id)}
              >
                ลบรถ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;