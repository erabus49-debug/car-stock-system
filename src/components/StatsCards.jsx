function StatsCards({
  cars,
}) {
  const doneCars =
    cars.filter(
      (car) =>
        car.progress === 100
    ).length;

  const workingCars =
    cars.filter(
      (car) =>
        car.progress > 0 &&
        car.progress < 100
    ).length;

  const waitingCars =
    cars.filter(
      (car) =>
        car.progress === 0
    ).length;

  return (
    <div className="stats-grid">
      {/* TOTAL */}

      <div className="stats-card">
        <div className="icon blue">
          🚗
        </div>

        <div>
          <h1>{cars.length}</h1>

          <p>
            จำนวนรถทั้งหมด
          </p>
        </div>
      </div>

      {/* DONE */}

      <div className="stats-card">
        <div className="icon green">
          ✅
        </div>

        <div>
          <h1>{doneCars}</h1>

          <p>
            งานเสร็จแล้ว
          </p>
        </div>
      </div>

      {/* WORKING */}

      <div className="stats-card">
        <div className="icon yellow">
          ⏰
        </div>

        <div>
          <h1>
            {workingCars}
          </h1>

          <p>กำลังทำ</p>
        </div>
      </div>

      {/* WAIT */}

      <div className="stats-card">
        <div className="icon red">
          ⌛
        </div>

        <div>
          <h1>
            {waitingCars}
          </h1>

          <p>รอทำ</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;