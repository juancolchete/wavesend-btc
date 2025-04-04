"use client"

import { useState } from "react"
import { Wallet, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ConnectWalletModal from "@/components/connect-wallet-modal"

export default function WalletInterface() {
  const [amount, setAmount] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [nonce, setNonce] = useState("0")

  function generateRandomNonce() {
    return Math.floor(Math.random() * 1000000).toString()
  }

  function refreshNonce() {
    setNonce(generateRandomNonce())
  }

  function handleConnect(address: string) {
    setWalletAddress(address)
    setIsConnected(true)
    setShowConnectModal(false)
  }

  function handleSend() {
    // In a real app, this would initiate the Bitcoin transaction
    alert(`Sending ${amount} BTC with nonce ${nonce}`)
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            WaveSend
          </CardTitle>
          <CardDescription>Send Bitcoin offline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isConnected ? (
            <>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-sm font-medium text-slate-500">Connected Wallet</p>
                <p className="font-mono text-sm break-all">{walletAddress}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Send (BTC)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nonce">Nonce</Label>
                <div className="flex gap-2">
                  <Input id="nonce" value={nonce} onChange={(e) => setNonce(e.target.value)} className="flex-1" />
                  <Button variant="outline" size="icon" onClick={refreshNonce} title="Generate new nonce">
                    <RefreshCw size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input id="recipient" placeholder="Enter Bitcoin address" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Wallet className="h-16 w-16 text-slate-300" />
              <p className="text-center text-slate-500">Connect your wallet to send Bitcoin offline</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isConnected ? (
            <Button className="w-full" onClick={handleSend} disabled={!amount || Number.parseFloat(amount) <= 0}>
              Send Bitcoin
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setShowConnectModal(true)}>
              Connect Wallet
            </Button>
          )}
        </CardFooter>
      </Card>

      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnect}
      />
    </>
  )
}

