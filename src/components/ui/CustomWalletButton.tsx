import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ChevronDown, ChevronsUpDown, Copy, LogOut, WalletIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CustomWalletButton() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.toString().slice(0, 4)}...${address.toString().slice(-4)}`;
  };

  return (
    <div className="z-100 relative" ref={dropdownRef}>
      {!connected ? (
        <button
          onClick={() => setVisible(true)}
          className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-purple-500/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/60 transition-all"
        >
          <WalletIcon className="h-3.5 w-3.5 text-purple-300" />
          <span>Connect</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-purple-500/10 text-white/90 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/60 transition-all"
          >
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            {publicKey && formatAddress(publicKey)}
            <ChevronDown className="h-3 w-3 text-purple-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute z-100 right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-lg bg-black/70 backdrop-blur-md border border-purple-500/10 p-1 z-50">
              <div className="py-1">
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 w-full text-left rounded-lg"
                >
                  <Copy className="h-3.5 w-3.5 text-purple-300" />
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>

                <button
                  onClick={() => {
                    setVisible(true);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 w-full text-left rounded-lg"
                >
                  <ChevronsUpDown className="h-3.5 w-3.5 text-purple-300" />
                  Change Wallet
                </button>

                <button
                  onClick={() => {
                    disconnect();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 w-full text-left rounded-lg"
                >
                  <LogOut className="h-3.5 w-3.5 text-purple-300" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}