export const FollowTransaction = ({
  txHash,
  receipt,
  error,
}: {
  txHash?: string;
  receipt?: string;
  error?: string;
}) => (
  <div className='flex flex-col items-center justify-center gap-4'>
    <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
      Following the transaction...
    </h1>
    <p className='text-gray-500 dark:text-gray-400'>
      The transaction is on its way to the blockchain.
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      You&apos;ll receive a confirmation once it is mined.
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      Transaction hash: {txHash ? txHash : '...'}
    </p>
    <p className='text-gray-500 dark:text-gray-400'>
      Transaction receipt: {receipt ? receipt : '...'}
    </p>
    {error ? (
      <p className='text-gray-500 dark:text-gray-400'>Error: {error}</p>
    ) : null}
  </div>
);
