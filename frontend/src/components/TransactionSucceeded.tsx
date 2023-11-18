import { Button } from 'flowbite-react';

export const TransactionSucceeded = ({
  txHash,
  receipt,
  metadataIpfsCID,
}: {
  txHash?: string;
  receipt?: string;
  metadataIpfsCID: string;
}) => (
  <div className='flex flex-col items-center justify-center gap-4'>
    <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
      Your record has been published!
    </h1>
    <p className='text-gray-500 dark:text-gray-400'>
      You can find the record{' '}
      <a
        className='text-blue-500 dark:text-blue-400'
        href={`https://urban-crypts.infura-ipfs.io/ipfs/${metadataIpfsCID}`}
        target='_blank'
      >
        here
      </a>
      .
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      A Collector will be able to verify it and send you your rewards.
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      Transaction hash: {txHash ? txHash : '...'}
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      Transaction receipt: <pre>{receipt ? receipt.toString() : '...'}</pre>
    </p>
    <Button onClick={() => window.location.reload()}>Submit another</Button>
  </div>
);
