package com.school.grademanagement.entity;

import jakarta.persistence.*; //thư viện này dùng để xây dựng web backend nhé
import java.time.LocalDate;

@Entity //đánh dấu class này là 1 thuwcj thể và là 1 đối tượng cần được quản lí và lưu trong database
@Table(name = "students")
//mục đích chính của class này là map(ánh xạ) đối tương học sinh trong code java sáng bảng students trong csdl mysql mà a thêm vào
public class Student {
    @Id // xác định thuộc tính id là khóa chin
    @GeneratedValue(strategy = GenerationType.IDENTITY) // tính năng tự tăng trong db
    private Long id;

    @Column(unique = true, nullable = false) // quy định mã hs thì ko được phép trùng nhau và không được để trống
    private String studentCode; // Mã HS (VD: HS001) - Dùng làm tên đăng nhập

    //các thuộc tính tính này sẽ ánh xạ tự động sang các cột cùng tên trong db
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String parentPhoneNumber;
    private String address;
    private String status; // Đang học

    // Thêm mật khẩu để Học sinh/Phụ huynh đăng nhập
    private String password;

    // Liên kết: Nhiều học sinh thuộc 1 lớp
    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity; // kho ngoại trong bảng students sẽ là classid
    // tham chiếu đến bảng lớp học đấy nhé

    // --- constructor ---
    public Student() {
    }

    // constructor đầy đủ để sau này tạo mới cho nhanh
    public Student(String studentCode, String fullName, LocalDate dateOfBirth, String gender, String parentPhoneNumber, String address, String status, String password, ClassEntity classEntity) {
        this.studentCode = studentCode;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.parentPhoneNumber = parentPhoneNumber;
        this.address = address;
        this.status = status;
        this.password = password;
        this.classEntity = classEntity;
    }

    // --- getter and setter ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getParentPhoneNumber() {
        return parentPhoneNumber;
    }

    public void setParentPhoneNumber(String parentPhoneNumber) {
        this.parentPhoneNumber = parentPhoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ClassEntity getClassEntity() {
        return classEntity;
    }

    public void setClassEntity(ClassEntity classEntity) {
        this.classEntity = classEntity;
    }
}