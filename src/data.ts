import * as bitcoin from 'bitcoinjs-lib';
import * as bitcore from 'bitcore-lib';
import * as bip39 from 'bip39';


function hexToString(hex: string, leadingZeros: number) {
  hex = hex.substring(2 + leadingZeros) // remove the '0x' part
  let string = ""

  while (hex.length % 4 != 0) { // we need it to be multiple of 8
    hex = "0" + hex;
  }

  for (let i = 0; i < hex.length; i += 8) {
    string += String.fromCharCode(parseInt(hex.substring(i, i + 4), 16), parseInt(hex.substring(i + 4, i + 8), 16))
    console.log(`string-${String.fromCharCode(parseInt(hex.substring(i, i + 4), 16), parseInt(hex.substring(i + 4, i + 8), 16))}-${parseInt(hex.substring(i, i + 4), 16), parseInt(hex.substring(i + 4, i + 8), 16)}`)
  }
  for (let i = 0; i < 100; i++) {
    console.log(`${i}char-${String.fromCharCode(i)}`)
  }
  return string;
}
function stringToHex(str: string, leadingZeros: number) {
  const string = str
  let hex = ""
  for (let i = 0; i < string.length; i++) {
    hex += ((i == 0 ? "" : "000") + string.charCodeAt(i).toString(16)).slice(-4) // get character ascii code and convert to hexa string, adding necessary 0s
  }
  let leading = "";
  for (let i = 0; i < leadingZeros; i++) {
    leading += "0"
  }
  return '0x' + leading + hex;
}
const customBase182 = {
  characters: `0123456789@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !#%&()*+-./:;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà¤|[]{}~^€¡'"你好是的了不他在这一有大人中来国上到说生子出时年和那要以为望家个学也吗但后着老我们能力工作非常长问题`,
  base: BigInt(182),
};
function encodeToBase(number: bigint) {
  const { characters, base } = customBase182;
  let result = '';

  while (number > BigInt(0)) {
    const remainder = number % base;
    result = characters[Number(remainder)] + result;
    number = number / base;
  }

  return result;
}

function decodeFromBase(encoded: string, leadingZeros: number) {
  const { characters, base } = customBase182;
  let result = BigInt(0);

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded.charAt(i);
    const charValue = BigInt(characters.indexOf(char));
    if (charValue === BigInt(-1)) {
      throw new Error(`Invalid character "${char}" in the encoded string.`);
    }
    result = result * base + charValue;
  }
  let leading = "";
  for (let i = 0; i < leadingZeros; i++) {
    leading += "0"
  }
  return '0x' + leading + result.toString(16);
}


import { generateMnemonic as _generateMnemonic, mnemonicToSeed } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';

  const network_version = {
    mainnet: {
      private: 0x04b2430c,
      public: 0x04b24746,
    },
    testnet: {
      private: 0x045f18bc,
      public: 0x045f1cf6,
    },
  };
import * as btc from 'micro-btc-signer';
import { Network } from 'lucide-react';

type AllowedKeyEntropyBits = 128 | 256;

export function generateMnemonic(entropy: AllowedKeyEntropyBits = 256): string {
  if (entropy !== 256 && entropy !== 128)
    throw TypeError(
      `Incorrect entropy bits provided, expected 256 or 128 (24 or 12 word results), got: "${String(
        entropy
      )}".`
    );
  return _generateMnemonic(wordlist, entropy);
}

async function generateWallet() {
  const mnemonic = generateMnemonic();
  localStorage.setItem("seed", mnemonic)
  const address = await getAddress(mnemonic)
  return `${address}`
}

export const NETWORK = {
  bech32: 'bc',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

export const TEST_NETWORK: typeof NETWORK = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

async function getAddress(seed: string) {
  const masterseed = await mnemonicToSeed(seed);

  const hdkey = HDKey.fromMasterSeed(masterseed, network_version.testnet);

  const receive_path = "m/84'/0'/0'/0/0";

  const receive_node = hdkey.derive(receive_path);

  const address = btc.getAddress('tr', receive_node.privateKey!,TEST_NETWORK);
  return `${address}`
}

// async function sendTaprootTransaction() {
//   // Step 1: Generate or use an existing mnemonic and derive keys
//   const mnemonic = 'your mnemonic phrase here'; // Replace with your 12/24-word mnemonic
//   const seed = await bip39.mnemonicToSeed(mnemonic);
//   const root = bip32.fromSeed(seed, network);
//   const path = `m/86'/1'/0'/0/0`; // BIP-86 for Taproot on testnet
//   const child = root.derivePath(path);

//   // Internal key (untweaked private/public key pair)
//   const internalPrivKey = child.privateKey!;
//   const internalPubKey = toXOnly(child.publicKey);

//   // Step 2: Create a Taproot address (P2TR)
//   const p2tr = bitcoin.payments.p2tr({
//     internalPubkey: internalPubKey,
//     network,
//   });
//   const taprootAddress = p2tr.address!;
//   console.log('Taproot Address:', taprootAddress);

//   // Step 3: Define UTXO to spend (replace with your actual UTXO details)
//   const utxo = {
//     txid: 'your_previous_txid_here', // Replace with the TXID of your funded UTXO
//     vout: 0, // Replace with the output index of your UTXO
//     value: 100000, // Replace with the amount in satoshis (e.g., 0.001 BTC)
//   };

//   // Step 4: Create a PSBT (Partially Signed Bitcoin Transaction)
//   const psbt = new bitcoin.Psbt({ network })
//     .addInput({
//       hash: utxo.txid,
//       index: utxo.vout,
//       witnessUtxo: {
//         script: p2tr.output!,
//         value: utxo.value,
//       },
//       tapInternalKey: internalPubKey,
//     })
//     .addOutput({
//       address: 'bc1q0zjuk6pmmznu2taaxqr7k397qkkqc4waeg6wuv', // Replace with recipient Taproot address
//       value: 90000, // Sending 0.0009 BTC (adjust based on fee and UTXO value)
//     });

//   // Step 5: Tweak the private key for signing (Taproot key-path spend)
//   const tweakedSigner = child.tweak(
//     bitcoin.crypto.taggedHash('TapTweak', internalPubKey)
//   );

//   // Step 6: Sign and finalize the transaction
//   psbt.signInput(0, tweakedSigner);
//   psbt.finalizeAllInputs();

//   // Step 7: Extract the raw transaction hex
//   const tx = psbt.extractTransaction();
//   const txHex = tx.toHex();
//   console.log('Transaction Hex:', txHex);

//   // Step 8: Broadcast the transaction (see notes below)
//   // You would typically send `txHex` to a Bitcoin node or API like Blockstream's
//   // await broadcastTransaction(txHex);
// }



export { hexToString, stringToHex, encodeToBase, decodeFromBase, generateWallet, getAddress };

