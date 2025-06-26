import { Timestamp } from '@angular/fire/firestore';

export interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: Timestamp;
  avatarUrl?: string;
}