import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RideHistoryParams {
  customer_id: string;  
}

export const ridesHistory = async (
  req: Request<RideHistoryParams>,  
  res: Response
): Promise<void> => {
  try {
    const { customer_id } = req.params;  
    let { driver_id } = req.query; 
    if (!customer_id || customer_id.trim() === "") {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer ID cannot be empty.",
      });
      return;
    }

    if (driver_id) {
      const parsedDriverId = Number(driver_id);
      if (isNaN(parsedDriverId) || parsedDriverId <= 0) {
        res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "Driver ID must be a valid positive number.",
        });
        return;
      }

      const validDriver = await prisma.driver.findUnique({
        where: { driver_id: parsedDriverId },
      });

      if (!validDriver) {
        res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "Driver with the given ID does not exist.",
        });
        return;
      }
    }

    const query: any = {
      where: { customer_id },
      orderBy: { createdAt: "desc" },
      include: {
        driver: {
          select: {
            driver_id: true,  
            name: true,
          },
        },
      },
    };

    if (driver_id) {
      query.where.driver_id = Number(driver_id);
    }

    const rides = await prisma.rideConfirmation.findMany(query);

    if (!rides || rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "No rides found for the specified customer.",
      });
      return;
    }

    const formattedRides = rides.map((ride) => ({
      id: ride.id,
      date: ride.createdAt,
      origin: ride.origin,
      destination: ride.destination,
      distance: (ride.distance).toFixed(2),  
      duration: ride.duration,
      driver: ride.driver,  
      value: ride.value.toFixed(2),  
    }));

    res.status(200).json({
      customer_id,
      rides: formattedRides,
    });
  } catch (error: any) {
    console.error("Error fetching ride history:", error);

    const errorMessage =
      error?.message || "An error occurred while fetching the ride history.";

    res.status(500).json({
      error_code: "RIDE_HISTORY_FETCH_FAILED",
      error_description: errorMessage,
    });
  }
};
