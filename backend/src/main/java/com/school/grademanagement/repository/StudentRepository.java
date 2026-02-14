package com.school.grademanagement.repository;

import com.school.grademanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // đánh dấu 1 app là 1 repo
public interface StudentRepository extends JpaRepository<Student, Long> { //kế thừa interface
    //các hàm được viết  sẵn đi kèm: thêm hoặc cập nhật, lấy danh sách, ti học sinh, xóa
    // tìm học sinh theo mã (VD: HS001) để làm chức năng Đăng nhập
    Optional<Student> findByStudentCode(String studentCode);
}