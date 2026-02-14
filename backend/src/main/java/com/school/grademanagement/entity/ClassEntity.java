package com.school.grademanagement.entity;

import jakarta.persistence.*;

@Entity //vẫn vậy =))
@Table(name = "classes")
public class ClassEntity {

    @Id //khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String className; // Ví dụ: 6A, 7B

    // Liên kết 1-1: Class giữ khóa ngoại teacher_id
    // Nghĩa là trong bảng classes sẽ có cột homeroom_teacher_id
    @OneToOne // một lớp học có 1 giáo viên chủ nhiệm duy nhất
    @JoinColumn(name = "homeroom_teacher_id") //khóa ngoại
    private Teacher homeroomTeacher;

    // --- constructor ---
    public ClassEntity() {
    }

    public ClassEntity(String className, Teacher homeroomTeacher) {
        this.className = className;
        this.homeroomTeacher = homeroomTeacher;
    }

    // --- getter and setter ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Teacher getHomeroomTeacher() {
        return homeroomTeacher;
    }

    public void setHomeroomTeacher(Teacher homeroomTeacher) {
        this.homeroomTeacher = homeroomTeacher;
    }
}