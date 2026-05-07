import {
  useState,
} from "react";

function PartsPopup({
  selectedCar,
  setSelectedCar,
  cars,
  setCars,
}) {
  const [newPart, setNewPart] =
    useState("");

  if (
    selectedCar === null
  )
    return null;

  const addPart = () => {
    if (!newPart) return;

    const updatedCars = [
      ...cars,
    ];

    if (
      !updatedCars[
        selectedCar
      ].parts
    ) {
      updatedCars[
        selectedCar
      ].parts = [];
    }

    updatedCars[
      selectedCar
    ].parts.push({
      name: newPart,
      done: false,
    });

    updatedCars[
      selectedCar
    ].custom = "กำลังทำ";

    setCars(updatedCars);

    setNewPart("");
  };

  const togglePart = (
    partIndex
  ) => {
    const updatedCars = [
      ...cars,
    ];

    updatedCars[
      selectedCar
    ].parts[
      partIndex
    ].done =
      !updatedCars[
        selectedCar
      ].parts[
        partIndex
      ].done;

    const allDone =
      updatedCars[
        selectedCar
      ].parts.every(
        (part) =>
          part.done
      );

    updatedCars[
      selectedCar
    ].custom = allDone
      ? "เสร็จแล้ว"
      : "กำลังทำ";

    setCars(updatedCars);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>
          🔧 ของแต่งรถ
        </h2>

        <div className="parts-list">
          {cars[
            selectedCar
          ].parts?.map(
            (
              part,
              index
            ) => (
              <div
                key={index}
                className="part-card"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={
                      part.done
                    }
                    onChange={() =>
                      togglePart(
                        index
                      )
                    }
                  />

                  <span>
                    {
                      part.name
                    }
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <input
          type="text"
          placeholder="เพิ่มของแต่ง..."
          className="popup-input"
          value={newPart}
          onChange={(e) =>
            setNewPart(
              e.target.value
            )
          }
        />

        <div className="popup-actions">
          <button
            className="cancel-btn"
            onClick={() =>
              setSelectedCar(
                null
              )
            }
          >
            ปิด
          </button>

          <button
            className="save-btn"
            onClick={addPart}
          >
            เพิ่มของแต่ง
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartsPopup;