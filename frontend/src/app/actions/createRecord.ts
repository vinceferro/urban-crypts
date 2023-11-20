'use server';

import { RecordFormState, RecordFormStatus } from '../types';
import axios from 'axios';

interface IPFSResult {
  Name: string;
  Hash: string;
  Size: string;
}

export const createRecord = async (
  previousState: RecordFormState,
  formData: FormData
): Promise<RecordFormState> => {
  const walletAddress = formData.get('walletAddress') as string;
  const files = formData.getAll('files') as File[];

  const ipfsForm = new FormData();
  files.forEach((file) => {
    ipfsForm.append('file', file);
  });

  const response = await axios.post<IPFSResult[]>(
    'https://ipfs.infura.io:5001/api/v0/add?wrap-with-directory=true',
    ipfsForm,
    {
      headers: {
        Authorization: 'Basic ' + process.env.IPFS_AUTH,
      },
      transformResponse: (data) => {
        try {
          return data.split('\n').filter(Boolean).map(JSON.parse);
        } catch (err) {
          console.log(err);
          throw Error('Failed to parse NDJSON response');
        }
      },
    }
  );

  const ipfsCIDs = response.data
    .filter((value) => value.Name !== '')
    .map((file) => file.Hash);

  const record = {
    walletAddress,
    ipfsCIDs,
  };

  const ipfsForm2 = new FormData();
  ipfsForm2.append('file', JSON.stringify(record));
  const response2 = await axios.post<IPFSResult>(
    'https://ipfs.infura.io:5001/api/v0/add',
    ipfsForm2,
    {
      headers: {
        Authorization: 'Basic ' + process.env.IPFS_AUTH,
      },
    }
  );

  return {
    status: RecordFormStatus.REVIEWING,
    record,
    recordMetadataIpfsCID: response2.data.Hash,
  };
};
