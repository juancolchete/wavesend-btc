"use client"

import { useState } from "react"
import { Plus, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (address: string) => void
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const [privateKey, setPrivateKey] = useState("")

  // Generate a realistic Bitcoin address
  function generateBitcoinAddress() {
    // This is a mock function - in a real app, you would derive this from cryptographic operations
    const addressTypes = [
      // Legacy address (P2PKH)
      "1",
      // SegWit address (P2SH)
      "3",
      // Native SegWit (bech32)
      "bc1q",
    ]

    const type = addressTypes[Math.floor(Math.random() * addressTypes.length)]
    const validChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

    let address = type
    // Generate a random string of valid characters
    const length = type === "bc1q" ? 39 - type.length : 34 - type.length

    for (let i = 0; i < length; i++) {
      address += validChars.charAt(Math.floor(Math.random() * validChars.length))
    }

    return address
  }

  function handleCreateWallet() {
    // Generate a realistic Bitcoin address
    const address = generateBitcoinAddress()
    onConnect(address)
  }

  function handleImportWallet() {
    if (!privateKey) return

    // In a real app, this would derive the Bitcoin address from the private key
    // For now, we'll generate a realistic address
    const address = generateBitcoinAddress()
    onConnect(address)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 py-4">
            <div className="text-center space-y-2">
              <Plus className="mx-auto h-12 w-12 text-slate-300" />
              <p className="text-sm text-slate-500">Create a new Bitcoin wallet for offline transactions</p>
            </div>
            <Button onClick={handleCreateWallet} className="w-full">
              Create New Wallet
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-slate-400" />
                <p className="text-sm font-medium">Enter your private key</p>
              </div>
              <Input
                type="password"
                placeholder="Private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <p className="text-xs text-slate-500">Your private key is never stored or transmitted online</p>
            </div>
            <Button onClick={handleImportWallet} className="w-full" disabled={!privateKey}>
              Import Wallet
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

