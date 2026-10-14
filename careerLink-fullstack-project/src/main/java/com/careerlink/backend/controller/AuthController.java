package com.careerlink.backend.controller;

import com.careerlink.backend.entity.User;
import com.careerlink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/job-seeker")
    public User registerJobSeeker(@RequestBody Map<String, String> body) {
        return userService.registerJobSeeker(body.get("firstName"), body.get("lastName"),
                body.get("email"), body.get("password"));
    }

    @PostMapping("/register/staff")
    public User registerStaff(@RequestBody Map<String, String> body) {
        return userService.registerStaff(body.get("firstName"), body.get("lastName"),
                body.get("email"), body.get("password"), body.get("jobTitle"), body.get("departmentName"));
    }

    @PostMapping("/register/admin")
    public User registerAdmin(@RequestBody Map<String, String> body) {
        return userService.registerAdmin(body.get("firstName"), body.get("lastName"),
                body.get("email"), body.get("password"), body.get("adminLevel"));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        User user = userService.login(body.get("email"), body.get("password"));
        // describeUser() demonstrates polymorphism end-to-end, straight
        // through to the HTTP response.
        return Map.of(
                "userId", String.valueOf(user.getUserId()),
                "role", user.getRole(),
                "summary", userService.describeUser(user)
        );
    }
}
