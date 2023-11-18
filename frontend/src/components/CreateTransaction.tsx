import { Button } from 'flowbite-react';

export const CreateTransaction = ({
  onClick,
  metadataIpfsCID,
}: {
  onClick: () => void;
  metadataIpfsCID: string;
}) => (
  <div className='flex flex-col items-center justify-center gap-4'>
    <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
      Almost ready to get your rewards!
    </h1>
    <p className='text-gray-500 dark:text-gray-400'>
      Your pictures and the metadata generated for you have been uploaded to
      IPFS. You can find the metadata{' '}
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
      Once the record is published to the blockchain, a Collector will be able
      to verify it and send you your rewards.
    </p>
    <Button onClick={onClick}>Publish record</Button>
  </div>
);
