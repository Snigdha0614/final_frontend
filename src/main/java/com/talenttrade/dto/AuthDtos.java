package com.talenttrade.dto;

import com.talenttrade.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotNull(message = "Role is required")
        private Role role;

        private String title;
        private String location;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class AuthResponse {
        private String token;
        private Long id;
        private String email;
        private String fullName;
        private Role role;
        private String avatarUrl;
        private String title;

        public AuthResponse(String token, Long id, String email, String fullName, Role role, String avatarUrl, String title) {
            this.token = token;
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.avatarUrl = avatarUrl;
            this.title = title;
        }

        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public Role getRole() { return role; }
        public String getAvatarUrl() { return avatarUrl; }
        public String getTitle() { return title; }
    }
}
