import { DriverCareerStats } from "./driver-career-stats.model";
import { DriverStanding } from "./driver-standing.model";

export interface DriverDetail {
  driver: DriverStanding;
  careerStats: DriverCareerStats;
  round: number;
  constructorName: string;
  constructorColor: string;
}