'use client';

import { accountState } from '@/state/accountState';
import { useRecoilValue } from 'recoil';
import Collector from '@/abis/Collector.json';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { COLLECTOR_ADDRESS } from '@/constants';
import { OnChainRecord, OnChainRecordStatus } from '../types';
import { Badge, Table } from 'flowbite-react';

export default function Profile() {
  const walletAddress = useRecoilValue<string | undefined>(accountState);
  const [records, setRecords] = useState<OnChainRecord[]>([]);

  useEffect(() => {
    console.log(walletAddress);
    if (!walletAddress) return;

    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      COLLECTOR_ADDRESS
    );

    async function getRecords(): Promise<OnChainRecord[]> {
      return await collector.methods.getRecordsByAddress(walletAddress).call();
    }
    getRecords().then((res) => {
      setRecords(res);
    });
  }, [walletAddress]);

  console.log(records);

  return (
    <div className='xs:p-12 flex w-full flex-col items-center justify-center gap-4 p-24'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
        Records
      </h1>
      <p className='text-gray-500 dark:text-gray-400'>
        Those are your records on the blockchain.
      </p>
      <Table className='w-full'>
        <Table.Head>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Metadata Link</Table.HeadCell>
          <Table.HeadCell>Timestamp</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {records.map((record: OnChainRecord, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {Number(record.status) === OnChainRecordStatus.PENDING && (
                  <Badge color='yellow'>Pending</Badge>
                )}
                {Number(record.status) === OnChainRecordStatus.APPROVED && (
                  <Badge color='green'>Approved</Badge>
                )}
                {Number(record.status) === OnChainRecordStatus.REJECTED && (
                  <Badge color='red'>Rejected</Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                <a
                  className='text-blue-500 dark:text-blue-400'
                  href={`https://urban-crypts.infura-ipfs.io/ipfs/${record.metadataLink}`}
                  target='_blank'
                >
                  {record.metadataLink}
                </a>
              </Table.Cell>
              <Table.Cell>
                {new Date(Number(record.timestamp) * 1000).toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
