import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: name, 
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};