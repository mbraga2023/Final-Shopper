import mongoose, { Document, Schema } from "mongoose";

interface IDriver {
  _id: string;
  name: string;
}

interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IRideConfirmation extends Document {
  customer_id: string;
  origin: ICoordinates;
  destination: ICoordinates;
  distance: number;
  duration: number;
  driver: IDriver;
  value: number;
}

const rideConfirmationSchema: Schema<IRideConfirmation> = new Schema(
  {
    customer_id: {
      type: String,
      required: true,
    },
    origin: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    destination: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    driver: {
      driver_id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const RideConfirmation = mongoose.model<IRideConfirmation>(
  "RideConfirmation",
  rideConfirmationSchema
);

export default RideConfirmation;
