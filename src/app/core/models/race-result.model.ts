import { Constructor } from "./constructor.model";
import { Driver } from "./driver.model";

export interface RaceResult {
  number?: string;
  position?: string;
  positionText?: string;
  points?: string;
  grid?: string;
  laps?: string;
  status?: string;
  Time?: {
    millis?: string;
    time?: string;
  };
  FastestLap?: {
    lap?: string;
    Time?: {
      time?: string;
    };
  };
  Driver: Driver;
  Constructor: Constructor;
}