package com.talenttrade.config;

import com.talenttrade.entity.*;
import com.talenttrade.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final ServiceListingRepository serviceRepository;
    private final ProjectRepository projectRepository;
    private final ProjectProposalRepository proposalRepository;
    private final SkillExchangeRepository exchangeRepository;
    private final ProjectWorkspaceRepository workspaceRepository;
    private final WorkspaceTaskRepository taskRepository;
    private final WorkspaceMessageRepository messageRepository;
    private final WorkspaceSubmissionRepository submissionRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           SkillRepository skillRepository,
                           CertificationRepository certificationRepository,
                           PortfolioItemRepository portfolioItemRepository,
                           ServiceListingRepository serviceRepository,
                           ProjectRepository projectRepository,
                           ProjectProposalRepository proposalRepository,
                           SkillExchangeRepository exchangeRepository,
                           ProjectWorkspaceRepository workspaceRepository,
                           WorkspaceTaskRepository taskRepository,
                           WorkspaceMessageRepository messageRepository,
                           WorkspaceSubmissionRepository submissionRepository,
                           WalletRepository walletRepository,
                           TransactionRepository transactionRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.portfolioItemRepository = portfolioItemRepository;
        this.serviceRepository = serviceRepository;
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.exchangeRepository = exchangeRepository;
        this.workspaceRepository = workspaceRepository;
        this.taskRepository = taskRepository;
        this.messageRepository = messageRepository;
        this.submissionRepository = submissionRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        String encodedPwd = passwordEncoder.encode("password123");

        // 1. Admin
        User admin = new User("admin@talenttrade.com", encodedPwd, "Platform Administrator", Role.ROLE_ADMIN);
        admin.setTitle("Head of Operations");
        admin.setLocation("San Francisco, CA");
        admin.setBio("Platform administrative supervisor overseeing user security, disputes, verification, and transaction integrity.");
        admin.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80");
        admin = userRepository.save(admin);
        createWallet(admin, new BigDecimal("10000.00"));

        // 2. Client
        User client = new User("sarah.client@talenttrade.com", encodedPwd, "Sarah Jenkins", Role.ROLE_CLIENT);
        client.setTitle("Product Director & Founder");
        client.setLocation("San Francisco, CA");
        client.setBio("Building high-growth AI and productivity SaaS products. Always hiring top tier engineers and designers.");
        client.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80");
        client = userRepository.save(client);
        createWallet(client, new BigDecimal("5000.00"));

        // 3. Freelancer 1: Alex Rivera (Full-Stack Engineer)
        User alex = new User("alex.dev@talenttrade.com", encodedPwd, "Alex Rivera", Role.ROLE_FREELANCER);
        alex.setTitle("Senior Full-Stack Architect | React & Spring Boot");
        alex.setLocation("Seattle, WA");
        alex.setBio("10+ years engineering modern reactive web systems, microservices, and slick React frontends. Avid advocate of skill bartering for UI design & creative assets.");
        alex.setHourlyRate(new BigDecimal("95.00"));
        alex.setAvailableForTrade(true);
        alex.setRatingAvg(4.95);
        alex.setReviewCount(38);
        alex.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        alex = userRepository.save(alex);
        createWallet(alex, new BigDecimal("2450.00"));

        skillRepository.save(new Skill("React & Vite", "Expert", alex));
        skillRepository.save(new Skill("Java & Spring Boot", "Expert", alex));
        skillRepository.save(new Skill("PostgreSQL & MySQL", "Expert", alex));
        skillRepository.save(new Skill("Tailwind CSS", "Expert", alex));
        skillRepository.save(new Skill("Docker & Cloud Deployments", "Intermediate", alex));

        certificationRepository.save(new Certification("AWS Certified Solutions Architect", "Amazon Web Services", "2024", "https://aws.amazon.com", alex));
        certificationRepository.save(new Certification("Spring Professional Certified", "VMware Tanzu", "2023", "https://spring.io", alex));

        portfolioItemRepository.save(new PortfolioItem("Fintech Analytics Dashboard", "High-throughput financial monitoring app built with Spring Boot and React Query.", "https://example.com/fintech", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", alex));
        portfolioItemRepository.save(new PortfolioItem("SaaS Cloud Orchestrator", "Multi-tenant cloud provisioner with real-time WebSocket logs and billing automation.", "https://example.com/cloud", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80", alex));

        // 4. Freelancer 2: Elena Vance (UI/UX & Brand Designer)
        User elena = new User("elena.design@talenttrade.com", encodedPwd, "Elena Vance", Role.ROLE_FREELANCER);
        elena.setTitle("Principal UI/UX & Design Systems Lead");
        elena.setLocation("New York, NY");
        elena.setBio("Crafting luxury, high-conversion interfaces and bespoke brand systems. Open to exchanging design work for backend engineering or AI integrations!");
        elena.setHourlyRate(new BigDecimal("110.00"));
        elena.setAvailableForTrade(true);
        elena.setRatingAvg(5.0);
        elena.setReviewCount(46);
        elena.setAvatarUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80");
        elena = userRepository.save(elena);
        createWallet(elena, new BigDecimal("3800.00"));

        skillRepository.save(new Skill("Figma & Design Systems", "Expert", elena));
        skillRepository.save(new Skill("UI/UX Prototyping", "Expert", elena));
        skillRepository.save(new Skill("Brand Identity & Typography", "Expert", elena));
        skillRepository.save(new Skill("Webflow Development", "Intermediate", elena));

        certificationRepository.save(new Certification("Nielsen Norman UX Master Certified", "NN/g", "2023", "https://nngroup.com", elena));
        portfolioItemRepository.save(new PortfolioItem("Minimalist Luxury E-Commerce", "Award-winning design system for a sustainable Swiss timepiece brand.", "https://example.com/luxury", "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80", elena));

        // 5. Freelancer 3: Marcus Chen (AI & Python Specialist)
        User marcus = new User("marcus.ai@talenttrade.com", encodedPwd, "Marcus Chen", Role.ROLE_FREELANCER);
        marcus.setTitle("AI & Machine Learning Systems Specialist");
        marcus.setLocation("Austin, TX");
        marcus.setBio("Specializing in Retrieval-Augmented Generation (RAG), fine-tuned LLM agents, and automated data pipelines. Interested in skill trades for copywriting & marketing.");
        marcus.setHourlyRate(new BigDecimal("125.00"));
        marcus.setAvailableForTrade(true);
        marcus.setRatingAvg(4.9);
        marcus.setReviewCount(24);
        marcus.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        marcus = userRepository.save(marcus);
        createWallet(marcus, new BigDecimal("1900.00"));

        skillRepository.save(new Skill("Python & FastAPI", "Expert", marcus));
        skillRepository.save(new Skill("LLMs & LangChain", "Expert", marcus));
        skillRepository.save(new Skill("Vector Databases (Pinecone/Chroma)", "Expert", marcus));

        // 6. Freelancer 4: Sophia Martinez (SEO & Copy Strategist)
        User sophia = new User("sophia.copy@talenttrade.com", encodedPwd, "Sophia Martinez", Role.ROLE_FREELANCER);
        sophia.setTitle("Senior B2B Copywriter & Content Strategist");
        sophia.setLocation("Chicago, IL");
        sophia.setBio("Transforming complex software capabilities into compelling, revenue-generating product stories and search-dominant SEO campaigns.");
        sophia.setHourlyRate(new BigDecimal("80.00"));
        sophia.setAvailableForTrade(true);
        sophia.setRatingAvg(4.88);
        sophia.setReviewCount(31);
        sophia.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80");
        sophia = userRepository.save(sophia);
        createWallet(sophia, new BigDecimal("1400.00"));

        skillRepository.save(new Skill("Conversion Copywriting", "Expert", sophia));
        skillRepository.save(new Skill("Technical SEO", "Expert", sophia));
        skillRepository.save(new Skill("Brand Storytelling", "Expert", sophia));

        // 7. Seed Services
        ServiceListing srv1 = new ServiceListing();
        srv1.setTitle("Full-Stack Web App Development (React + Spring Boot)");
        srv1.setDescription("End-to-end production-grade web application built with clean architecture, responsive Tailwind styling, secure JWT authentication, and optimized database queries.");
        srv1.setCategory("Web Development");
        srv1.setPrice(new BigDecimal("1200.00"));
        srv1.setDeliveryDays(14);
        srv1.setRevisionsAllowed(4);
        srv1.setSeller(alex);
        srv1.setRatingAvg(5.0);
        srv1.setReviewCount(19);
        srv1.setTags("React, Spring Boot, MySQL, REST API, Tailwind");
        srv1.setImageUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80");
        srv1.setFeatured(true);
        serviceRepository.save(srv1);

        ServiceListing srv2 = new ServiceListing();
        srv2.setTitle("Executive SaaS UI/UX Design System & Figma Prototype");
        srv2.setDescription("World-class user interface design with complete auto-layout component library, responsive tokens, interactive high-fidelity prototype, and handoff documentation.");
        srv2.setCategory("UI/UX Design");
        srv2.setPrice(new BigDecimal("850.00"));
        srv2.setDeliveryDays(7);
        srv2.setRevisionsAllowed(5);
        srv2.setSeller(elena);
        srv2.setRatingAvg(5.0);
        srv2.setReviewCount(28);
        srv2.setTags("Figma, UI/UX, Design Systems, Mobile, SaaS");
        srv2.setImageUrl("https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80");
        srv2.setFeatured(true);
        serviceRepository.save(srv2);

        ServiceListing srv3 = new ServiceListing();
        srv3.setTitle("Custom AI Agent & RAG Pipeline Integration");
        srv3.setDescription("Build an intelligent autonomous AI pipeline connected to your internal documents or APIs. Includes semantic search, prompt engineering, and production latency optimization.");
        srv3.setCategory("AI & Machine Learning");
        srv3.setPrice(new BigDecimal("950.00"));
        srv3.setDeliveryDays(10);
        srv3.setRevisionsAllowed(3);
        srv3.setSeller(marcus);
        srv3.setRatingAvg(4.9);
        srv3.setReviewCount(14);
        srv3.setTags("AI, LLMs, Python, LangChain, RAG");
        srv3.setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80");
        srv3.setFeatured(true);
        serviceRepository.save(srv3);

        ServiceListing srv4 = new ServiceListing();
        srv4.setTitle("High-Converting B2B SaaS Landing Page Copy & SEO");
        srv4.setDescription("Position your product powerfully. Complete messaging hierarchy, pain-point hooks, benefit-driven sections, social proof placement, and keyword-optimized metadata.");
        srv4.setCategory("Content & Copywriting");
        srv4.setPrice(new BigDecimal("450.00"));
        srv4.setDeliveryDays(5);
        srv4.setRevisionsAllowed(3);
        srv4.setSeller(sophia);
        srv4.setRatingAvg(4.9);
        srv4.setReviewCount(22);
        srv4.setTags("Copywriting, SEO, Landing Page, SaaS Marketing");
        srv4.setImageUrl("https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80");
        serviceRepository.save(srv4);

        // 8. Seed Projects
        Project proj1 = new Project();
        proj1.setTitle("Enterprise Cloud Resource Dashboard with Real-Time Metrics");
        proj1.setDescription("Looking for an experienced full-stack engineer to build a comprehensive metrics dashboard. Must feature server utilization charts, user permission controls, and API webhook integrations.");
        proj1.setCategory("Web Development");
        proj1.setBudgetType(Project.BudgetType.FIXED_PRICE);
        proj1.setFixedBudget(new BigDecimal("2200.00"));
        proj1.setDeadline(LocalDate.now().plusDays(25));
        proj1.setRequiredSkills("React, Spring Boot, MySQL, REST APIs");
        proj1.setClient(client);
        proj1.setStatus(Project.Status.OPEN);
        proj1 = projectRepository.save(proj1);

        ProjectProposal prop1 = new ProjectProposal();
        prop1.setProject(proj1);
        prop1.setFreelancer(alex);
        prop1.setCoverLetter("Hi Sarah! I've engineered several enterprise monitoring dashboards with React and Spring Boot. I have an established modular architecture that guarantees snappy renders and robust security.");
        prop1.setBidAmount(new BigDecimal("2100.00"));
        prop1.setDeliveryDays(18);
        prop1.setStatus(ProjectProposal.Status.PENDING);
        proposalRepository.save(prop1);
        proj1.setProposalCount(1);
        projectRepository.save(proj1);

        Project proj2 = new Project();
        proj2.setTitle("Mobile App Prototype & Visual Identity System");
        proj2.setDescription("Seeking a world-class UI/UX designer to craft a 20-screen mobile app prototype in Figma alongside a cohesive typography and color palette. Also open to trading with full-stack engineering support!");
        proj2.setCategory("UI/UX Design");
        proj2.setBudgetType(Project.BudgetType.SKILL_EXCHANGE);
        proj2.setRequiredSkills("Figma, Mobile UI, Design Systems");
        proj2.setDeadline(LocalDate.now().plusDays(30));
        proj2.setClient(client);
        proj2.setStatus(Project.Status.OPEN);
        projectRepository.save(proj2);

        // 9. Seed Skill Exchanges
        // Pure Barter: Alex (Full-Stack dev) <-> Elena (Figma Design)
        SkillExchange exch1 = new SkillExchange();
        exch1.setInitiator(alex);
        exch1.setReceiver(elena);
        exch1.setExchangeType(SkillExchange.ExchangeType.FREE_SKILL_EXCHANGE);
        exch1.setOfferedSkillTitle("REST API & Custom Database Integration");
        exch1.setOfferedSkillDescription("I will implement a robust backend REST API and authentication system for your client's web portal.");
        exch1.setRequestedSkillTitle("Portfolio Website UI/UX Redesign in Figma");
        exch1.setRequestedSkillDescription("In return, please design an ultra-sleek, minimalist portfolio layout with mobile variants in Figma.");
        exch1.setCashCompensation(BigDecimal.ZERO);
        exch1.setCompensationPayer(SkillExchange.CompensationPayer.NONE);
        exch1.setTermsNote("Pure 1-to-1 skill barter. Mutual estimated effort: ~15 hours each.");
        exch1.setDeadline(LocalDate.now().plusDays(14));
        exch1.setStatus(SkillExchange.Status.ACCEPTED);
        exch1 = exchangeRepository.save(exch1);

        // Hybrid Exchange with cash compensation: Marcus (AI) <-> Sophia (Copy + $250)
        SkillExchange exch2 = new SkillExchange();
        exch2.setInitiator(sophia);
        exch2.setReceiver(marcus);
        exch2.setExchangeType(SkillExchange.ExchangeType.HYBRID_WITH_PAYMENT);
        exch2.setOfferedSkillTitle("Comprehensive SEO & Conversion Copywriting");
        exch2.setOfferedSkillDescription("Complete messaging audit and rewritten copy for your AI consultancy website.");
        exch2.setRequestedSkillTitle("Automated PDF Document Summarizer AI Agent");
        exch2.setRequestedSkillDescription("A custom Python LangChain script that reads multi-page PDFs and outputs executive summaries.");
        exch2.setCashCompensation(new BigDecimal("250.00"));
        exch2.setCompensationPayer(SkillExchange.CompensationPayer.INITIATOR);
        exch2.setTermsNote("Includes $250 bonus cash top-up from Sophia to account for specialized AI compute setup.");
        exch2.setDeadline(LocalDate.now().plusDays(20));
        exch2.setStatus(SkillExchange.Status.PENDING);
        exchangeRepository.save(exch2);

        // 10. Seed Active Project Workspace
        ProjectWorkspace ws1 = new ProjectWorkspace();
        ws1.setTitle("Enterprise Cloud Resource Dashboard");
        ws1.setWorkspaceType(ProjectWorkspace.WorkspaceType.PROJECT_CONTRACT);
        ws1.setClient(client);
        ws1.setFreelancer(alex);
        ws1.setProject(proj1);
        ws1.setStatus(ProjectWorkspace.Status.ACTIVE);
        ws1.setProgressPercent(60);
        ws1.setEscrowAmount(new BigDecimal("2100.00"));
        ws1 = workspaceRepository.save(ws1);

        WorkspaceTask t1 = new WorkspaceTask();
        t1.setWorkspace(ws1);
        t1.setTitle("Design DB Schema & Entity Relationships");
        t1.setDescription("Set up JPA entities, MySQL migrations, and foreign key indexes.");
        t1.setAssignedTo(alex);
        t1.setStatus(WorkspaceTask.Status.DONE);
        t1.setDueDate(LocalDate.now().minusDays(3));
        taskRepository.save(t1);

        WorkspaceTask t2 = new WorkspaceTask();
        t2.setWorkspace(ws1);
        t2.setTitle("Develop Secure REST APIs & JWT Middleware");
        t2.setDescription("Endpoints for metric telemetry, auth, and user roles.");
        t2.setAssignedTo(alex);
        t2.setStatus(WorkspaceTask.Status.DONE);
        t2.setDueDate(LocalDate.now().minusDays(1));
        taskRepository.save(t2);

        WorkspaceTask t3 = new WorkspaceTask();
        t3.setWorkspace(ws1);
        t3.setTitle("Implement React Interactive Charts & Filters");
        t3.setDescription("Connect dashboard cards with live filtering and smooth transitions.");
        t3.setAssignedTo(alex);
        t3.setStatus(WorkspaceTask.Status.IN_PROGRESS);
        t3.setDueDate(LocalDate.now().plusDays(4));
        taskRepository.save(t3);

        WorkspaceMessage m1 = new WorkspaceMessage();
        m1.setWorkspace(ws1);
        m1.setSender(client);
        m1.setMessage("Welcome to the project Alex! Super excited to work together on this dashboard.");
        m1.setCreatedAt(LocalDateTime.now().minusDays(5));
        messageRepository.save(m1);

        WorkspaceMessage m2 = new WorkspaceMessage();
        m2.setWorkspace(ws1);
        m2.setSender(alex);
        m2.setMessage("Thanks Sarah! The database schema and core JWT APIs are complete. Working on the frontend charts now.");
        m2.setCreatedAt(LocalDateTime.now().minusDays(2));
        messageRepository.save(m2);

        WorkspaceSubmission sub1 = new WorkspaceSubmission();
        sub1.setWorkspace(ws1);
        sub1.setSubmitter(alex);
        sub1.setSubmissionNotes("Milestone 1 Deliverable: Backend REST APIs tested and verified, plus initial frontend wireframe preview.");
        sub1.setDeliverableUrl("https://github.com/talenttrade/milestone-1");
        sub1.setDeliverableFileName("Backend_API_Specs_v1.zip");
        sub1.setStatus(WorkspaceSubmission.Status.APPROVED);
        sub1.setRevisionFeedback("Looks outstanding! Approved for Milestone 2.");
        sub1.setReviewedAt(LocalDateTime.now().minusDays(1));
        submissionRepository.save(sub1);

        // 11. Seed Reviews
        Review r1 = new Review();
        r1.setReviewer(client);
        r1.setReviewee(alex);
        r1.setServiceListing(srv1);
        r1.setRating(5);
        r1.setComment("Alex is an absolute rockstar. Clean code, punctual delivery, and great architectural communication!");
        reviewRepository.save(r1);

        Review r2 = new Review();
        r2.setReviewer(client);
        r2.setReviewee(elena);
        r2.setServiceListing(srv2);
        r2.setRating(5);
        r2.setComment("Elena delivered the most elegant design system our company has ever seen. Worth every penny.");
        reviewRepository.save(r2);
    }

    private void createWallet(User user, BigDecimal balance) {
        Wallet wallet = new Wallet(user, balance);
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAmount(balance);
        tx.setType(Transaction.Type.DEPOSIT);
        tx.setStatus(Transaction.Status.COMPLETED);
        tx.setDescription("Initial Account Provisioning");
        tx.setReferenceId("INIT-" + user.getId());
        transactionRepository.save(tx);
    }
}
