export interface Record {
  walletAddress: string;
  ipfsCIDs: string[];
}

export enum RecordFormStatus {
  CREATING = 'CREATING',
  REVIEWING = 'REVIEWING',
  SIGNING = 'SIGNING',
  SUBMITTED = 'SUBMITTED',
}

export interface RecordFormState {
  status: RecordFormStatus;
  record?: Record;
  recordMetadataIpfsCID?: string;
}
