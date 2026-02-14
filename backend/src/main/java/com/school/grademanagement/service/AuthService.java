package com.school.grademanagement.service;

import com.school.grademanagement.dto.LoginRequest;
import com.school.grademanagement.entity.Student;
import com.school.grademanagement.entity.Teacher;
import com.school.grademanagement.repository.StudentRepository;
import com.school.grademanagement.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Object login(LoginRequest request) {
        // Nếu role là GIÁO VIÊN
        if ("TEACHER".equalsIgnoreCase(request.getRole())) {
            // Tìm giáo viên theo Email (username trong request là email)
            Optional<Teacher> teacherOpt = teacherRepository.findByEmail(request.getUsername());

            if (teacherOpt.isPresent()) {
                Teacher teacher = teacherOpt.get();
                // So sánh mật khẩu (Lưu ý: Thực tế nên mã hóa, ở đây so sánh thô để test trước)
                if (teacher.getPassword().equals(request.getPassword())) {
                    return teacher; // Đăng nhập thành công
                }
            }
        }
        // Nếu role là HỌC SINH / PHỤ HUYNH
        else if ("STUDENT".equalsIgnoreCase(request.getRole())) {
            // Tìm học sinh theo Mã HS (username trong request là mã HS)
            Optional<Student> studentOpt = studentRepository.findByStudentCode(request.getUsername());

            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                if (student.getPassword().equals(request.getPassword())) {
                    return student; // Đăng nhập thành công
                }
            }
        }

        // Nếu sai tài khoản hoặc mật khẩu
        return null;
    }
}