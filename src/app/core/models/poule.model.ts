export interface Poule {
  id?: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  inviteCode: string;
  members: string[];
}