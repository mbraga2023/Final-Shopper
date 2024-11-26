import { Router } from "express";
import { confirmRide } from "../controller/confirmRideController";

const router = Router();

router.patch("/ride/confirm", confirmRide);

export default router;
