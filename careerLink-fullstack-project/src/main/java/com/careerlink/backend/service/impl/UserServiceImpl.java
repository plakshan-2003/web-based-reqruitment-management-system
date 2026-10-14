package com.careerlink.backend.service.impl;

import com.careerlink.backend.exception.ResourceNotFoundException;
import com.careerlink.backend.entity.*;
import com.careerlink.backend.entity.enums.AccountStatus;
import com.careerlink.backend.repository.UserRepository;
import com.careerlink.backend.service.UserService;
import com.careerlink.backend.repository.NotificationRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public JobSeeker registerJobSeeker(String firstName, String lastName, String email, String rawPassword) {
        validateRegistration(email, rawPassword);
        JobSeeker jobSeeker = new JobSeeker(firstName, lastName, email, passwordEncoder.encode(rawPassword));
        return (JobSeeker) userRepository.save(jobSeeker);
    }

    @Override
    public Staff registerStaff(String firstName, String lastName, String email, String rawPassword,
                               String jobTitle, String departmentName) {
        validateRegistration(email, rawPassword);
        Staff staff = new Staff(firstName, lastName, email, passwordEncoder.encode(rawPassword), jobTitle, departmentName);
        return (Staff) userRepository.save(staff);
    }

    @Override
    public Admin registerAdmin(String firstName, String lastName, String email, String rawPassword, String adminLevel) {
        validateRegistration(email, rawPassword);
        Admin admin = new Admin(firstName, lastName, email, passwordEncoder.encode(rawPassword), adminLevel);
        return (Admin) userRepository.save(admin);
    }

    @Override
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found for " + email));

        // POLYMORPHISM: canLogIn() runs Admin's overridden version for an
        // Admin, and User's default version for everyone else - the calling
        // code here has no idea which one actually executes.
        if (!user.canLogIn()) {
            throw new IllegalStateException("This account is banned and cannot log in.");
        }
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password.");
        }
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        return getUserOrThrow(userId);
    }

    @Override
    @Transactional
    public User updateProfile(Long userId, Map<String, Object> fields) {
        User user = getUserOrThrow(userId);

        if (fields.containsKey("firstName")) {
            user.setFirstName(requireText(asString(fields.get("firstName")), "First name"));
        }
        if (fields.containsKey("lastName")) {
            user.setLastName(requireText(asString(fields.get("lastName")), "Last name"));
        }
        if (fields.containsKey("profilePicture")) {
            user.setProfilePicture(asString(fields.get("profilePicture")));
        }
        // multivalued attributes: the list in the request replaces the stored list
        if (fields.containsKey("emails")) {
            List<String> emails = asStringList(fields.get("emails"), "emails");
            if (emails.isEmpty()) {
                throw new IllegalArgumentException("A user needs at least one email.");
            }
            for (String email : emails) {
                userRepository.findByEmail(email)
                        .filter(other -> !other.getUserId().equals(userId))
                        .ifPresent(other -> {
                            throw new IllegalArgumentException("Email already registered: " + email);
                        });
            }
            user.setEmails(emails);
        }
        if (fields.containsKey("contactNumbers")) {
            user.setContactNumbers(asStringList(fields.get("contactNumbers"), "contactNumbers"));
        }
        // subtype-specific fields (runtime type decides what applies)
        if (user instanceof JobSeeker jobSeeker && fields.containsKey("bio")) {
            jobSeeker.setBio(asString(fields.get("bio")));
        }
        if (user instanceof Staff staff) {
            if (fields.containsKey("jobTitle")) {
                staff.setJobTitle(asString(fields.get("jobTitle")));
            }
            if (fields.containsKey("departmentName")) {
                staff.setDepartmentName(asString(fields.get("departmentName")));
            }
        }
        if (user instanceof Admin admin && fields.containsKey("adminLevel")) {
            admin.setAdminLevel(asString(fields.get("adminLevel")));
        }
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserOrThrow(userId);

        // Notifications point at the user with a NOT NULL FK.
        notificationRepository.deleteAll(notificationRepository.findByUser_UserIdOrderBySentDateDesc(userId));

        // Everything else (CVs, applications, bookmarks, interviews, job postings,
        // moderation logs) is removed by the cascade settings on the entities.
        userRepository.delete(user);
    }

    @Override
    public User banUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setAccountStatus(AccountStatus.BANNED);
        return userRepository.save(user);
    }

    @Override
    public User unbanUser(Long userId) {
        User user = getUserOrThrow(userId);
        user.setAccountStatus(AccountStatus.ACTIVE);
        return userRepository.save(user);
    }

    @Override
    public String describeUser(User user) {
        // Both getRole() and getDashboardSummary() are dispatched at
        // runtime to whichever subclass `user` really is.
        return String.format("[%s] %s", user.getRole(), user.getDashboardSummary());
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private String asString(Object value) {
        return value == null ? null : value.toString();
    }

    private List<String> asStringList(Object value, String label) {
        if (!(value instanceof List<?> list)) {
            throw new IllegalArgumentException(label + " must be a list of strings.");
        }
        List<String> result = new java.util.ArrayList<>();
        for (Object item : list) {
            String text = requireText(asString(item), label + " entry");
            if (!result.contains(text)) {
                result.add(text);
            }
        }
        return result;
    }

    private String requireText(String value, String label) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(label + " must not be blank.");
        }
        return value.trim();
    }

    private void validateRegistration(String email, String rawPassword) {
        // 1. Email format (@ symbol)
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email address. It must contain an '@' symbol.");
        }
        
        // 2. Email uniqueness (Username unique equivalent)
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }
        
        // 3. Password complexity
        if (rawPassword == null || rawPassword.length() < 5) {
            throw new IllegalArgumentException("Password must be at least 5 characters long.");
        }
        if (!rawPassword.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one capital letter.");
        }
        if (!rawPassword.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one simple letter.");
        }
        if (!rawPassword.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one number.");
        }
        if (!rawPassword.matches(".*[^a-zA-Z0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one symbol.");
        }
    }
}
