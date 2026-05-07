import {
  useState,
} from "react";

function AddCarPopup({
  cars,
  setCars,
}) {
  const [showPopup, setShowPopup] =
    useState(false);

  const [vin, setVin] =
    useState("");

  const [model, setModel] =
    useState("");

  const addCar = () => {
    if (!vin || !model)
      return;

    const updatedCars = [
      ...cars,
    ];

    updatedCars.push({
      vin,
      model,

      pdi: "รอทำ",
      custom: "รอทำ",
      delivery: "รอทำ",

      progress: 0,
    });

    setCars(updatedCars);

    setVin("");
    setModel("");

    setShowPopup(false);
  };

  return (
    <>
      {/* BUTTON */}

      <button
        className="add-btn"
        onClick={() =>
          setShowPopup(true)
        }
      >
        + เพิ่มรถ
      </button>

      {/* POPUP */}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>
              🚗 เพิ่มรถ
            </h2>

            <input
              type="text"
              placeholder="VIN"
              className="popup-input"
              value={vin}
              onChange={(e) =>
                setVin(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="รุ่นรถ"
              className="popup-input"
              value={model}
              onChange={(e) =>
                setModel(
                  e.target.value
                )
              }
            />

            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() =>
                  setShowPopup(
                    false
                  )
                }
              >
                ยกเลิก
              </button>

              <button
                className="save-btn"
                onClick={addCar}
              >
                เพิ่มรถ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddCarPopup;