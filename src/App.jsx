import { useEffect, useState } from "react";
import "./App.css";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

function App() {
  const [cars, setCars] = useState([]);
  const [vin, setVin] = useState("");
  const [model, setModel] = useState("");

  // realtime
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

  // เพิ่มรถ
  const addCar = async () => {
    if (!vin || !model) return;

    await addDoc(collection(db, "cars"), {
      vin,
      model,
      progress: 0,
    });

    setVin("");
    setModel("");
  };

  // ลบรถ
  const deleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
  };

  return (
    <div className="app">
      <h1>🚗 CAR STOCK SYSTEM</h1>

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

      <div className="car-list">
        {cars.map((car) => (
          <div className="car-card" key={car.id}>
            <h2>{car.model}</h2>

            <p>VIN: {car.vin}</p>

            <p>Progress: {car.progress}%</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${car.progress}%` }}
              ></div>
            </div>

            <button onClick={() => deleteCar(car.id)}>
              ลบรถ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;