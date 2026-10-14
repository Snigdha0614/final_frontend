package com.talenttrade.service;

import com.talenttrade.dto.UserDtos;
import com.talenttrade.entity.*;
import com.talenttrade.repository.CertificationRepository;
import com.talenttrade.repository.PortfolioItemRepository;
import com.talenttrade.repository.SkillRepository;
import com.talenttrade.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final PortfolioItemRepository portfolioItemRepository;

    public UserService(UserRepository userRepository,
                       SkillRepository skillRepository,
                       CertificationRepository certificationRepository,
                       PortfolioItemRepository portfolioItemRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.portfolioItemRepository = portfolioItemRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public List<User> getFreelancers(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return userRepository.searchFreelancers(Role.ROLE_FREELANCER, keyword.trim());
        }
        return userRepository.findByRole(Role.ROLE_FREELANCER);
    }

    @Transactional
    public User updateProfile(Long userId, UserDtos.UpdateProfileRequest req) {
        User user = getUserById(userId);
        if (req.getFullName() != null) user.setFullName(req.getFullName().trim());
        if (req.getTitle() != null) user.setTitle(req.getTitle().trim());
        if (req.getBio() != null) user.setBio(req.getBio().trim());
        if (req.getHourlyRate() != null) user.setHourlyRate(req.getHourlyRate());
        if (req.getLocation() != null) user.setLocation(req.getLocation().trim());
        if (req.getAvailableForTrade() != null) user.setAvailableForTrade(req.getAvailableForTrade());
        if (req.getAvatarUrl() != null) user.setAvatarUrl(req.getAvatarUrl());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public Skill addSkill(Long userId, UserDtos.SkillRequest req) {
        User user = getUserById(userId);
        Skill skill = new Skill(req.getName(), req.getLevel() != null ? req.getLevel() : "Intermediate", user);
        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));
        if (!skill.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        skillRepository.delete(skill);
    }

    @Transactional
    public Certification addCertification(Long userId, UserDtos.CertificationRequest req) {
        User user = getUserById(userId);
        Certification cert = new Certification(req.getTitle(), req.getIssuer(), req.getIssueYear(), req.getCredentialUrl(), user);
        return certificationRepository.save(cert);
    }

    @Transactional
    public void deleteCertification(Long userId, Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found"));
        if (!cert.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        certificationRepository.delete(cert);
    }

    @Transactional
    public PortfolioItem addPortfolioItem(Long userId, UserDtos.PortfolioRequest req) {
        User user = getUserById(userId);
        PortfolioItem item = new PortfolioItem(req.getTitle(), req.getDescription(), req.getProjectUrl(), req.getImageUrl(), user);
        return portfolioItemRepository.save(item);
    }

    @Transactional
    public void deletePortfolioItem(Long userId, Long itemId) {
        PortfolioItem item = portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio item not found"));
        if (!item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        portfolioItemRepository.delete(item);
    }
}
