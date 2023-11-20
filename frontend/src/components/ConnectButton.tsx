'use client';

import React from 'react';
import { Button } from 'flowbite-react';
import useConnectedAccount from '@/hooks/useConnectedAccount';

const ConnectButton: React.FC = () => {
  const [account, setAccount] = useConnectedAccount();

  const truncateString = (str: string, maxLength: number) => {
    if (str.length <= maxLength) {
      return str;
    }

    const startLength = Math.ceil((maxLength - 3) / 2);
    const endLength = Math.floor((maxLength - 3) / 2);

    return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.log(
        'Non-Ethereum browser detected. Consider installing MetaMask!'
      );
    }
  };

  return (
    <Button onClick={connectWallet}>
      {account ? truncateString(account, 14) : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectButton;
