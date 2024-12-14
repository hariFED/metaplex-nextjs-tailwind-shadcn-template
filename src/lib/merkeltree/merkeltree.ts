import {
    Connection,
    PublicKey,
    Signer,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
  } from "@solana/web3.js";

  
  export async function sendVersionedTx(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    signers: Signer[],
    signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
  ) {
    // Get the latest blockhash
    let latestBlockhash = await connection.getLatestBlockhash();
  
    // Create a legacy transaction message
    const messageLegacy = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToLegacyMessage();
  
    // Create a versioned transaction
    const transaction = new VersionedTransaction(messageLegacy);
  
    // Add signers for the transaction (if any)
    if (signers && signers.length > 0) {
      transaction.sign(signers);
    }
  
    // Use the wallet adapter to sign the transaction
    const signedTransaction = await signTransaction(transaction);
  
    // Send the signed transaction
    const signature = await connection.sendTransaction(signedTransaction);
    return signature;
  }
  