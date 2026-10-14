package com.careerlink.backend.dto;

import com.careerlink.backend.entity.enums.AccountStatus;
import java.time.LocalDateTime;

public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private AccountStatus status;
    private LocalDateTime registeredDate;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }
    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
}
