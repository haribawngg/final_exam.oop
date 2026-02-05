package com.school.grademanagement.dto;

public class LoginRequest {
    private String username; // Có thể là mã HS hoặc Email GV
    private String password;
    private String role;     // "STUDENT" hoặc "TEACHER" (để biết backend cần check bảng nào)

    public LoginRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}