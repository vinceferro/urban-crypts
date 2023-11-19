'use client';

import { accountState } from '@/state/accountState';
import { useRecoilValue } from 'recoil';
import Collector from '@/abis/Collector.json';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import {
  COLLECTOR_ADDRESS,
  CAN_TOKEN_ADDRESS,
  GENERIC_PLASTIC_TOKEN_ADDRESS,
  GLASS_TOKEN_ADDRESS,
  PLASTIC_BOTTLE_TOKEN_ADDRESS,
} from '@/constants';
import { OnChainRecord, OnChainRecordStatus } from '../types';
import { Badge, Card, Table } from 'flowbite-react';
import UrbanCryptToken from '@/abis/UrbanCryptToken.json';

export default function Profile() {
  const walletAddress = useRecoilValue<string | undefined>(accountState);
  const [records, setRecords] = useState<OnChainRecord[]>([]);
  const [tokenBalances, setTokenBalances] = useState<BigInt[]>([]);

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

    async function getTokenBalance(address: string): Promise<BigInt> {
      const token = new web3.eth.Contract(UrbanCryptToken.abi as any, address);

      return await token.methods.balanceOf(walletAddress).call();
    }

    Promise.all([
      getTokenBalance(CAN_TOKEN_ADDRESS),
      getTokenBalance(GENERIC_PLASTIC_TOKEN_ADDRESS),
      getTokenBalance(GLASS_TOKEN_ADDRESS),
      getTokenBalance(PLASTIC_BOTTLE_TOKEN_ADDRESS),
    ]).then((res) => {
      setTokenBalances(res);
    });
  }, [walletAddress]);

  console.log(records);

  return (
    <div className='xs:p-12 flex w-full flex-col items-center justify-center gap-4 p-24'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
        Your Rewards
      </h1>
      <p className='text-gray-500 dark:text-gray-400'>
        Those are your rewards on the blockchain.
      </p>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <img src='/can-token.png' alt='can token' />
          <div className='flex flex-col items-center justify-center'>
            <p>
              <span className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                {Number(tokenBalances[0]) / 1000}&nbsp;
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                Can Tokens
              </span>
            </p>
          </div>
        </Card>
        <Card>
          <img src='/generic-plastic-token.png' alt='generic plastic token' />
          <div className='flex flex-col items-center justify-center'>
            <p>
              <span className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                {Number(tokenBalances[1]) / 1000}&nbsp;
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                Generic Plastic Tokens
              </span>
            </p>
          </div>
        </Card>
        <Card>
          <img src='/glass-token.png' alt='glass token' />
          <div className='flex flex-col items-center justify-center'>
            <p>
              <span className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                {Number(tokenBalances[2]) / 1000}&nbsp;
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                Glass Tokens
              </span>
            </p>
          </div>
        </Card>
        <Card>
          <img src='/plastic-bottle-token.png' alt='plastic bottle token' />
          <div className='flex flex-col items-center justify-center'>
            <p>
              <span className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                {Number(tokenBalances[3]) / 1000}&nbsp;
              </span>
              <span className='text-gray-500 dark:text-gray-400'>
                Plastic Bottle Tokens
              </span>
            </p>
          </div>
        </Card>
      </div>

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
