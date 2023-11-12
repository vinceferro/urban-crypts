'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accountState } from '@/state/accountState';
import { quote } from './actions/quote';
import { useFormState, useFormStatus } from 'react-dom';
import { Button, FileInput } from 'flowbite-react';
import { Quote, QuoteStatus } from './types';
import { CreateQuote } from '@/components/CreateQuote';

export default function Home() {
  const [state, formAction] = useFormState(quote, {
    status: QuoteStatus.PENDING,
    quote: null,
  });
  const { pending } = useFormStatus();
  const [files, setFiles] = useState<File[]>([]);
  const walletAddress = useRecoilValue<string | null>(accountState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = Array.from(files || []).filter((_, i) => i !== index);
    setFiles(newFiles.length ? newFiles : []);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    formAction.submit();
  }

  const submitDisabled = !walletAddress || !files?.length || pending;

  return (
    <main className='flex flex-col items-center justify-between p-24'>
      <form className='flex w-full flex-col gap-4'>
        {state.status === QuoteStatus.PENDING && (
          <CreateQuote
            files={files}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
            submitDisabled={submitDisabled}
            handleSubmit={handleSubmit}
          />
        )}
      </form>
    </main>
  );
}
