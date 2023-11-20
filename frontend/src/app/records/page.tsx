'use client';

import { accountState } from '@/state/accountState';
import { useRecoilValue } from 'recoil';
import Collector from '@/abis/Collector.json';
import Web3, { EventLog } from 'web3';
import { useEffect, useState } from 'react';
import { COLLECTOR_ADDRESS } from '@/constants';
import { Table } from 'flowbite-react';
import Link from 'next/link';

export default function Profile() {
  const walletAddress = useRecoilValue<string | undefined>(accountState);
  const [records, setRecords] = useState<EventLog[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const web3 = new Web3(window.ethereum || window.web3.currentProvider);

    const collector = new web3.eth.Contract(
      Collector.abi as any,
      COLLECTOR_ADDRESS
    );

    async function getRecords(): Promise<EventLog[]> {
      const logs = await collector.getPastEvents('RecordPublished', {
        fromBlock: 0,
      });
      return logs
        .filter((log) => typeof log !== 'string')
        .toSorted((a, b) =>
          Number(b.blockNumber - a.blockNumber)
        ) as EventLog[];
    }

    getRecords().then((res: EventLog[]) => {
      setRecords(res);
    });
  }, [walletAddress]);

  return (
    <div className='xs:p-12 flex w-full flex-col items-center justify-center gap-4 p-24'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
        All Records
      </h1>
      <p className='text-gray-500 dark:text-gray-400'>
        Those are all the events on the blockchain.
      </p>
      <Table className='w-full'>
        <Table.Head>
          <Table.HeadCell>Creator</Table.HeadCell>
          <Table.HeadCell>Metadata Link</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {records.map((event: EventLog, index) => (
            <Table.Row key={index}>
              <Table.Cell>{event.returnValues._address}</Table.Cell>

              <Table.Cell>
                <a
                  className='text-blue-500 dark:text-blue-400'
                  href={`https://urban-crypts.infura-ipfs.io/ipfs/${event.returnValues._metadataLink}`}
                  target='_blank'
                >
                  {event.returnValues._metadataLink}
                </a>
              </Table.Cell>
              <Table.Cell>
                <Link
                  className='text-blue-500 dark:text-blue-400'
                  href={`/records/${event.returnValues._address}-${event.returnValues._index}`}
                >
                  View
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
