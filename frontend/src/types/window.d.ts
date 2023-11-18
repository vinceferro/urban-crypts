interface Window {
  ethereum?: {
    enable(): Promise<string[]>;
    request(method: { method: string }): Promise<string[]>;
  };
  web3?: {
    currentProvider: {
      sendAsync(
        payload: { method: string; params: any[] },
        callback: (err: Error, result: any) => void,
      ): void;
    };
  };
}
