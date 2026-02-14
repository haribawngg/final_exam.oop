package com.school.grademanagement.dto;

import java.time.LocalDate;

public class StudentDTO {
    private Long id;
    private String studentCode;
    private String fullName;
    private String className;
    private String gender;
    private String parentPhoneNumber;
    private String status;
    private LocalDate dateOfBirth;

    private String address;

    public StudentDTO() {}

    // Cập nhật constructor
    public StudentDTO(Long id, String studentCode, String fullName, String className, String gender, String parentPhoneNumber, String status, LocalDate dateOfBirth, String address) {
        this.id = id;
        this.studentCode = studentCode;
        this.fullName = fullName;
        this.className = className;
        this.gender = gender;
        this.parentPhoneNumber = parentPhoneNumber;
        this.status = status;
        this.dateOfBirth = dateOfBirth;
        this.address = address; // <-- Gán giá trị
    }

    // --- getter andsetter ... ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getParentPhoneNumber() { return parentPhoneNumber; }
    public void setParentPhoneNumber(String parentPhoneNumber) { this.parentPhoneNumber = parentPhoneNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}