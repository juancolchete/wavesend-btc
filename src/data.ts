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

export { hexToString, stringToHex, encodeToBase, decodeFromBase, generateWallet, getAddress };

