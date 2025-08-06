export interface Prediction {
  id: string;
  userId: string;
  pouleId: string;
  raceId: string;
  predictedPositions: string[];
  fastestLap: string;
  fastestPitStop: string;
  submittedAt: string;
}