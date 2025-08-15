import { Timestamp } from '@angular/fire/firestore';

export interface Prediction {
  id?: string;
  userId: string;
  pouleId: string;
  raceId: string;
  driver1: string;
  driver2: string;
  driver3: string;
  driver4: string;
  driver5: string;
  fastestLap: string;
  submittedAt: Timestamp;
}