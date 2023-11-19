'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TextInput, Button, Label } from 'flowbite-react';

export const ApproveForm = ({
  onApproveClick,
}: {
  onApproveClick: (
    canToken: number,
    genericPlasticToken: number,
    plasticBottleToken: number,
    glassToken: number
  ) => void;
}) => {
  const [canToken, setCanToken] = useState<number>(0);
  const [genericPlasticToken, setGenericPlasticToken] = useState<number>(0);
  const [plasticBottleToken, setPlasticBottleToken] = useState<number>(0);
  const [glassToken, setGlassToken] = useState<number>(0);
  return (
    <div className='mt-4 flex w-full flex-col items-center justify-center gap-4'>
      <h2 className='text-xl font-bold'>
        Please enter the amount of tokens you want to send to the creator of
        this record.
      </h2>
      <p className='text-gray-500 dark:text-gray-400'>
        The amounts of token should represent the estimated weight in kilograms
        of the waste collected.
      </p>
      <div className='flex w-full items-center justify-center gap-4'>
        <Image src='/can-token.png' width={100} height={100} />
        <div className='flex-1'>
          <div className='mb-2 block'>
            <Label htmlFor='can-amount' value='Can Token Amount (kg)' />
          </div>
          <TextInput
            type='number'
            sizing='lg'
            placeholder='0.10'
            id='can-amount'
            onChange={(e) => {
              setCanToken(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className='flex w-full items-center justify-center gap-4'>
        <Image src='/generic-plastic-token.png' width={100} height={100} />
        <div className='flex-1'>
          <div className='mb-2 block'>
            <Label
              htmlFor='generic-plastic-amount'
              value='Generic Plastic Token Amount (kg)'
            />
          </div>
          <TextInput
            type='number'
            sizing='lg'
            placeholder='0.10'
            id='generic-plastic-amount'
            onChange={(e) => {
              setGenericPlasticToken(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className='flex w-full items-center justify-center gap-4'>
        <Image src='/plastic-bottle-token.png' width={100} height={100} />
        <div className='flex-1'>
          <div className='mb-2 block'>
            <Label
              htmlFor='plastic-bottle-amount'
              value='Plastic Bottle Token Amount (kg)'
            />
          </div>
          <TextInput
            type='number'
            sizing='lg'
            placeholder='0.10'
            id='plastic-bottle-amount'
            onChange={(e) => {
              setPlasticBottleToken(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className='flex w-full items-center justify-center gap-4'>
        <Image src='/glass-token.png' width={100} height={100} />
        <div className='flex-1'>
          <div className='mb-2 block'>
            <Label htmlFor='glass-amount' value='Glass Token Amount (kg)' />
          </div>
          <TextInput
            type='number'
            sizing='lg'
            placeholder='0.10'
            id='glass-amount'
            onChange={(e) => {
              setGlassToken(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <Button
          onClick={() =>
            onApproveClick(
              canToken,
              genericPlasticToken,
              plasticBottleToken,
              glassToken
            )
          }
          disabled={
            !canToken ||
            !genericPlasticToken ||
            !plasticBottleToken ||
            !glassToken
          }
        >
          Approve and Send Tokens
        </Button>
      </div>
    </div>
  );
};
