import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

interface Driver {
  driver_id: number;
  name: string;
}

interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: string;
  duration: number;
  driver: Driver;
  value: string;
}

interface RecordsData {
  customer_id: string;
  rides: Ride[];
}

const Records = () => {
  const location = useLocation();
  const recordsData = location.state?.records as RecordsData;
  const userName = location.state?.userName || "Unknown User";

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [filteredRides, setFilteredRides] = useState<Ride[]>(
    recordsData?.rides || []
  );

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get("/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleDriverChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const driverId = Number(event.target.value);
    setSelectedDriver(driverId);

    try {
      const customerId = recordsData?.customer_id;

      const response = await api.get(`/ride/${customerId}`, {
        params: { driver_id: driverId },
      });

      if (response.status === 404) {
        toast.error("Não há rotas com este motorista", {
          position: "top-center",
          autoClose: 3000,
        });
        setFilteredRides([]);
        return;
      }

      if (response.data) {
        setFilteredRides(response.data.rides);
      }
    } catch (error: any) {
      console.error("Error fetching rides:", error);
      if (error.response?.status === 404) {
        toast.error("Não há rotas com este motorista", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Erro ao carregar as corridas", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  if (!recordsData) {
    return <div>Error: No records data available.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="records-container">
        <h1>Histórico de corridas</h1>

        <div className="driver-select-container">
          <label htmlFor="driver-select">Filtrar corrida por motorista: </label>
          <select
            id="driver-select"
            onChange={handleDriverChange}
            value={selectedDriver ?? ""}
          >
            <option value="" disabled>
              Selecione um motorista
            </option>
            {drivers.map((driver) => (
              <option key={driver.driver_id} value={driver.driver_id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {filteredRides.length > 0 ? (
          <div className="table-container">
            <h2>Cliente: {userName}</h2>
            <table>
              <thead>
                <tr>
                  <th>ID Corrida</th>
                  <th>Data / Hora</th>
                  <th>Origem</th>
                  <th>Destino</th>
                  <th>Distância (km)</th>
                  <th>Duração (minutos)</th>
                  <th>Motorista</th>
                  <th>Valor ($)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((ride, index) => (
                  <tr key={ride.id}>
                    <td>{ride.id}</td>
                    <td>
                      {new Date(ride.date).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{ride.origin}</td>
                    <td>{ride.destination}</td>
                    <td>{ride.distance}</td>
                    <td>{ride.duration}</td>
                    <td>{ride.driver.name}</td>
                    <td>{ride.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No records found</p>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default Records;
