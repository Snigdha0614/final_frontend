package com.talenttrade.service;

import com.talenttrade.entity.Transaction;
import com.talenttrade.entity.User;
import com.talenttrade.entity.Wallet;
import com.talenttrade.repository.TransactionRepository;
import com.talenttrade.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    public Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet w = new Wallet(user, new BigDecimal("1000.00"));
                    return walletRepository.save(w);
                });
    }

    public List<Transaction> getTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Wallet deposit(User user, BigDecimal amount, String method) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        Wallet wallet = getOrCreateWallet(user);
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAmount(amount);
        tx.setType(Transaction.Type.DEPOSIT);
        tx.setStatus(Transaction.Status.COMPLETED);
        tx.setDescription("Simulated Deposit via " + (method != null ? method : "Bank Card"));
        tx.setReferenceId("DEP-" + System.currentTimeMillis());
        transactionRepository.save(tx);

        return wallet;
    }

    @Transactional
    public Wallet withdraw(User user, BigDecimal amount, String account) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        Wallet wallet = getOrCreateWallet(user);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAmount(amount);
        tx.setType(Transaction.Type.WITHDRAWAL);
        tx.setStatus(Transaction.Status.COMPLETED);
        tx.setDescription("Simulated Payout to account " + (account != null ? account : "Default Bank"));
        tx.setReferenceId("WTH-" + System.currentTimeMillis());
        transactionRepository.save(tx);

        return wallet;
    }

    @Transactional
    public void holdEscrow(User client, BigDecimal amount, String referenceId, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        Wallet wallet = getOrCreateWallet(client);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance for escrow hold. Please add funds to your wallet.");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setEscrowBalance(wallet.getEscrowBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setUser(client);
        tx.setAmount(amount);
        tx.setType(Transaction.Type.ESCROW_HOLD);
        tx.setStatus(Transaction.Status.COMPLETED);
        tx.setDescription("Escrow Hold: " + description);
        tx.setReferenceId(referenceId);
        transactionRepository.save(tx);
    }

    @Transactional
    public void releaseEscrow(User client, User freelancer, BigDecimal amount, String referenceId, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        Wallet clientWallet = getOrCreateWallet(client);
        Wallet freelancerWallet = getOrCreateWallet(freelancer);

        if (clientWallet.getEscrowBalance().compareTo(amount) < 0) {
            // If escrow was already depleted or lower, deduct whatever remains
            clientWallet.setEscrowBalance(BigDecimal.ZERO);
        } else {
            clientWallet.setEscrowBalance(clientWallet.getEscrowBalance().subtract(amount));
        }
        clientWallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(clientWallet);

        freelancerWallet.setBalance(freelancerWallet.getBalance().add(amount));
        freelancerWallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(freelancerWallet);

        // Transaction for client release
        Transaction txClient = new Transaction();
        txClient.setUser(client);
        txClient.setAmount(amount);
        txClient.setType(Transaction.Type.ESCROW_RELEASE);
        txClient.setStatus(Transaction.Status.COMPLETED);
        txClient.setDescription("Escrow Released to " + freelancer.getFullName() + ": " + description);
        txClient.setReferenceId(referenceId);
        transactionRepository.save(txClient);

        // Transaction for freelancer payment
        Transaction txFree = new Transaction();
        txFree.setUser(freelancer);
        txFree.setAmount(amount);
        txFree.setType(Transaction.Type.SERVICE_PAYMENT);
        txFree.setStatus(Transaction.Status.COMPLETED);
        txFree.setDescription("Payment Received from " + client.getFullName() + ": " + description);
        txFree.setReferenceId(referenceId);
        transactionRepository.save(txFree);
    }

    @Transactional
    public void refundEscrow(User client, BigDecimal amount, String referenceId, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        Wallet clientWallet = getOrCreateWallet(client);
        if (clientWallet.getEscrowBalance().compareTo(amount) >= 0) {
            clientWallet.setEscrowBalance(clientWallet.getEscrowBalance().subtract(amount));
        } else {
            clientWallet.setEscrowBalance(BigDecimal.ZERO);
        }
        clientWallet.setBalance(clientWallet.getBalance().add(amount));
        clientWallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(clientWallet);

        Transaction tx = new Transaction();
        tx.setUser(client);
        tx.setAmount(amount);
        tx.setType(Transaction.Type.REFUND);
        tx.setStatus(Transaction.Status.COMPLETED);
        tx.setDescription("Refund processed: " + description);
        tx.setReferenceId(referenceId);
        transactionRepository.save(tx);
    }
}
