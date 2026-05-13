import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  LayoutDashboard,
  Car,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";

import { db } from "./firebase";

function App() {
  const [cars, setCars] = useState([]);
  const [vin, setVin] = useState("");
  const [model, setModel] = useState("");
  const [menu, setMenu] = useState("dashboard");

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
      pdi: "รอทำ",
      delivery: "รอทำ",
      parts: [],
      progress: 0,
    });

    setVin("");
    setModel("");
  };

  const deleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
  };

  const toggleStatus = async (car, field) => {
    const current = car[field];

    if (current === "รอทำ") {
      await updateDoc(doc(db, "cars", car.id), {
        [field]: "กำลังทำ",
      });
    } else if (current === "กำลังทำ") {
      await updateDoc(doc(db, "cars", car.id), {
        [field]: "เสร็จแล้ว",
      });
    }
  };

  const addPart = async (car, partName) => {
    if (!partName) return;

    const updatedParts = [
      ...(car.parts || []),
      {
        name: partName,
        done: false,
      },
    ];

    const doneCount = updatedParts.filter((p) => p.done).length;

    let progress = 0;

    if (updatedParts.length > 0) {
      progress = Math.round(
        (doneCount / updatedParts.length) * 100
      );
    }

    await updateDoc(doc(db, "cars", car.id), {
      parts: updatedParts,
      progress,
    });
  };

  const togglePart = async (car, index) => {
    const updatedParts = [...car.parts];

    updatedParts[index].done =
      !updatedParts[index].done;

    const doneCount = updatedParts.filter(
      (p) => p.done
    ).length;

    const progress = Math.round(
      (doneCount / updatedParts.length) * 100
    );

    await updateDoc(doc(db, "cars", car.id), {
      parts: updatedParts,
      progress,
    });
  };

  const deletePart = async (car, index) => {
    const updatedParts = [...car.parts];

    updatedParts.splice(index, 1);

    const doneCount = updatedParts.filter(
      (p) => p.done
    ).length;

    let progress = 0;

    if (updatedParts.length > 0) {
      progress = Math.round(
        (doneCount / updatedParts.length) * 100
      );
    }

    await updateDoc(doc(db, "cars", car.id), {
      parts: updatedParts,
      progress,
    });
  };

  const completed = cars.filter(
    (c) => c.progress >= 100
  ).length;

  const waiting = cars.filter(
    (c) => c.progress === 0
  ).length;

  const working = cars.filter(
    (c) =>
      c.progress > 0 &&
      c.progress < 100
  ).length;

  const overallProgress =
    cars.length > 0
      ? Math.round(
          cars.reduce(
            (sum, car) => sum + car.progress,
            0
          ) / cars.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#020817] text-white md:flex overflow-x-hidden">
      {/* SIDEBAR */}

      <aside className="w-full md:w-[260px] bg-[#071225] border-r border-[#1e293b] p-6">
        <div className="flex items-center gap-3 mb-10">
          <Car size={34} className="text-blue-500" />

          <div>
            <h1 className="font-bold text-xl">
              Car Custom
            </h1>

            <p className="text-gray-400 text-sm">
              Management
            </p>
          </div>
        </div>

        <button
          onClick={() => setMenu("dashboard")}
          className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl mb-3 transition ${
            menu === "dashboard"
              ? "bg-blue-600"
              : "bg-[#0b1730]"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          onClick={() => setMenu("cars")}
          className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
            menu === "cars"
              ? "bg-blue-600"
              : "bg-[#0b1730]"
          }`}
        >
          <Car size={20} />
          รถทั้งหมด
        </button>
      </aside>

      {/* MAIN */}

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* DASHBOARD */}

        {menu === "dashboard" && (
          <>
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              <div className="bg-[#071225] border border-[#1e293b] rounded-[32px] flex flex-col items-center justify-center py-8 md:py-10">
                <h1 className="text-[72px] md:text-6xl font-black text-blue-400 leading-none">
                  {cars.length}
                </h1>

                <p className="text-center text-gray-400 text-[14px] md:text-base mt-4 leading-8">
                  จำนวนรถทั้งหมด
                </p>
              </div>

              <div className="bg-[#071225] border border-[#1e293b] rounded-[32px] flex flex-col items-center justify-center py-8 md:py-10">
                <h1 className="text-[72px] md:text-6xl font-black text-green-400 leading-none">
                  {completed}
                </h1>

                <p className="text-center text-gray-400 text-[14px] md:text-base mt-4 leading-8">
                  เสร็จแล้ว
                </p>
              </div>

              <div className="bg-[#071225] border border-[#1e293b] rounded-[32px] flex flex-col items-center justify-center py-8 md:py-10">
                <h1 className="text-[72px] md:text-6xl font-black text-yellow-400 leading-none">
                  {working}
                </h1>

                <p className="text-center text-gray-400 text-[14px] md:text-base mt-4 leading-8">
                  กำลังทำ
                </p>
              </div>

              <div className="bg-[#071225] border border-[#1e293b] rounded-[32px] flex flex-col items-center justify-center py-8 md:py-10">
                <h1 className="text-[72px] md:text-6xl font-black text-red-400 leading-none">
                  {waiting}
                </h1>

                <p className="text-center text-gray-400 text-[14px] md:text-base mt-4 leading-8">
                  รอทำ
                </p>
              </div>
            </div>

            <div className="bg-[#071225] border border-[#1e293b] rounded-[36px] p-8 mt-8">
              <h1 className="text-[92px] md:text-7xl font-black text-cyan-400 leading-none">
                {overallProgress}%
              </h1>

              <p className="text-gray-400 text-xl mt-4">
                งานรวมทั้งหมด
              </p>
            </div>
          </>
        )}

        {/* CARS */}

        {menu === "cars" && (
          <div className="overflow-x-auto w-full">
            <div className="bg-[#071225] border border-[#1e293b] rounded-3xl p-6 mt-6 min-w-[1200px]">
              <div className="flex gap-4 mb-6">
                <input
                  placeholder="VIN"
                  value={vin}
                  onChange={(e) =>
                    setVin(e.target.value)
                  }
                  className="bg-[#0b1730] border border-[#1e293b] rounded-xl px-4 py-3 outline-none"
                />

                <input
                  placeholder="รุ่นรถ"
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value)
                  }
                  className="bg-[#0b1730] border border-[#1e293b] rounded-xl px-4 py-3 outline-none"
                />

                <button
                  onClick={addCar}
                  className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl flex items-center gap-2"
                >
                  <Plus size={18} />
                  เพิ่มรถ
                </button>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-[#1e293b]">
                    <th className="text-left py-4">
                      VIN
                    </th>

                    <th className="text-left">
                      รุ่นรถ
                    </th>

                    <th className="text-left">
                      PDI
                    </th>

                    <th className="text-left">
                      ส่งมอบ
                    </th>

                    <th className="text-left">
                      ความคืบหน้า
                    </th>

                    <th className="text-left">
                      ของแต่ง
                    </th>

                    <th className="text-left">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cars.map((car) => (
                    <tr
                      key={car.id}
                      className="border-b border-[#1e293b]"
                    >
                      <td className="py-5 font-bold">
                        {car.vin}
                      </td>

                      <td>{car.model}</td>

                      <td>
                        <button
                          onClick={() =>
                            toggleStatus(
                              car,
                              "pdi"
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-sm ${
                            car.pdi ===
                            "เสร็จแล้ว"
                              ? "bg-green-900 text-green-400"
                              : car.pdi ===
                                "กำลังทำ"
                              ? "bg-yellow-900 text-yellow-400"
                              : "bg-red-900 text-red-400"
                          }`}
                        >
                          {car.pdi}
                        </button>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            toggleStatus(
                              car,
                              "delivery"
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-sm ${
                            car.delivery ===
                            "เสร็จแล้ว"
                              ? "bg-green-900 text-green-400"
                              : car.delivery ===
                                "กำลังทำ"
                              ? "bg-yellow-900 text-yellow-400"
                              : "bg-red-900 text-red-400"
                          }`}
                        >
                          {car.delivery}
                        </button>
                      </td>

                      <td className="w-[250px]">
                        <div className="flex items-center gap-3">
                          <div className="w-full h-3 bg-[#1e293b] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${car.progress}%`,
                              }}
                            ></div>
                          </div>

                          <span>
                            {car.progress}%
                          </span>
                        </div>
                      </td>

                      <td className="w-[320px]">
                        <div className="space-y-2">
                          {car.parts?.map(
                            (part, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-[#0b1730] rounded-xl px-3 py-2"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      part.done
                                    }
                                    onChange={() =>
                                      togglePart(
                                        car,
                                        index
                                      )
                                    }
                                  />

                                  <span>
                                    {part.name}
                                  </span>
                                </div>

                                <button
                                  onClick={() =>
                                    deletePart(
                                      car,
                                      index
                                    )
                                  }
                                  className="bg-red-600 p-2 rounded-lg"
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>
                              </div>
                            )
                          )}

                          <button
                            onClick={() => {
                              const partName =
                                prompt(
                                  "ชื่อของแต่ง"
                                );

                              addPart(
                                car,
                                partName
                              );
                            }}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm"
                          >
                            + เพิ่มของแต่ง
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            deleteCar(car.id)
                          }
                          className="bg-red-600 hover:bg-red-700 p-3 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;