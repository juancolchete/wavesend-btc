import WalletInterface from "@/components/wallet-interface"
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <WalletInterface />
    </main>
  )
}

