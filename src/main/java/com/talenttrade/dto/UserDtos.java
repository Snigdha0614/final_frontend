package com.talenttrade.dto;

import java.math.BigDecimal;

public class UserDtos {

    public static class UpdateProfileRequest {
        private String fullName;
        private String title;
        private String bio;
        private BigDecimal hourlyRate;
        private String location;
        private Boolean availableForTrade;
        private String avatarUrl;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public BigDecimal getHourlyRate() { return hourlyRate; }
        public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public Boolean getAvailableForTrade() { return availableForTrade; }
        public void setAvailableForTrade(Boolean availableForTrade) { this.availableForTrade = availableForTrade; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    public static class SkillRequest {
        private String name;
        private String level;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
    }

    public static class CertificationRequest {
        private String title;
        private String issuer;
        private String issueYear;
        private String credentialUrl;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
        public String getIssueYear() { return issueYear; }
        public void setIssueYear(String issueYear) { this.issueYear = issueYear; }
        public String getCredentialUrl() { return credentialUrl; }
        public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }
    }

    public static class PortfolioRequest {
        private String title;
        private String description;
        private String projectUrl;
        private String imageUrl;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getProjectUrl() { return projectUrl; }
        public void setProjectUrl(String projectUrl) { this.projectUrl = projectUrl; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}
