'use client';

import { accountState } from '@/state/accountState';
import { useRecoilValue } from 'recoil';
import Collector from '@/abis/Collector.json';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import {
  CAN_TOKEN_ADDRESS,
  COLLECTOR_ADDRESS,
  GENERIC_PLASTIC_TOKEN_ADDRESS,
  GLASS_TOKEN_ADDRESS,
  PLASTIC_BOTTLE_TOKEN_ADDRESS,
} from '@/constants';
import { OnChainRecord, OnChainRecordStatus, Record } from '@/app/types';
import { Badge, Button } from 'flowbite-react';
import axios from 'axios';
import { ApproveForm } from '@/components/ApproveForm';
import { RejectForm } from '@/components/RejectForm';

export default function RecordPage({ params }: { params: { record: string } }) {
  const walletAddress = useRecoilValue<string | undefined>(accountState);
  const [record, setRecord] = useState<OnChainRecord | undefined>(undefined);
  const [recordMetadata, setRecordMetadata] = useState<Record | undefined>(
    undefined
  );
  const [isCollector, setIsCollector] = useState<boolean>(false);

  const [formMode, setFormMode] = useState<'approve' | 'reject' | undefined>(
    undefined
  );

  const onFormModeClick = (mode: 'approve' | 'reject') => () => {
    if (formMode === mode) {
      setFormMode(undefined);
    } else {
      setFormMode(mode);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      COLLECTOR_ADDRESS
    );

    const [address, index] = params.record.split('-');

    async function getRecord(
      address: string,
      index: string
    ): Promise<OnChainRecord> {
      return await collector.methods.recordsByAddress(address, index).call();
    }
    getRecord(address, index).then((res) => {
      setRecord(res);
    });

    async function hasCollectorPrivileges(address: string): Promise<boolean> {
      const role = await collector.methods.CONTROLLER().call();
      return await collector.methods.hasRole(role, address).call();
    }
    hasCollectorPrivileges(walletAddress).then((res) => {
      setIsCollector(res);
    });
  }, [walletAddress, params.record]);

  useEffect(() => {
    if (!record) return;
    axios
      .get(`https://urban-crypts.infura-ipfs.io/ipfs/${record?.metadataLink}`)
      .then((res) => {
        setRecordMetadata(res.data);
      });
  }, [record]);

  const approveRecord = async (
    canToken: number,
    genericPlasticToken: number,
    plasticBottleToken: number,
    glassToken: number
  ) => {
    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      COLLECTOR_ADDRESS
    );

    const [address, index] = params.record.split('-');

    const tokensContract = [];
    const tokensAmount = [];

    if (canToken) {
      tokensContract.push(CAN_TOKEN_ADDRESS);
      tokensAmount.push(canToken);
    }
    if (genericPlasticToken) {
      tokensContract.push(GENERIC_PLASTIC_TOKEN_ADDRESS);
      tokensAmount.push(genericPlasticToken);
    }
    if (plasticBottleToken) {
      tokensContract.push(PLASTIC_BOTTLE_TOKEN_ADDRESS);
      tokensAmount.push(plasticBottleToken);
    }
    if (glassToken) {
      tokensContract.push(GLASS_TOKEN_ADDRESS);
      tokensAmount.push(glassToken);
    }

    collector.methods
      .approveRecord(
        address,
        index,
        tokensContract,
        tokensAmount.map((amount) => parseInt(amount * 1000))
      )
      .send({
        from: walletAddress,
      })
      .on('transactionHash', (hash: any) => {
        console.log(hash);
      })
      .on('receipt', (receipt: any) => {
        console.log(receipt);
      })
      .on('error', (error: any) => {
        console.log(error);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  const rejectRecord = async (reason: string) => {
    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      COLLECTOR_ADDRESS
    );

    const [address, index] = params.record.split('-');
    collector.methods
      .rejectRecord(address, index, reason)
      .send({
        from: walletAddress,
      })
      .on('transactionHash', (hash: any) => {
        console.log(hash);
      })
      .on('receipt', (receipt: any) => {
        console.log(receipt);
      })
      .on('error', (error: any) => {
        console.log(error);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <div className='xs:p-12 xs:p-12 flex w-full flex-col items-center justify-center gap-4 p-24'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
        Record {params.record}
      </h1>
      {record && (
        <div className='flex flex-col items-center justify-center gap-4'>
          <p className='text-gray-500 dark:text-gray-400'>
            {Number(record.status) === OnChainRecordStatus.PENDING && (
              <Badge size='4xl' color='yellow'>
                Pending
              </Badge>
            )}
            {Number(record.status) === OnChainRecordStatus.APPROVED && (
              <Badge size='4xl' color='green'>
                Approved
              </Badge>
            )}
            {Number(record.status) === OnChainRecordStatus.REJECTED && (
              <Badge size='4xl' color='red'>
                Rejected
              </Badge>
            )}
          </p>
          <p className='text-gray-500 dark:text-gray-400'>
            <a
              className='text-blue-500 dark:text-blue-400'
              href={`https://urban-crypts.infura-ipfs.io/ipfs/${record?.metadataLink}`}
            >
              Raw Metadata
            </a>
          </p>
          <p className='text-gray-500 dark:text-gray-400'>
            Timestamp: {new Date(Number(record.timestamp)).toLocaleString()}
          </p>
        </div>
      )}
      {recordMetadata && (
        <div className='flex w-full flex-col items-center gap-4'>
          {recordMetadata.ipfsCIDs.map((ipfsCID, index) => (
            <img
              key={`img-${index}`}
              src={`https://urban-crypts.infura-ipfs.io/ipfs/${ipfsCID}`}
            />
          ))}
        </div>
      )}
      {isCollector &&
        record &&
        Number(record.status) === OnChainRecordStatus.PENDING && (
          <div className='flex items-center justify-center gap-4'>
            <Button
              onClick={onFormModeClick('approve')}
              outline={false}
              color='green'
            >
              Approve
            </Button>
            or
            <Button
              onClick={onFormModeClick('reject')}
              outline={false}
              color='red'
            >
              Reject
            </Button>
          </div>
        )}
      {formMode === 'approve' && <ApproveForm onApproveClick={approveRecord} />}
      {formMode === 'reject' && <RejectForm onRejectClick={rejectRecord} />}
    </div>
  );
}
