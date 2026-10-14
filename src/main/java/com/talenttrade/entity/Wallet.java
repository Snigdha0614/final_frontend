package com.talenttrade.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private BigDecimal balance = new BigDecimal("1000.00"); // default initial simulated funds

    private BigDecimal escrowBalance = BigDecimal.ZERO;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Wallet() {}

    public Wallet(User user, BigDecimal balance) {
        this.user = user;
        this.balance = balance;
        this.escrowBalance = BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getEscrowBalance() { return escrowBalance; }
    public void setEscrowBalance(BigDecimal escrowBalance) { this.escrowBalance = escrowBalance; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
