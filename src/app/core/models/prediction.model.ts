export interface Prediction {
  id: string;
  userId: string;
  pouleId: string;
  raceId: string;
  predictedPositions: string[];
  submittedAt: string;
}