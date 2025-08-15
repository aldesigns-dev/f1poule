import { Timestamp } from '@angular/fire/firestore';

export interface Poule {
  id?: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Timestamp;
  isPublic: boolean;
  inviteCode: string;
  members: string[];
}