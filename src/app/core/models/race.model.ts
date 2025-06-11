import { DriverResult } from "./driver-result.model";
import { SprintResult } from "./sprint-result.model";

export interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  FirstPractice: { date: string; time: string };
  SecondPractice: { date: string; time: string };
  ThirdPractice: { date: string; time: string };
  Qualifying: { date: string; time: string };

  SprintResults?: SprintResult[];
  Results?: DriverResult[];
}