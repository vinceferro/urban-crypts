import React from 'react';
import Web3 from 'web3';
import { useRecoilState } from 'recoil';
import { accountState } from '@/state/accountState';
import { Button } from 'flowbite-react';

const ConnectButton: React.FC = () => {
  const [account, setAccount] = useRecoilState<string | null>(accountState);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
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
      {account ? `Connected: ${account}` : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectButton;
