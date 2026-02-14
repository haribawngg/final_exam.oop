package com.school.grademanagement.repository;

import com.school.grademanagement.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    // Lấy tất cả điểm của 1 học sinh dựa vào ID học sinh
    List<Grade> findByStudentId(Long studentId);

    // Lấy điểm của học sinh theo học kỳ (nếu cần lọc)
    List<Grade> findByStudentIdAndSemester(Long studentId, Integer semester);
}