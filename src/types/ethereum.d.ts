interface Window {
  ethereum?: {
    request: (args: {
      method: string;
      params?: unknown[];
    }) => Promise<unknown>;
    chainId?: string;
    isMetaMask?: boolean;
    selectedAddress?: string;
    on?: (event: string, callback: (...args: unknown[]) => void) => void;
    removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
  };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      chainId?: string;
      isMetaMask?: boolean;
      selectedAddress?: string;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export {}; 