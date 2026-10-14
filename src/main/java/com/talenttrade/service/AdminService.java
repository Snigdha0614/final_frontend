package com.talenttrade.service;

import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceListingRepository serviceRepository;
    private final ProjectRepository projectRepository;
    private final SkillExchangeRepository exchangeRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final DisputeRepository disputeRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(UserRepository userRepository,
                        ServiceListingRepository serviceRepository,
                        ProjectRepository projectRepository,
                        SkillExchangeRepository exchangeRepository,
                        ProjectWorkspaceRepository workspaceRepository,
                        DisputeRepository disputeRepository,
                        TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.projectRepository = projectRepository;
        this.exchangeRepository = exchangeRepository;
        this.workspaceRepository = workspaceRepository;
        this.disputeRepository = disputeRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalServices", serviceRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalExchanges", exchangeRepository.count());
        stats.put("totalWorkspaces", workspaceRepository.count());
        stats.put("openDisputes", disputeRepository.findByStatus(Dispute.Status.OPEN).size());

        List<Transaction> transactions = transactionRepository.findAll();
        BigDecimal volume = transactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalVolume", volume);
        stats.put("totalTransactions", transactions.size());

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public List<ServiceListing> getAllServices() {
        return serviceRepository.findAll();
    }

    @Transactional
    public ServiceListing toggleServiceStatus(Long serviceId) {
        ServiceListing service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));
        service.setActive(!service.isActive());
        return serviceRepository.save(service);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<SkillExchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }
}
