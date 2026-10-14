package com.careerlink.backend.entity;

import com.careerlink.backend.entity.enums.AccountStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User is the abstract superclass of the ISA hierarchy in the CareerLink EER
 * model (User -> JobSeeker | Staff | Admin).
 *
 * ABSTRACTION: this class can never be instantiated directly (it is declared
 * abstract) and it exposes abstract behaviour (getRole, getDashboardSummary)
 * that every concrete subtype is forced to define in its own way.
 *
 * ENCAPSULATION: every field is private; the outside world only interacts
 * with a User through the getters/setters and behaviour methods below, so
 * internal representation can change without breaking callers.
 *
 * INHERITANCE: JobSeeker, Staff and Admin all extend this class and
 * inherit UserID, Name, Email, PasswordHash, ContactNo, ProfilePicture,
 * RegisteredDate and AccountStatus for free.
 *
 * Email and ContactNo are multivalued attributes in the EER diagram, so each
 * one lives in its own collection table (user_emails, user_contact_numbers).
 * The first email in the list is the primary one used to log in.
 */
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // composite attribute Name -> FirstName / LastName
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    // multivalued attribute Email -> own collection table (first = primary)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_emails", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "position")
    @Column(name = "email", nullable = false, unique = true)
    private List<String> emails = new ArrayList<>();

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    // multivalued attribute ContactNo -> own collection table
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_contact_numbers", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "position")
    @Column(name = "contact_no")
    private List<String> contactNumbers = new ArrayList<>();

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status")
    private AccountStatus accountStatus;

    @Column(name = "age")
    private Integer age;

    protected User() {
        // JPA requires a no-arg constructor
        this.registeredDate = LocalDateTime.now();
        this.accountStatus = AccountStatus.ACTIVE;
    }

    protected User(String firstName, String lastName, String email, String passwordHash) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.emails.add(email);
        this.passwordHash = passwordHash;
    }

    // ---- ABSTRACTION / POLYMORPHISM CONTRACT --------------------------------
    // Every subclass MUST provide its own answer to "what role am I?" and
    // "what does my dashboard look like?". Calling code can hold a plain
    // `User` reference and call these two methods without ever knowing (or
    // caring) whether the real object underneath is a JobSeeker, a
    // Staff member or an Admin - that is runtime polymorphism.
    public abstract String getRole();

    public abstract String getDashboardSummary();

    // A concrete (non-abstract) method that subclasses share as-is, but MAY
    // override if a role ever needs special banning behaviour - another
    // polymorphism hook, this time with a sensible default implementation.
    public boolean canLogIn() {
        return this.accountStatus == AccountStatus.ACTIVE;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    // ---- ENCAPSULATED ACCESSORS ---------------------------------------------
    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        List<String> copy = new ArrayList<>(emails);
        this.emails.clear();
        this.emails.addAll(copy);
    }

    // the first email is the primary one
    public String getPrimaryEmail() {
        return emails.isEmpty() ? null : emails.get(0);
    }

    @JsonIgnore
    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public List<String> getContactNumbers() {
        return contactNumbers;
    }

    public void setContactNumbers(List<String> contactNumbers) {
        List<String> copy = new ArrayList<>(contactNumbers);
        this.contactNumbers.clear();
        this.contactNumbers.addAll(copy);
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public LocalDateTime getRegisteredDate() {
        return registeredDate;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
