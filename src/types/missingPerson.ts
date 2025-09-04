export type MissingStatus = 'missing' | 'found';

export interface MPComment {
  _id: string;
  body: string;
  client?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MissingPerson {
  _id: string;
  personName: string;
  age: number;
  lastSeenDateTime: string; // ISO
  lastSeenLocation: string;
  contact: string;
  missingStatus: MissingStatus;
  filePath?: string;   // from list endpoint
  filepath?: string;   // from detail endpoint (before rewrite) or raw model
  comments?: MPComment[];
}