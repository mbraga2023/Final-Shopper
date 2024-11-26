import { Router } from "express";
import { getAllDrivers } from "../controller/driverController";

const router = Router();

router.get("/drivers", getAllDrivers);

export default router;
