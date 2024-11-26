import { Router } from "express";
import { estimateRoute } from "../controller/estimateRouteController";

const router = Router();

router.post("/ride/estimate", estimateRoute);

export default router;
