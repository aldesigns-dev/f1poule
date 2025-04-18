import { Constructor } from "./constructor.model";
import { Driver } from "./driver.model";

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}