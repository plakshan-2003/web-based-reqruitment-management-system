package com.careerlink.backend.dto;

public class JobSeekerResponseDTO extends UserResponseDTO {
    private String skills;
    private String experience;

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
}
