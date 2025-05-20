import { DriverCareerStats } from "./driver-career-stats.model";
import { DriverSeasonStats } from "./driver-season-stats.model";
import { DriverStanding } from "./driver-standing.model";

export interface DriverDetail {
  driver: DriverStanding;
  careerStats: DriverCareerStats;
  seasonStats: DriverSeasonStats;
  round: number;
  constructorName: string;
  constructorColor: string;
}