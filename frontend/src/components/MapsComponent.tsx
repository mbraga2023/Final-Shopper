import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

interface MapComponentProps {
  pointA: google.maps.LatLngLiteral | null;
  pointB: google.maps.LatLngLiteral | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ pointA, pointB }) => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const saoPauloCoordinates = { lat: -23.5505, lng: -46.6333 }; // São Paulo's coordinates

  useEffect(() => {
    if (pointA && pointB) {
      const pointAFormatted = { lat: pointA.lat, lng: pointA.lng };
      const pointBFormatted = { lat: pointB.lat, lng: pointB.lng };

      const directionsService = new google.maps.DirectionsService();

      const request: google.maps.DirectionsRequest = {
        origin: pointAFormatted,
        destination: pointBFormatted,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
        } else {
          console.error("Directions request failed due to: " + status);
        }
      });
    }
  }, [pointA, pointB]);

  const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    gestureHandling: "greedy",
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }} 
      center={saoPauloCoordinates}
      zoom={12}
      options={mapOptions}
    >
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
