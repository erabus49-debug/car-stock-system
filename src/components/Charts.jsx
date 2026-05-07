function Charts({ cars }) {
  const totalCars =
    cars.length || 1;

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
    <div className="charts-grid">
      {/* DONUT */}

      <div className="chart-card">
        <h2>📊 สถานะรถ</h2>

        <div
          className="donut-chart"
          style={{
            background: `conic-gradient(
              #22c55e 0% ${
                (doneCars /
                  totalCars) *
                100
              }%,

              #facc15 ${
                (doneCars /
                  totalCars) *
                100
              }% ${
                ((doneCars +
                  workingCars) /
                  totalCars) *
                100
              }%,

              #ef4444 ${
                ((doneCars +
                  workingCars) /
                  totalCars) *
                100
              }% 100%
            )`,
          }}
        >
          <div className="donut-inner">
            <h1>
              {Math.floor(
                (doneCars /
                  totalCars) *
                  100
              )}
              %
            </h1>

            <p>งานเสร็จ</p>
          </div>
        </div>

        <div className="chart-info">
          <p>
            🟢 เสร็จแล้ว (
            {doneCars})
          </p>

          <p>
            🟡 กำลังทำ (
            {workingCars})
          </p>

          <p>
            🔴 รอทำ (
            {waitingCars})
          </p>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="chart-card">
        <h2>
          📈 Progress รวม
        </h2>

        <div className="bar-list">
          {cars.map(
            (
              car,
              index
            ) => (
              <div
                key={index}
                className="bar-item"
              >
                <div className="bar-top">
                  <span>
                    {car.vin} -{" "}
                    {
                      car.model
                    }
                  </span>

                  <span>
                    {
                      car.progress
                    }
                    %
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${car.progress}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;