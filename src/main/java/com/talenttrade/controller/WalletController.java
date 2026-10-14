package com.talenttrade.controller;

import com.talenttrade.dto.OtherDtos;
import com.talenttrade.entity.Transaction;
import com.talenttrade.entity.User;
import com.talenttrade.entity.Wallet;
import com.talenttrade.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public ResponseEntity<Wallet> getWallet(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(walletService.getOrCreateWallet(principal));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(walletService.getTransactions(principal.getId()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Wallet> deposit(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody OtherDtos.WalletDepositRequest req) {
        return ResponseEntity.ok(walletService.deposit(principal, req.getAmount(), req.getPaymentMethod()));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Wallet> withdraw(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody OtherDtos.WalletWithdrawRequest req) {
        return ResponseEntity.ok(walletService.withdraw(principal, req.getAmount(), req.getBankAccount()));
    }
}
