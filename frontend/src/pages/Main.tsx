import React, { useState, useEffect } from "react";
import { LoadScript, Libraries } from "@react-google-maps/api";
import MapComponent from "../components/MapsComponent";
import Navbar from "../components/Navbar";
import DriversList from "../components/DriversList";
import Users from "../components/Users";
import AddressForm from "../components/AddressForm";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

const libraries: Libraries = ["places"];

const Main: React.FC = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [pointA, setPointA] = useState<google.maps.LatLngLiteral | null>(null);
  const [pointB, setPointB] = useState<google.maps.LatLngLiteral | null>(null);
  const [showDriversList, setShowDriversList] = useState<boolean>(false);

  const navigate = useNavigate();

  const [passengerId, setPassengerId] = useState<string>("");
  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [distanceTrip, setDistanceTrip] = useState<number>(0);
  const [durationTrip, setDurationTrip] = useState<number>(0);
  let driver_identification: number;
  let driver_name: string;
  let totalPrice: number;

  const handleDriverConfirmation = async (
    driver_id: number,
    name: string,
    totalCost: number
  ) => {
    driver_identification = driver_id;
    driver_name = name;
    totalPrice = totalCost;

    try {
      await processDriverData();
      requestRecordList();
    } catch (error) {
      console.error("Error confirming ride or fetching records:", error);
    }
  };

  const processDriverData = async () => {
    const requestData = {
      customer_id: passengerId,
      origin: originAddress,
      destination: destinationAddress,
      distance: distanceTrip,
      duration: durationTrip,
      driver: {
        driver_id: driver_identification,
        name: driver_name,
      },
      value: totalPrice,
    };

    try {
      const response = await api.patch("/ride/confirm", requestData);
      if (response.status !== 200) {
        throw new Error(`Error confirming ride: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  };

  const requestRecordList = async () => {
    try {
      const response = await api.get(`/ride/${passengerId}`);
      const data = response.data;

      const serializableData = {
        customer_id: data.customer_id,
        rides: data.rides.map((ride: any) => ({
          id: ride.id,
          date: ride.date,
          origin: ride.origin,
          destination: ride.destination,
          distance: ride.distance,
          duration: ride.duration,
          driver: ride.driver,
          value: ride.value,
        })),
      };

      const userName = selectedUserName;

      navigate("/records", {
        state: { records: serializableData, userName },
      });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

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

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  if (!googleMapsApiKey) {
    console.error(
      "Google API key is missing. Please provide it in the .env file."
    );
    return <div>Error: Missing Google API key.</div>;
  }

  const handleSearchClick = async (): Promise<void> => {
    if (!selectedUserId) {
      setError("Usuário obrigatório");
      return;
    }

    if (!origin || !destination) {
      setError("Origem e destino não podem ficar em branco");
      return;
    }

    if (origin === destination) {
      setError("Origem e destino não podem ser iguais");
      return;
    }

    setError("");

    const requestData = {
      customer_id: selectedUserId,
      origin,
      destination,
    };

    setPassengerId(selectedUserId);
    setOriginAddress(origin);
    setDestinationAddress(destination);

    try {
      const response = await api.post("/ride/estimate", requestData);
      const data = response.data;
      const distanceInKm = (data.distance / 1000).toFixed(2);
      const durationInMin = (parseInt(data.duration) / 60).toFixed(0);

      setDistanceTrip(parseFloat(distanceInKm));
      setDurationTrip(parseFloat(durationInMin));

      setDistance(distanceInKm);
      setDuration(durationInMin);

      setPointA({ lat: data.origin.latitude, lng: data.origin.longitude });
      setPointB({
        lat: data.destination.latitude,
        lng: data.destination.longitude,
      });

      setShowDriversList(true);
    } catch (error) {
      console.error("Error fetching estimate:", error);
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <div className="main-container">
        <Navbar />
        <div className="inner-container">
          <div className="left-side">
            <Users
              onUserSelect={({ userId, userName }) => {
                setSelectedUserId(userId);
                setSelectedUserName(userName);
              }}
            />

            <AddressForm
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              onSearch={handleSearchClick}
            />
            {error && <div className="error-message">{error}</div>}
            <div className="info-container">
              <div className="info-content">
                <div className="info-item">
                  <h5>
                    <span>Distância: </span>
                    <span>{distance} Km</span>
                  </h5>
                </div>
                <div className="info-item">
                  <h5>
                    <span>Tempo Estimado:</span>
                    <span>{duration} minutos</span>
                  </h5>
                </div>
              </div>
            </div>
            {showDriversList && (
              <DriversList
                drivers={drivers}
                distance={distance}
                onConfirmDriver={handleDriverConfirmation}
              />
            )}
          </div>
          <div className="map-container">
            <MapComponent pointA={pointA} pointB={pointB} />
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default Main;
