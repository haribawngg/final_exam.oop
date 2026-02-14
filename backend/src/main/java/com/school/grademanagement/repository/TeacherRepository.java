package com.school.grademanagement.repository;

import com.school.grademanagement.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    // Tìm giáo viên theo Email để làm chức năng Đăng nhập
    Optional<Teacher> findByEmail(String email);
}