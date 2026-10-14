package com.careerlink.backend.dto;

public class StaffResponseDTO extends UserResponseDTO {
    private String companyName;
    private String department;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
