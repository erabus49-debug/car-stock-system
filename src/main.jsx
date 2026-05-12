import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);{/* BOTTOM GRID */}

<div className="grid grid-cols-[1fr_340px] gap-6 mt-6">

  {/* CHART */}

  <div className="bg-[#0d1523]/90 border border-white/[0.04] rounded-[30px] p-7">

    <div className="flex items-center justify-between mb-10">

      <div>

        <h2 className="text-[24px] font-bold mb-2">
          สถิติการผลิต
        </h2>

        <p className="text-slate-500 text-sm">
          อัปเดตแบบ realtime
        </p>

      </div>

      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
        Analytics
      </span>

    </div>

    <div className="flex items-end justify-between h-[260px] gap-4">

      {[40, 80, 55, 95, 70, 100, 65].map(
        (value, index) => (

          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-3"
          >

            <div className="w-full bg-slate-800 rounded-full flex items-end overflow-hidden h-[220px]">

              <div
                className="w-full rounded-full bg-gradient-to-t from-blue-600 to-cyan-400"
                style={{
                  height: `${value}%`,
                }}
              ></div>

            </div>

            <span className="text-slate-500 text-sm">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]}
            </span>

          </div>

        )
      )}

    </div>

  </div>

  {/* ACTIVITY */}

  <div className="bg-[#0d1523]/90 border border-white/[0.04] rounded-[30px] p-7">

    <div className="flex items-center justify-between mb-10">

      <div>

        <h2 className="text-[24px] font-bold mb-2">
          Activity
        </h2>

        <p className="text-slate-500 text-sm">
          กิจกรรมล่าสุด
        </p>

      </div>

      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

    </div>

    <div className="space-y-6">

      <div className="flex gap-4">

        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          🚗
        </div>

        <div>

          <h3 className="font-semibold mb-1">
            เพิ่มรถใหม่เข้าสู่ระบบ
          </h3>

          <p className="text-slate-500 text-sm">
            Nissan GTR R35
          </p>

        </div>

      </div>

      <div className="flex gap-4">

        <div className="w-11 h-11 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center">
          ✔
        </div>

        <div>

          <h3 className="font-semibold mb-1">
            งานเสร็จสมบูรณ์
          </h3>

          <p className="text-slate-500 text-sm">
            Toyota Supra MK4
          </p>

        </div>

      </div>

      <div className="flex gap-4">

        <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
          ⏳
        </div>

        <div>

          <h3 className="font-semibold mb-1">
            กำลังดำเนินการผลิต
          </h3>

          <p className="text-slate-500 text-sm">
            Mazda RX7 FD
          </p>

        </div>

      </div>

      <div className="flex gap-4">

        <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
          ⚠
        </div>

        <div>

          <h3 className="font-semibold mb-1">
            รอตรวจสอบคุณภาพ
          </h3>

          <p className="text-slate-500 text-sm">
            Honda NSX
          </p>

        </div>

      </div>

    </div>

  </div>

</div>
