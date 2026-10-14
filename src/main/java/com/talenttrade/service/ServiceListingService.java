package com.talenttrade.service;

import com.talenttrade.dto.ServiceDtos;
import com.talenttrade.entity.ServiceListing;
import com.talenttrade.entity.User;
import com.talenttrade.repository.ServiceListingRepository;
import com.talenttrade.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceListingService {

    private final ServiceListingRepository serviceRepository;
    private final UserRepository userRepository;

    public ServiceListingService(ServiceListingRepository serviceRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public List<ServiceListing> getAllActiveServices() {
        return serviceRepository.findByActiveTrue();
    }

    public ServiceListing getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service listing not found with id: " + id));
    }

    public List<ServiceListing> filterServices(String category, BigDecimal minPrice, BigDecimal maxPrice, String search) {
        return serviceRepository.filterServices(category, minPrice, maxPrice, search);
    }

    public List<String> getCategories() {
        return serviceRepository.findDistinctCategories();
    }

    public List<ServiceListing> getServicesBySeller(Long sellerId) {
        return serviceRepository.findBySellerId(sellerId);
    }

    @Transactional
    public ServiceListing createService(Long sellerId, ServiceDtos.CreateServiceRequest req) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        ServiceListing service = new ServiceListing();
        service.setTitle(req.getTitle().trim());
        service.setDescription(req.getDescription().trim());
        service.setCategory(req.getCategory().trim());
        service.setPrice(req.getPrice());
        service.setDeliveryDays(req.getDeliveryDays());
        service.setRevisionsAllowed(req.getRevisionsAllowed() != null ? req.getRevisionsAllowed() : 3);
        service.setSeller(seller);
        service.setTags(req.getTags());
        service.setImageUrl(req.getImageUrl() != null && !req.getImageUrl().trim().isEmpty() ?
                req.getImageUrl() : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80");
        service.setActive(true);

        return serviceRepository.save(service);
    }

    @Transactional
    public ServiceListing updateService(Long serviceId, Long sellerId, ServiceDtos.CreateServiceRequest req) {
        ServiceListing service = getServiceById(serviceId);
        if (!service.getSeller().getId().equals(sellerId)) {
            throw new IllegalArgumentException("Unauthorized to modify this service");
        }

        service.setTitle(req.getTitle().trim());
        service.setDescription(req.getDescription().trim());
        service.setCategory(req.getCategory().trim());
        service.setPrice(req.getPrice());
        service.setDeliveryDays(req.getDeliveryDays());
        if (req.getRevisionsAllowed() != null) service.setRevisionsAllowed(req.getRevisionsAllowed());
        if (req.getTags() != null) service.setTags(req.getTags());
        if (req.getImageUrl() != null) service.setImageUrl(req.getImageUrl());
        service.setUpdatedAt(LocalDateTime.now());

        return serviceRepository.save(service);
    }

    @Transactional
    public void deleteService(Long serviceId, Long sellerId) {
        ServiceListing service = getServiceById(serviceId);
        if (!service.getSeller().getId().equals(sellerId)) {
            throw new IllegalArgumentException("Unauthorized to delete this service");
        }
        service.setActive(false);
        serviceRepository.save(service);
    }
}
