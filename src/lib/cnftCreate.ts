import { createTree, fetchMerkleTree, LeafSchema} from "@metaplex-foundation/mpl-bubblegum";
import {  PublicKey, Connection } from "@solana/web3.js";
import useUmiStore from "@/store/useUmiStore";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'
import {
    findLeafAssetIdPda,
    parseLeafFromMintV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";
import { SendTransactionError } from '@solana/web3.js';
import sendAndConfirmWalletAdapter from "@/lib/umi/sendAndConfirmWithWalletAdapter";
import { fetchTreeConfigFromSeeds } from "@metaplex-foundation/mpl-bubblegum";



export async function minCnft (){

    const { umi, signer } = useUmiStore.getState();

    if (!signer) {
        throw new Error("Wallet not connected. Please connect your wallet.");
    }


    const payer = signer.publicKey;

    const merkleTree = localStorage.getItem('merkleTree');

try{
    const mintBuilder = mintV1(umi, {
        leafOwner: publicKey(payer),
        merkleTree: merkleTree.publickey,
        metadata: {
            name: 'My Compressed NFT',
            uri: 'https://example.com/my-cnft.json',
            sellerFeeBasisPoints: 600,
            collection: null,
            creators: [
                { address: umi.identity.publicKey, verified: false, share: 100 },
            ],
        },
    });

    const { signature } = await sendAndConfirmWalletAdapter(
        mintBuilder,
        {
            commitment: 'finalized',
            skipPreflight: true
        }
    );
} catch (error) {
    if (error instanceof SendTransactionError) {
        console.error("Transaction failed: ", error.message);
    } else {
        throw error;
    }




}