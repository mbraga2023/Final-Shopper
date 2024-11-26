import React, { useState } from "react";
import "../App.css";

interface Driver {
  driver_id: number;
  name: string;
  description: string;
  car: string;
  rating: string;
  rate: number;
  minKm: number;
}

interface DriversListProps {
  drivers: Driver[];
  distance: string;
  onConfirmDriver: (driver_id: number, name: string, totalCost: number) => void;
}

const DriversList: React.FC<DriversListProps> = ({
  drivers,
  distance,
  onConfirmDriver,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [expandedDriverId, setExpandedDriverId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverToConfirm, setDriverToConfirm] = useState<Driver | null>(null);
  const distanceInKm = parseFloat(distance);

  const handleCardClick = (driverId: number) => {
    if (expandedDriverId === driverId) {
      setExpandedDriverId(null);
      setSelectedDriverId(null);
    } else {
      setExpandedDriverId(driverId);
      setSelectedDriverId(driverId);
    }
  };

  const calculateTotal = (rate: number, distance: string): number => {
    const distanceInKm = parseFloat(distance);
    return isNaN(distanceInKm) ? 0 : rate * distanceInKm;
  };

  const openModal = (driver: Driver) => {
    setDriverToConfirm(driver);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDriverToConfirm(null);
  };

  const confirmDriver = () => {
    if (driverToConfirm) {
      const totalCost = calculateTotal(driverToConfirm.rate, distance);
      onConfirmDriver(
        driverToConfirm.driver_id,
        driverToConfirm.name,
        totalCost
      );
      closeModal();
    }
  };

  return (
    <div style={{ marginBottom: "15px", width: "100%" }}>
      <h4>Clique para escolher seu motorista</h4>
      {drivers.length === 0 ? (
        <p>Sem motoristas disponíveis</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {drivers.map((driver) => {
            if (distanceInKm < driver.minKm) {
              return null;
            }

            const totalCost = calculateTotal(driver.rate, distance);

            return (
              <div
                key={driver.driver_id}
                onClick={() => handleCardClick(driver.driver_id)}
                style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "10px",
                  border:
                    selectedDriverId === driver.driver_id
                      ? "2px solid #4CAF50"
                      : "2px solid #ddd",
                  cursor: "pointer",
                  transition: "border-color 0.3s ease, transform 0.2s",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h3 style={{ margin: "0", color: "#333", flex: 1 }}>
                    {driver.name}
                  </h3>
                  <div
                    style={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "16px",
                      backgroundColor: "lightgreen",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    ${totalCost.toFixed(2)}
                  </div>
                </div>

                {expandedDriverId === driver.driver_id && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      color: "#555",
                      paddingTop: "10px",
                    }}
                  >
                    <div style={{ margin: "0" }}>
                      <strong>Carro:</strong> {driver.car}
                    </div>
                    <div style={{ margin: "0" }}>
                      <strong>Descrição:</strong> {driver.description}
                    </div>
                    <div style={{ margin: "0" }}>
                      <strong>Avaliação:</strong> {driver.rating}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(driver);
                        }}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        className="confirm-button"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && driverToConfirm && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p>
              Confirmar viagem com <strong>{driverToConfirm.name}?</strong>
            </p>
            <p>
              Valor Total: $
              <strong>
                {calculateTotal(driverToConfirm.rate, distance).toFixed(2)}
              </strong>
            </p>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDriver}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversList;
