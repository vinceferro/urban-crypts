'use client';

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accountState } from '@/state/accountState';
import { createRecord } from './actions/createRecord';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from 'flowbite-react';
import { RecordFormStatus } from './types';
import { CreateRecord } from '@/components/CreateRecord';
import Collector from '@/abis/Collector.json';
import Web3 from 'web3';
import { CreateTransaction } from '@/components/CreateTransaction';
import { FollowTransaction } from '@/components/FollowTransaction';
import { TransactionSucceeded } from '@/components/TransactionSucceeded';
import { TransactionFailed } from '@/components/TransactionFailed';

export default function Home() {
  const [state, formAction] = useFormState(createRecord, {
    status: RecordFormStatus.CREATING,
  });
  const { pending } = useFormStatus();
  const [files, setFiles] = useState<File[]>([]);
  const walletAddress = useRecoilValue<string | undefined>(accountState);

  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [receipt, setReceipt] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = Array.from(files || []).filter((_, i) => i !== index);
    setFiles(newFiles.length ? newFiles : []);
  };

  const submitDisabled = !walletAddress || !files?.length || pending;

  const signAndSend = async () => {
    state.status = RecordFormStatus.SIGNING;
    const contractAddress = '0x819110F8e51d2B45Dd4c380b0C962088cbCF5ed0';
    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      contractAddress
    );

    collector.methods
      .publishRecord(state.recordMetadataIpfsCID!)
      .send({
        from: walletAddress,
      })
      .on('transactionHash', (hash: any) => {
        setTxHash(hash);
      })
      .on('receipt', (receipt: any) => {
        setReceipt(receipt);
      })
      .on('error', (error: any) => {
        setError(error);
      })
      .finally(() => {
        state.status = RecordFormStatus.SUBMITTED;
      });
  };

  const tryAgain = () => {
    setError(undefined);
    setReceipt(undefined);
    setTxHash(undefined);
    state.status = RecordFormStatus.REVIEWING;
  };

  return (
    <main className='flex flex-col items-center justify-between p-24'>
      {state.status === RecordFormStatus.CREATING && (
        <form className='flex w-full flex-col gap-4' action={formAction}>
          <CreateRecord
            files={files}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
            submitDisabled={submitDisabled}
          />
          <input
            type='hidden'
            name='walletAddress'
            value={walletAddress ?? ''}
          />
        </form>
      )}
      {state.status === RecordFormStatus.REVIEWING && (
        <CreateTransaction
          onClick={signAndSend}
          metadataIpfsCID={state.recordMetadataIpfsCID!}
        />
      )}
      {state.status === RecordFormStatus.SIGNING && (
        <FollowTransaction txHash={txHash} receipt={receipt} error={error} />
      )}
      {state.status === RecordFormStatus.SUBMITTED && !error && (
        <TransactionSucceeded
          txHash={txHash}
          receipt={receipt}
          metadataIpfsCID={state.recordMetadataIpfsCID!}
        />
      )}
      {state.status === RecordFormStatus.SUBMITTED && error && (
        <TransactionFailed error={error} onClick={tryAgain} />
      )}
    </main>
  );
}
