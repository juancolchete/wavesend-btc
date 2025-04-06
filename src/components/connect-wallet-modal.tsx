"use client"

import { useEffect, useState } from "react"
import { Plus, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateWallet,getAddress } from "@/data"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (address: string) => void
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const [seedPhrase, setSeedPhrase] = useState("")

  async function handleCreateWallet() {
    // Generate a realistic Bitcoin address
    const address = await generateWallet()
    onConnect(address)
  }

  async function handleImportWallet() {
    if(window){
      if (!seedPhrase) return

      localStorage.setItem('seed',seedPhrase)
      const address = await getAddress(seedPhrase)
      onConnect(address)
    }
  }

  useEffect(()=>{
    async function loadWallet(){
      const seed = localStorage.getItem('seed')
      if(seed){
        let address = await getAddress(seed) 
        onConnect(address)
      }
    }
    loadWallet()
  },[])

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
                <p className="text-sm font-medium">Enter your seed phrase</p>
              </div>
              <Input
                type="password"
                placeholder="seed phrase"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
              />
              <p className="text-xs text-slate-500">Your seed phrase is never stored or transmitted online</p>
            </div>
            <Button onClick={handleImportWallet} className="w-full" disabled={!seedPhrase}>
              Import Wallet
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

