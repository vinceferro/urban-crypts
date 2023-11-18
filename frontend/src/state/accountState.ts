import { atom } from 'recoil';

export const accountState = atom<string | undefined>({
  key: 'accountState',
  default: undefined,
});
