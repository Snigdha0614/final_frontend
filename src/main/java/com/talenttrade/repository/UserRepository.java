package com.talenttrade.repository;

import com.talenttrade.entity.Role;
import com.talenttrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.bio) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<User> searchFreelancers(@Param("role") Role role, @Param("keyword") String keyword);
}
