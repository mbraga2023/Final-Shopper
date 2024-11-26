import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllDrivers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const drivers = await prisma.driver.findMany();

    if (drivers.length === 0) {
      res.status(404).json({ message: "No drivers found" });
      return;
    }

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "An error occurred while fetching drivers." });
  }
};
