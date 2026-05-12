import {
  useState,
} from "react";

function CarsTable({
  cars,
  search,
  setSearch,
  setSelectedCar,
  changeStatus,
  resetCar,
  setCars,
}) {
  const [
    editingIndex,
    setEditingIndex,
  ] = useState(null);

  const [
    editVin,
    setEditVin,
  ] = useState("");

  const [
    editModel,
    setEditModel,
  ] = useState("");

  const getStatusColor = (
    status
  ) => {
    if (status === "เสร็จแล้ว")
      return "#22c55e";

    if (status === "กำลังทำ")
      return "#facc15";

    return "#ef4444";
  };

  const startEdit = (
    car,
    index
  ) => {
    setEditingIndex(index);

    setEditVin(car.vin);

    setEditModel(car.model);

    resetCar(index);
  };

  const saveEdit = () => {
    const updatedCars = [
      ...cars,
    ];

    updatedCars[
      editingIndex
    ].vin = editVin;

    updatedCars[
      editingIndex
    ].model = editModel;

    setCars(updatedCars);

    setEditingIndex(null);
  };

  return (
    <div className="table-box">
      {/* TOP */}

      <div className="table-top">
        <h2>🚗 รถล่าสุด</h2>

        <input
          className="search"
          placeholder="ค้นหา VIN..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* TABLE */}

      <table>
        <thead>
          <tr>
            <th>VIN</th>

            <th>รุ่นรถ</th>

            <th>PDI</th>

            <th>แต่งรถ</th>

            <th>ส่งมอบ</th>

            <th>
              Progress
            </th>

            <th>
              Action
            </th>

            <th>ของแต่ง</th>
          </tr>
        </thead>

        <tbody>
          {cars
            .filter((car) =>
              car.vin
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map(
              (
                car,
                index
              ) => (
                <tr
                  key={index}
                >
                  {/* VIN */}

                  <td>
                    {editingIndex ===
                    index ? (
                      <input
                        className="edit-input"
                        value={
                          editVin
                        }
                        onChange={(
                          e
                        ) =>
                          setEditVin(
                            e
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      car.vin
                    )}
                  </td>

                  {/* MODEL */}

                  <td>
                    {editingIndex ===
                    index ? (
                      <input
                        className="edit-input"
                        value={
                          editModel
                        }
                        onChange={(
                          e
                        ) =>
                          setEditModel(
                            e
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      car.model
                    )}
                  </td>

                  {/* PDI */}

                  <td>
                    <button
                      className="status-btn"
                      style={{
                        background:
                          getStatusColor(
                            car.pdi
                          ),
                      }}
                      onClick={() =>
                        changeStatus(
                          index,
                          "pdi"
                        )
                      }
                    >
                      {
                        car.pdi
                      }
                    </button>
                  </td>

                  {/* CUSTOM */}

                  <td>
                    <button
                      className="status-btn"
                      style={{
                        background:
                          getStatusColor(
                            car.custom
                          ),
                      }}
                    >
                      {
                        car.custom
                      }
                    </button>
                  </td>

                  {/* DELIVERY */}

                  <td>
                    <button
                      className="status-btn"
                      style={{
                        background:
                          getStatusColor(
                            car.delivery
                          ),
                      }}
                      onClick={() =>
                        changeStatus(
                          index,
                          "delivery"
                        )
                      }
                    >
                      {
                        car.delivery
                      }
                    </button>
                  </td>

                  {/* PROGRESS */}

                  <td>
                    {car.progress}
                    %
                  </td>

                  {/* ACTION */}

                  <td>
                    {editingIndex ===
                    index ? (
                      <button
                        className="save-btn"
                        onClick={
                          saveEdit
                        }
                      >
                        บันทึก
                      </button>
                    ) : (
                      <button
                        className="reset-btn"
                        onClick={() =>
                          startEdit(
                            car,
                            index
                          )
                        }
                      >
                        แก้ไข
                      </button>
                    )}
                  </td>

                  {/* PARTS */}

                  <td>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default CarsTable;