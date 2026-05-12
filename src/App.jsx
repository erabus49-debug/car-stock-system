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
  Trash2,
  Plus,
} from "lucide-react";

import { db } from "./firebase";

function App() {

  const [menu, setMenu] =
    useState("dashboard");

  const [cars, setCars] =
    useState([]);

  const [vin, setVin] =
    useState("");

  const [model, setModel] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);
  
  const [filterStatus, setFilterStatus] =
  useState("ทั้งหมด");

  const [selectedCar, setSelectedCar] =
    useState(null);

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "cars"),
      (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCars(data);

      }
    );

    return () => unsub();

  }, []);

  const addCar = async () => {

    if (!vin || !model) return;

    await addDoc(
      collection(db, "cars"),
      {
        vin,
        model,

        pdi: "รอทำ",
        custom: "รอทำ",
        delivery: "รอทำ",

        mods: [],
      }
    );

    setVin("");
    setModel("");

  };

  const deleteCar = async (
    id
  ) => {

    await deleteDoc(
      doc(db, "cars", id)
    );

  };

  const nextStatus = (
    current
  ) => {

    if (current === "รอทำ") {
      return "กำลังทำ";
    }

    if (
      current === "กำลังทำ"
    ) {
      return "เสร็จแล้ว";
    }

    return "เสร็จแล้ว";

  };

const changeStatus = async (
  id,
  field,
  current
) => {

  let next = "กำลังทำ";

  if (current === "กำลังทำ") {
    next = "เสร็จแล้ว";
  }

  else if (
    current === "เสร็จแล้ว"
  ) {

    if (
      editingId === id
    ) {

      next = "รอทำ";

    }

    else {

      return;

    }

  }

  await updateDoc(
    doc(db, "cars", id),
    {
      [field]: next,
    }
  );

};

  const addMod = async (
    car
  ) => {

    const mod =
      prompt(
        "เพิ่มของแต่ง"
      );

    if (!mod) return;

    await updateDoc(
      doc(db, "cars", car.id),
      {
        mods: [
          ...(car.mods || []),

          {
            name: mod,
            done: false,
          },
        ],
      }
    );

  };

  const toggleMod = async (
    car,
    index
  ) => {

    const updatedMods =
      [...car.mods];

    updatedMods[index].done =
      !updatedMods[index].done;

    const doneCount =
      updatedMods.filter(
        (m) => m.done
      ).length;

    let customStatus =
      "รอทำ";

    if (
      doneCount > 0 &&
      doneCount <
        updatedMods.length
    ) {

      customStatus =
        "กำลังทำ";

    }

    if (
      doneCount ===
        updatedMods.length &&
      updatedMods.length > 0
    ) {

      customStatus =
        "เสร็จแล้ว";

    }

    await updateDoc(
      doc(db, "cars", car.id),
      {
        mods: updatedMods,
        custom: customStatus,
      }
    );

  };

const deleteMod = async (
  car,
  index
) => {

  const updatedMods =
    car.mods.filter(
      (_, i) =>
        i !== index
    );

  const doneCount =
    updatedMods.filter(
      (m) => m.done
    ).length;

  let customStatus =
    "รอทำ";

  if (
    doneCount > 0 &&
    doneCount <
      updatedMods.length
  ) {

    customStatus =
      "กำลังทำ";

  }

  if (
    doneCount ===
      updatedMods.length &&
    updatedMods.length > 0
  ) {

    customStatus =
      "เสร็จแล้ว";

  }

  await updateDoc(
    doc(db, "cars", car.id),
    {
      mods: updatedMods,
      custom: customStatus,
    }
  );

  /* REFRESH POPUP */

  setSelectedCar({
    ...car,
    mods: updatedMods,
    custom: customStatus,
  });

};

  const getStatusColor = (
    status
  ) => {

    if (
      status === "เสร็จแล้ว"
    ) {
      return "bg-green-600";
    }

    if (
      status === "กำลังทำ"
    ) {
      return "bg-yellow-500 text-black";
    }

    return "bg-red-600";

  };

  const filteredCars =
  cars.filter((car) => {

    if (
      filterStatus === "ทั้งหมด"
    ) {
      return true;
    }

    if (
      filterStatus === "รอทำ"
    ) {

      return (
        car.pdi === "รอทำ" ||
        car.custom === "รอทำ" ||
        car.delivery === "รอทำ"
      );

    }

    if (
      filterStatus === "กำลังทำ"
    ) {

      return (
        car.pdi === "กำลังทำ" ||
        car.custom === "กำลังทำ" ||
        car.delivery === "กำลังทำ"
      );

    }

    if (
      filterStatus === "เสร็จแล้ว"
    ) {

      return (
        car.pdi === "เสร็จแล้ว" &&
        car.custom === "เสร็จแล้ว" &&
        car.delivery === "เสร็จแล้ว"
      );

    }

  });
  
  const getProgress = (
    car
  ) => {

    let score = 0;

    if (
      car.pdi === "เสร็จแล้ว"
    ) {
      score += 34;
    }

    if (
      car.custom === "เสร็จแล้ว"
    ) {
      score += 33;
    }

    if (
      car.delivery ===
      "เสร็จแล้ว"
    ) {
      score += 33;
    }

    return score;

  };

  const overallProgress = cars.length
  ? Math.round(

      cars.reduce(
        (total, car) =>
          total +
          getProgress(car),
        0
      ) / cars.length

    )
  : 0;

  const pendingCars =
  cars.filter(
    (car) =>

      car.pdi !== "เสร็จแล้ว" ||

      car.custom !== "เสร็จแล้ว" ||

      car.delivery !== "เสร็จแล้ว"
  );

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-[#020817] text-white">

      {/* SIDEBAR */}

      <aside className="w-full md:w-[260px] bg-[#071225] border-b md:border-b-0 md:border-r border-[#1e293b] p-4 md:p-6 flex md:block gap-3 overflow-x-auto">

        <h1 className="text-3xl font-black mb-10">
          🚘 Car Custom
        </h1>

        <button
          onClick={() =>
            setMenu("dashboard")
          }
          className={`min-w-[180px] md:w-full flex items-center
            menu === "dashboard"
              ? "bg-blue-600"
              : "bg-[#0f172a]"
          }`}
        >

          <LayoutDashboard size={20} />

          Dashboard

        </button>

        <button
          onClick={() =>
            setMenu("cars")
          }
          className={`min-w-[180px] md:w-full flex items-center
            menu === "cars"
              ? "bg-blue-600"
              : "bg-[#0f172a]"
          }`}
        >

          <Car size={20} />

          รถทั้งหมด

        </button>

      </aside>

      {/* MAIN */}

      <main className="flex-1 p-4 md:p-8 overflow-auto">

        {/* DASHBOARD */}

        {menu === "dashboard" && (

          <>

            <div className="grid grid-cols-5 gap-6 mb-8">

              <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">
                <h1 className="text-6xl font-black text-blue-400">
                  {cars.length}
                </h1>

                <p className="text-gray-400 mt-3">
                  จำนวนรถทั้งหมด
                </p>
              </div>

              <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">
                <h1 className="text-6xl font-black text-green-400">
                  {
                    cars.filter(
                      (c) =>
                        getProgress(c) === 100
                    ).length
                  }
                </h1>

                <p className="text-gray-400 mt-3">
                  เสร็จแล้ว
                </p>
              </div>

              <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">
                <h1 className="text-6xl font-black text-yellow-400">
                  {
                    cars.filter(
                      (c) =>
                        getProgress(c) > 0 &&
                        getProgress(c) < 100
                    ).length
                  }
                </h1>

                <p className="text-gray-400 mt-3">
                  กำลังทำ
                </p>
              </div>

              <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">
                <h1 className="text-6xl font-black text-red-400">
                  {
                    cars.filter(
                      (c) =>
                        getProgress(c) === 0
                    ).length
                  }
                </h1>

                <p className="text-gray-400 mt-3">
                  รอทำ
                </p>
              </div>

            </div>

          </>

        )}

        <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">

  <h1 className="text-6xl font-black text-cyan-400">
    {overallProgress}%
  </h1>

  <p className="text-gray-400 mt-3">
    งานรวมทั้งหมด
  </p>

</div>

        {/* ALERT */}

{pendingCars.length > 0 && (

  <div className="bg-red-600/20 border border-red-500 rounded-3xl p-6 mb-8">

    <h2 className="text-2xl font-black text-red-400 mb-5">

      🚨 แจ้งเตือนงานค้าง

    </h2>

    <div className="space-y-4">

      {pendingCars.map((car) => (

        <div
          key={car.id}
          className="bg-[#111827] border border-red-500/20 rounded-2xl px-5 py-4 flex items-center justify-between"
        >

          <div>

            <h3 className="font-bold text-lg">
              {car.model}
            </h3>

            <p className="text-slate-400">
              {car.vin}
            </p>

          </div>

          <div className="flex gap-3 flex-wrap">

            {car.pdi !== "เสร็จแล้ว" && (

              <span className="bg-red-600 px-4 py-2 rounded-xl text-sm font-bold">
                PDI ค้าง
              </span>

            )}

            {car.custom !== "เสร็จแล้ว" && (

              <span className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold">
                แต่งรถค้าง
              </span>

            )}

            {car.delivery !== "เสร็จแล้ว" && (

              <span className="bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold">
                ส่งมอบค้าง
              </span>

            )}

          </div>

        </div>

      ))}

    </div>

  </div>

)}

        {/* CARS */}

        {menu === "cars" && (

          <div className="bg-[#081426] border border-[#1e293b] rounded-3xl p-6">

            <div className="flex gap-4 mb-8">

              <input
                placeholder="VIN"
                value={vin}
                onChange={(e) =>
                  setVin(
                    e.target.value
                  )
                }
                className="bg-[#0f172a] border border-[#1e293b] rounded-2xl px-5 py-4 w-full outline-none"
              />

              <input
                placeholder="รุ่นรถ"
                value={model}
                onChange={(e) =>
                  setModel(
                    e.target.value
                  )
                }
                className="bg-[#0f172a] border border-[#1e293b] rounded-2xl px-5 py-4 w-full outline-none"
              />

              <button
                onClick={addCar}
                className="bg-blue-600 hover:bg-blue-500 px-8 rounded-2xl font-bold"
              >

                เพิ่มรถ

              </button>

            </div>

            <div className="flex gap-3 mb-6">

  {[
    "ทั้งหมด",
    "รอทำ",
    "กำลังทำ",
    "เสร็จแล้ว",
  ].map((status) => (

    <button
      key={status}
      onClick={() =>
        setFilterStatus(
          status
        )
      }
      className={`px-5 py-2 rounded-xl font-bold duration-200 ${
        filterStatus === status

          ? "bg-blue-600"

          : "bg-[#1e293b]"
      }`}
    >

      {status}

    </button>

  ))}

</div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#1e293b] text-gray-400">

                    <th className="p-4 text-left">
                      VIN
                    </th>

                    <th className="p-4 text-left">
                      รุ่นรถ
                    </th>

                    <th className="p-4 text-left">
                      PDI
                    </th>

                    <th className="p-4 text-left">
                      แต่งรถ
                    </th>

                    <th className="p-4 text-left">
                      ส่งมอบ
                    </th>

                    <th className="p-4 text-left">
                      ของแต่ง
                    </th>

                    <th className="p-4 text-left">
                      Progress
                    </th>

                    <th className="p-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCars.map((car) => (

                    <tr
                      key={car.id}
                      className="border-b border-[#1e293b]"
                    >

                      <td className="p-4 font-bold">
                        {car.vin}
                      </td>

                      <td className="p-4">
                        {car.model}
                      </td>

                      {/* PDI */}

                      <td className="p-4">

                        <button

  onClick={() =>
    changeStatus(
      car.id,
      "pdi",
      car.pdi
    )
  }

                          className={`${getStatusColor(
                            car.pdi
                          )} px-5 py-2 rounded-xl font-bold`}
                        >

                          {car.pdi}

                        </button>

                      </td>

                      {/* CUSTOM */}

                      <td className="p-4">

                        <div className={`${getStatusColor(
                          car.custom
                        )} px-5 py-2 rounded-xl font-bold inline-block`}>

                          {car.custom}

                        </div>

                      </td>

                      {/* DELIVERY */}

                      <td className="p-4">

                        <button
                          onClick={() =>
                            changeStatus(
                              car.id,
                              "delivery",
                              car.delivery
                            )
                          }
                          className={`${getStatusColor(
                            car.delivery
                          )} px-5 py-2 rounded-xl font-bold`}
                        >

                          {car.delivery}

                        </button>

                      </td>

                      {/* MODS */}

<td className="p-4">

  <button
    onClick={() =>
      setSelectedCar(car)
    }
    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl"
  >
    จัดการ
  </button>

</td>

                      {/* PROGRESS */}

                      <td className="p-4">

                        <div className="flex items-center gap-4">

                          <div className="w-[150px] h-3 bg-[#1e293b] rounded-full overflow-hidden">

                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${getProgress(
                                  car
                                )}%`,
                              }}
                            ></div>

                          </div>

                          <span>
                            {getProgress(car)}%
                          </span>

                        </div>

                      </td>

{/* VIEW MODS */}

<td className="p-4">


</td>

                      {/* ACTION */}

                      <td className="p-4">

                        <div className="flex gap-3">

                          <button
                            onClick={() => {

                              if (
                                editingId ===
                                car.id
                              ) {

                                setEditingId(
                                  null
                                );

                              }

                              else {

                                setEditingId(
                                  car.id
                                );

                              }

                            }}
                            className={`px-5 py-2 rounded-xl font-bold ${
                              editingId ===
                              car.id

                                ? "bg-green-600"

                                : "bg-blue-600"
                            }`}
                          >

                            {editingId ===
                            car.id

                              ? "กำลังแก้ไข"

                              : "แก้ไข"}

                          </button>

                          <button
                            onClick={() =>
                              deleteCar(
                                car.id
                              )
                            }
                            className="bg-red-600 hover:bg-red-500 p-3 rounded-xl"
                          >

                            <Trash2 size={18} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}
        {selectedCar && (

  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-[#081426] border border-[#1e293b] w-[700px] rounded-3xl p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-black">
            จัดการของแต่ง
          </h1>

          <p className="text-slate-400 mt-2">
            {selectedCar.model}
          </p>

        </div>

        <button
          onClick={() =>
            setSelectedCar(null)
          }
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl"
        >

          ปิด

        </button>

      </div>

      {/* ADD MOD */}

      <button
        onClick={async () => {

          const mod =
            prompt(
              "เพิ่มของแต่ง"
            );

          if (!mod) return;

          await updateDoc(
  doc(
    db,
    "cars",
    selectedCar.id
  ),
  {
    mods: [
      ...(selectedCar.mods || []),

      {
        name: mod,
        done: false,
      },
    ],
  }
);

setSelectedCar({
  ...selectedCar,

  mods: [
    ...(selectedCar.mods || []),

    {
      name: mod,
      done: false,
    },
  ],
});

        }}

        
        className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-2xl mb-6"
      >

        + เพิ่มของแต่ง

      </button>

      {/* MOD LIST */}

      <div className="space-y-4 max-h-[400px] overflow-auto">

        {(selectedCar.mods || []).map(
          (
            mod,
            index
          ) => (

            <div
              key={index}
              className="bg-[#111827] border border-[#1e293b] rounded-2xl px-5 py-4 flex items-center justify-between"
            >

              <div className="flex items-center gap-4">

                <input
                  type="checkbox"
                  checked={mod.done}
                  onChange={() =>
                    toggleMod(
                      selectedCar,
                      index
                    )
                  }
                  className="w-5 h-5"
                />

                <span className="text-lg">
                  {mod.name}
                </span>

              </div>

              <button
                onClick={() =>
                  deleteMod(
                    selectedCar,
                    index
                  )
                }
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl"
              >

                ลบ

              </button>

            </div>

          )
        )}

      </div>

    </div>

  </div>

)}
      </main>

    </div>

  );

}

export default App;