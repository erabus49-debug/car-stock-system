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

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { db } from "./firebase";

function App() {
  const [cars, setCars] = useState([]);
  const [vin, setVin] = useState("");
  const [model, setModel] = useState("");

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
      status: "รอทำ",
    });

    setVin("");
    setModel("");
  };

  const deleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
  };

  const increaseProgress = async (car) => {
    const next = Math.min(car.progress + 10, 100);

    let status = "กำลังทำ";

    if (next >= 100) {
      status = "เสร็จแล้ว";
    }

    await updateDoc(doc(db, "cars", car.id), {
      progress: next,
      status,
    });
  };

  const completed = cars.filter((c) => c.progress >= 100).length;

  const waiting = cars.filter((c) => c.progress === 0).length;

  const working = cars.filter(
    (c) => c.progress > 0 && c.progress < 100
  ).length;

  const chartData = [
    { name: "เสร็จแล้ว", value: completed },
    { name: "กำลังทำ", value: working },
    { name: "รอทำ", value: waiting },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>🚘 Car Custom</h2>

        <button className="menu active">Dashboard</button>
        <button className="menu">ข้อมูลรถ</button>
        <button className="menu">สถานะงาน</button>
      </aside>

      <main className="main">
        <div className="top-cards">
          <div className="top-card blue">
            <h1>{cars.length}</h1>
            <p>จำนวนรถทั้งหมด</p>
          </div>

          <div className="top-card green">
            <h1>{completed}</h1>
            <p>งานเสร็จแล้ว</p>
          </div>

          <div className="top-card yellow">
            <h1>{working}</h1>
            <p>กำลังทำ</p>
          </div>

          <div className="top-card red">
            <h1>{waiting}</h1>
            <p>รอทำ</p>
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-card">
            <h2>สถานะรถ</h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
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

        <div className="table-box">
          <h2>รถล่าสุด</h2>

          <table>
            <thead>
              <tr>
                <th>VIN</th>
                <th>รุ่นรถ</th>
                <th>สถานะ</th>
                <th>ความคืบหน้า</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.vin}</td>
                  <td>{car.model}</td>

                  <td>
                    <span
                      className={`status ${
                        car.progress >= 100
                          ? "done"
                          : car.progress > 0
                          ? "working"
                          : "wait"
                      }`}
                    >
                      {car.progress >= 100
                        ? "เสร็จแล้ว"
                        : car.progress > 0
                        ? "กำลังทำ"
                        : "รอทำ"}
                    </span>
                  </td>

                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${car.progress}%` }}
                      ></div>
                    </div>

                    <span>{car.progress}%</span>
                  </td>

                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => increaseProgress(car)}
                    >
                      +เพิ่ม
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteCar(car.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;