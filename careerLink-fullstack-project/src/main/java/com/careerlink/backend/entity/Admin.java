package com.careerlink.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

/**
 * Admin - concrete subtype of User.
 * INHERITANCE + POLYMORPHISM: same base contract, admin-specific behaviour.
 */
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @Column(name = "admin_level")
    private String adminLevel; // e.g. MODERATOR, SUPER_ADMIN

    @JsonIgnore
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<ModerationLog> moderationLogs = new ArrayList<>();

    protected Admin() {
        super();
    }

    public Admin(String firstName, String lastName, String email, String passwordHash, String adminLevel) {
        super(firstName, lastName, email, passwordHash);
        this.adminLevel = adminLevel;
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public String getDashboardSummary() {
        return String.format("%s (%s) has processed %d moderation action(s).",
                getFullName(), adminLevel, moderationLogs.size());
    }

    // Admin is the one role allowed to override the default login rule:
    // even a banned Admin account can still log in read-only to hand off
    // its duties - a concrete example of overriding a NON-abstract parent
    // method to change inherited behaviour (polymorphism again).
    @Override
    public boolean canLogIn() {
        return true;
    }

    public String getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }

    public List<ModerationLog> getModerationLogs() {
        return moderationLogs;
    }
}
