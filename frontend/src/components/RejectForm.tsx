'use client';

import { useState } from 'react';
import { Button, Label, Textarea } from 'flowbite-react';

export const RejectForm = ({
  onRejectClick,
}: {
  onRejectClick: (reason: string) => void;
}) => {
  const [reason, setReason] = useState<string>('');

  return (
    <div className='mt-4 flex w-full flex-col items-center justify-center gap-4'>
      <h2 className='text-xl font-bold'>Rejecting the record</h2>
      <p className='text-gray-500 dark:text-gray-400'>
        Please enter a brief reason for rejecting the record.
      </p>
      <div className='flex w-full items-center justify-center gap-4'>
        <div className='w-full'>
          <Label htmlFor='reason' value='Reason of rejection' />
          <Textarea
            className='w-full'
            id='reason'
            rows={5}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          ></Textarea>
        </div>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <Button onClick={() => onRejectClick(reason)} disabled={!reason}>
          Reject record
        </Button>
      </div>
    </div>
  );
};
