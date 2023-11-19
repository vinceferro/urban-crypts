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

export enum OnChainRecordStatus {
  PENDING = 0,
  REJECTED = 1,
  APPROVED = 2,
}

export interface OnChainRecord {
  status: OnChainRecordStatus;
  timestamp: BigInt;
  metadataLink: string;
}