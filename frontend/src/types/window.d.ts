interface Window {
  ethereum?: {
    enable(): Promise<string[]>;
    request(method: { method: string }): Promise<string[]>;
  };
}
