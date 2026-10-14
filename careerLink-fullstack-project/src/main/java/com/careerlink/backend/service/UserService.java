package com.careerlink.backend.service;

import com.careerlink.backend.entity.Admin;
import com.careerlink.backend.entity.JobSeeker;
import com.careerlink.backend.entity.Staff;
import com.careerlink.backend.entity.User;
import java.util.List;
import java.util.Map;

/**
 * ABSTRACTION: callers (controllers) depend on this interface, never on the
 * concrete UserServiceImpl. The implementation can be swapped or mocked in
 * tests without any code above this layer changing.
 */
public interface UserService {

    JobSeeker registerJobSeeker(String firstName, String lastName, String email, String rawPassword);

    Staff registerStaff(String firstName, String lastName, String email, String rawPassword,
                        String jobTitle, String departmentName);

    Admin registerAdmin(String firstName, String lastName, String email, String rawPassword, String adminLevel);

    User login(String email, String rawPassword);

    List<User> getAllUsers();

    User getUserById(Long userId);

    // FR-01 (edit profile): only the keys present in `fields` are changed.
    // Common: firstName, lastName, profilePicture, emails (list), contactNumbers (list).
    // JobSeeker: bio.  Staff: jobTitle, departmentName.  Admin: adminLevel.
    User updateProfile(Long userId, Map<String, Object> fields);

    // Removes the account and everything that hangs off it.
    void deleteUser(Long userId);

    // FR-22: Admin can view all system users and ban/unban an account
    User banUser(Long userId);

    User unbanUser(Long userId);

    // POLYMORPHISM DEMO: accepts a plain User reference - the actual role
    // (JobSeeker/Staff/Admin) is resolved at runtime via dynamic dispatch
    // when getRole()/getDashboardSummary() are called inside the impl.
    String describeUser(User user);
}
