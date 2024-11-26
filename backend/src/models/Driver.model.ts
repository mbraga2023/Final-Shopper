import mongoose, { Document, Schema } from "mongoose";

interface IDriver extends Document {
  driver_id: number;
  name: String;
  description: String;
  car: String;
  rating: String;
  rate: number;
  minKm: number;
}

const driverSchema: Schema<IDriver> = new Schema({
  driver_id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  car: { type: String, required: true },
  rating: { type: String, required: true },
  rate: { type: Number, required: true },
  minKm: { type: Number, required: true },
});

const Driver = mongoose.model<IDriver>("Driver", driverSchema);

export default Driver;
