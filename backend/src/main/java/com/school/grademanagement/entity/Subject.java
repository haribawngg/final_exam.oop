package com.school.grademanagement.entity;

import jakarta.persistence.*;

@Entity //đánh dấu class subject là một đối tượng cần lưu trữ vào db
@Table(name = "subjects")//quy định tên trong bảng trong db là subjects
public class Subject {

    @Id //xác định khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set id tự tăng
    private Long id;

    @Column(nullable = false, unique = true) //bắt buộc phải nhập tên môn học và đảm bảo tên môn học là duy nhất
    private String subjectName; // Tên môn học (Toán, Văn...)

    // --- constructor ---
    public Subject() {
    }

    public Subject(String subjectName) {
        this.subjectName = subjectName;
    }

    // --- getter and setter ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}
