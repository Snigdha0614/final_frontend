package com.talenttrade.service;

import com.talenttrade.config.JwtTokenProvider;
import com.talenttrade.dto.AuthDtos;
import com.talenttrade.entity.Role;
import com.talenttrade.entity.User;
import com.talenttrade.entity.Wallet;
import com.talenttrade.repository.UserRepository;
import com.talenttrade.repository.WalletRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       WalletRepository walletRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_FREELANCER);
        user.setTitle(request.getTitle() != null ? request.getTitle() : "Talent Member");
        user.setLocation(request.getLocation() != null ? request.getLocation() : "Remote");
        user.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        user = userRepository.save(user);

        // Create default wallet with initial simulated funds ($1,000 for client or general use)
        Wallet wallet = new Wallet(user, new BigDecimal("1000.00"));
        walletRepository.save(wallet);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthDtos.AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getAvatarUrl(), user.getTitle());
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthDtos.AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getAvatarUrl(), user.getTitle());
    }
}
