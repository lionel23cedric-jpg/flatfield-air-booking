import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },

    fromCode: {
      type: String,
      required: true,
    },

    fromName: {
      type: String,
      required: true,
    },

    toCode: {
      type: String,
      required: true,
    },

    toName: {
      type: String,
      required: true,
    },

    departureTime: {
      type: Date,
      required: true,
      index: true,
    },

    arrivalTime: {
      type: Date,
      required: true,
    },

    departureZone: {
      type: String,
      required: true,
    },

    arrivalZone: {
      type: String,
      required: true,
    },

    aircraft: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    bookedSeats: {
      type: Number,
      default: 0,
    },

    priceCents: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Flight || mongoose.model("Flight", FlightSchema);