import { Router } from "express";
import { ridesHistory } from "../controller/rideHistoryController"; 

const router = Router();

router.get("/ride/:customer_id", ridesHistory);

export default router;
