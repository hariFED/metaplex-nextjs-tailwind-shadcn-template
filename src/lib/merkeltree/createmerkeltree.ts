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

export async function createTreeMerkle() {
    const { umi, signer } = useUmiStore.getState();
    const connection = new Connection("https://api.devnet.solana.com");

    if (!signer) {
        throw new Error("Wallet not connected. Please connect your wallet.");
    }

    const payer = signer.publicKey;
    
    const merkleTree = generateSigner(umi);

    try {
        console.log('Creating Tree...');
        console.log('Merkle tree public key that will be used:', merkleTree.publicKey);
        
        const treeBuilder = await createTree(umi, {
            merkleTree: {
                publicKey: merkleTree.publicKey,
                signTransaction: merkleTree.signTransaction,
                signAllTransactions: merkleTree.signAllTransactions,
                signMessage: merkleTree.signMessage,
            },
            maxDepth: 14,
            maxBufferSize: 64,
            canopyDepth: 8,
            public: false,
        });

        console.log('TreeBuilder transaction:', treeBuilder);

        const { signature: treeSignature } = await sendAndConfirmWalletAdapter(
            treeBuilder,
            {
                commitment: 'finalized',
                skipPreflight: true
            }
        );

        console.log('Tree creation signature:', treeSignature);
        
        // Check transaction status
        const status = await connection.getSignatureStatus(treeSignature[0]);
        console.log('Transaction status:', status);

        // Verify the transaction details
        const txDetails = await connection.getTransaction(treeSignature[0], {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
        });
        console.log('Transaction details:', txDetails);

        console.log('Tree created with public key:', merkleTree.publicKey);

        // Increase retries and delay
        const maxRetries = 20; // Increased to 20 attempts
        let merkleTreeAccount = null;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                // Increase wait time to 5 seconds
                await new Promise((resolve) => setTimeout(resolve, 5000));
                
                console.log(`Attempt ${i + 1}: Fetching Merkle tree account for public key:`, merkleTree.publicKey);
                merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
                
                if (merkleTreeAccount) {
                    console.log('Successfully fetched Merkle tree account');
                    break;
                }
            } catch (e) {
                console.log(`Attempt ${i + 1} failed with error:`, e);
                if (i === maxRetries - 1) {
                    console.error('All attempts to fetch Merkle tree account failed');
                    console.error('Last error:', e);
                    throw new Error('Failed to fetch Merkle tree account after multiple attempts');
                }
            }
        }

        console.log('Merkle Tree Account:', merkleTreeAccount);

        // Similarly update the tree config fetching
        let merkleTreeConfig = null;
        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`Attempt ${i + 1}: Fetching tree config for public key:`, merkleTree.publicKey);
                merkleTreeConfig = await fetchTreeConfigFromSeeds(umi, {
                    merkleTree: merkleTree.publicKey
                });
                
                if (merkleTreeConfig) {
                    console.log('Successfully fetched tree config');
                    break;
                }
            } catch (e) {
                console.log(`Attempt ${i + 1} failed with error:`, e);
                if (i === maxRetries - 1) {
                    console.error('All attempts to fetch tree config failed');
                    console.error('Last error:', e);
                    throw new Error('Failed to fetch tree config after multiple attempts');
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }

        console.log('Merkle Tree Config:', merkleTreeConfig);

        console.log('Minting NFT...');
        const mintBuilder = mintV1(umi, {
            leafOwner: publicKey(payer),
            merkleTree: merkleTree.publicKey,
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

        // Convert signature to string if it's an array
        const signatureStr = Array.isArray(signature) ? signature[0] : signature;
        console.log('Mint transaction signature:', signatureStr);

        // Wait for confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Get the asset ID using findLeafAssetIdPda instead
            const assetId = findLeafAssetIdPda(umi, {
                merkleTree: merkleTree.publicKey,
                leafIndex: 0, // First leaf in the tree
            });
            
            console.log('Asset ID:', assetId);
            
            // If you need the full leaf data, you can fetch it separately
            const leafData = await fetchMerkleTree(umi, merkleTree.publicKey);
            console.log('Leaf Data:', leafData);
            
        } catch (error) {
            console.error('Error getting asset details:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
