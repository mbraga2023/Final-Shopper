import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const confirmRide = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      customer_id,
      origin,
      destination,
      distance, 
      duration,
      driver,
      value,
    } = req.body;

    if (
      !customer_id ||
      !origin ||
      !destination ||
      !distance ||
      !duration ||
      !driver ||
      !value
    ) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "All fields are required.",
      });
    }

    if (typeof origin !== "string" || typeof destination !== "string") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Origin and destination must be strings.",
      });
    }

    if (!customer_id || customer_id.trim() === "") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer ID cannot be empty.",
      });
    }

    const driverId = Number(driver.driver_id); 
    const foundDriver = await prisma.driver.findUnique({
      where: {
        driver_id: driverId, 
      },
    });

    if (!foundDriver) {
      return res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Driver not found.",
      });
    }

    const formattedDistance = distance; 
    const formattedValue = parseFloat(value).toFixed(2);      

    const distanceInKm = parseFloat(formattedDistance); 

    if (distanceInKm < foundDriver.minKm) {
      return res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description: `The distance of ${distanceInKm} km is invalid for the selected driver. Minimum distance is ${foundDriver.minKm} km.`,
      });
    }

    const rideConfirmation = await prisma.rideConfirmation.create({
      data: {
        customer_id,
        origin,
        destination,
        distance: distanceInKm, 
        duration,
        value: parseFloat(formattedValue), 
        driver: { 
          connect: {
            driver_id: foundDriver.driver_id, 
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      
    });
  } catch (error: any) {
    console.error("Error confirming ride:", error);

    const errorMessage =
      error?.message || "An error occurred while confirming the ride.";

    return res.status(500).json({
      error_code: "RIDE_CONFIRMATION_FAILED",
      error_description: errorMessage,
    });
  }
};
