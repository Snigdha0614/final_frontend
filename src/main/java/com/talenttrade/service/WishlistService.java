package com.talenttrade.service;

import com.talenttrade.entity.Project;
import com.talenttrade.entity.ServiceListing;
import com.talenttrade.entity.User;
import com.talenttrade.entity.Wishlist;
import com.talenttrade.repository.ProjectRepository;
import com.talenttrade.repository.ServiceListingRepository;
import com.talenttrade.repository.UserRepository;
import com.talenttrade.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ServiceListingRepository serviceRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           ServiceListingRepository serviceRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.serviceRepository = serviceRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public boolean toggleServiceWishlist(Long userId, Long serviceId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndServiceListingId(userId, serviceId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false; // removed
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            ServiceListing service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Service not found"));
            Wishlist item = new Wishlist();
            item.setUser(user);
            item.setServiceListing(service);
            wishlistRepository.save(item);
            return true; // added
        }
    }

    @Transactional
    public boolean toggleProjectWishlist(Long userId, Long projectId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProjectId(userId, projectId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false;
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));
            Wishlist item = new Wishlist();
            item.setUser(user);
            item.setProject(project);
            wishlistRepository.save(item);
            return true;
        }
    }
}
