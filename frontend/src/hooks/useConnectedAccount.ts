import { accountState } from '@/state/accountState';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

const useConnectedAccount = () => {
  const [account, setAccount] = useRecoilState<string | undefined>(
    accountState
  );

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(undefined);
        return;
      }
      setAccount(accounts[0]);
    });

    const fetchConnectedAccount = async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length === 0) {
        setAccount(undefined);
        return;
      }
      setAccount(accounts[0]);
    };

    fetchConnectedAccount();
  }, [setAccount]);

  return [account, setAccount] as const;
};

export default useConnectedAccount;
