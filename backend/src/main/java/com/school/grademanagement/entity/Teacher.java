package com.school.grademanagement.entity;

import jakarta.persistence.*;

@Entity //class này là 1 bảng dữ liệu cần quản lí
@Table(name = "teachers") // dữ liệu của giáo viên sẽ được lưu vào bảng teachers
//mục đích chính của class này là map(ánh xạ) đối tương giáo viên trong code java sáng bảng teacher trong csdl mysql mà a thêm vào
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // BẮT BUỘC: Để định danh giáo viên
    //cái này cx là khóa chính của bảng này luôn nhé
    private String fullName; // Hiển thị trên UI

    @Column(unique = true, nullable = false) //vì dùng email làm username
    //nên không được phép có 2 gv cùng email và bắt buộc phải có email chứ không được để trống
    private String email;    // QUAN TRỌNG: Dùng làm tên đăng nhập (Username)

    private String phoneNumber;

    private String password;

    // --- constructor ---
    public Teacher() {
    } // constructor rỗng dùng để khởi tạo đối tượng khi đọc dữ liệu từ db lên

    public Teacher(String fullName, String email, String phoneNumber, String password) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }

    // --- getter and setter ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}