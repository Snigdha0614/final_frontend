package com.talenttrade.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "certifications")
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 150)
    private String issuer;

    @Column(length = 20)
    private String issueYear;

    @Column(length = 500)
    private String credentialUrl;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Certification() {}

    public Certification(String title, String issuer, String issueYear, String credentialUrl, User user) {
        this.title = title;
        this.issuer = issuer;
        this.issueYear = issueYear;
        this.credentialUrl = credentialUrl;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getIssueYear() { return issueYear; }
    public void setIssueYear(String issueYear) { this.issueYear = issueYear; }

    public String getCredentialUrl() { return credentialUrl; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
