import { Button } from 'flowbite-react';

export const TransactionFailed = ({
  error,
  onClick,
}: {
  error: string;
  onClick: () => void;
}) => (
  <div className='flex flex-col items-center justify-center gap-4'>
    <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
      The transaction has failed!
    </h1>
    <p className='text-gray-500 dark:text-gray-400'>
      Unfortunately the transaction has failed. Here&apos;s the error: {error}
    </p>
    <Button onClick={onClick}>Try again</Button>
  </div>
);
