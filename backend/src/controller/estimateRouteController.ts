import { Request, Response } from "express";
import axios from "axios";
import { RouteRequestBody, RouteOption } from "../models/Route.model";

export const estimateRoute = async (
  req: Request,
  res: Response
): Promise<void> => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

  if (!API_KEY) {
    res.status(500).json({
      error_code: "API_KEY_NOT_FOUND",
      error_description: "Google API key is not set!",
    });
    return; 
  }

  try {
    const { customer_id, origin, destination }: RouteRequestBody = req.body;

    if (!customer_id) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer ID is required and cannot be empty.",
      });
      return; 
    }

    if (!origin || !destination) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Origin and destination cannot be empty.",
      });
      return; 
    }

    if (origin === destination) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Origin and destination cannot be the same address.",
      });
      return; 
    }

    const geocodeAddress = async (address: string) => {
      try {
        const response = await axios.get(GEOCODE_API_URL, {
          params: {
            address,
            key: API_KEY,
          },
        });

        const result = response.data.results[0];

        if (!result) {
          throw new Error(`Geocoding failed for address: ${address}`);
        }

        return result.geometry.location;
      } catch (error: any) {
        throw new Error(`Geocoding error for address "${address}": ${error.message}`);
      }
    };

    let originCoords, destinationCoords;

    try {
      originCoords = await geocodeAddress(origin);
    } catch (error: any) {
      res.status(400).json({
        error_code: "INVALID_ORIGIN",
        error_description: error.message,
      });
      return; 
    }

    try {
      destinationCoords = await geocodeAddress(destination);
    } catch (error: any) {
      res.status(400).json({
        error_code: "INVALID_DESTINATION",
        error_description: error.message,
      });
      return; 
    }

    const directionsRequestBody = {
      origin: {
        location: {
          latLng: {
            latitude: originCoords.lat,
            longitude: originCoords.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destinationCoords.lat,
            longitude: destinationCoords.lng,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    };

    const directionsResponse = await axios.post(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${API_KEY}`,
      directionsRequestBody,
      {
        headers: {
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs",
        },
      }
    );

    const route =
      directionsResponse.data.routes && directionsResponse.data.routes[0];
    if (!route || !route.legs || route.legs.length === 0) {
      res.status(500).json({
        error_code: "ROUTE_NOT_FOUND",
        error_description: "No route found in the Google API response.",
      });
      return; 
    }

    const options: RouteOption[] = route.legs.map((leg: any, index: number) => {
      const distanceMeters = leg.distance?.meters || 0;
      return {
        id: index + 1,
        name: `Route ${index + 1}`,
        description: leg.instructions || "No description",
        vehicle: "Car",
        review: { rating: 4.5, comment: "Good route" },
        value: distanceMeters,
      };
    });

    const result = {
      origin: {
        latitude: originCoords.lat,
        longitude: originCoords.lng,
      },
      destination: {
        latitude: destinationCoords.lat,
        longitude: destinationCoords.lng,
      },
      distance: route.distanceMeters || 0,
      duration: route.duration ? route.duration : "N/A",
      options,
      routeResponse: route,
    };

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching route from Google API:", error);
    res.status(500).json({
      error_code: "ROUTE_FETCH_FAILED",
      error_description:
        error.message || "An error occurred while fetching the route data.",
    });
    return; 
  }
};
