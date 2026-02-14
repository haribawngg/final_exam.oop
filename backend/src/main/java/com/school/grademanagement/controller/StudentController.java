package com.school.grademanagement.controller;

import com.school.grademanagement.dto.StudentDTO;
import com.school.grademanagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend (React/Vue...) gọi API
public class StudentController {

    @Autowired
    private StudentService studentService;

    // --- 1. lấy danh sách học sinh ---
    // GET: http://localhost:8080/api/students
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // --- 2. thêm mới học sinh ---
    // POST: http://localhost:8080/api/students
    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO) {
        // Service bây giờ trả về StudentDTO, nên biến hứng cũng phải là StudentDTO
        StudentDTO newStudent = studentService.createStudent(studentDTO);

        return ResponseEntity.ok(newStudent);
    }

    // --- 3. cập nhật học sinh ---
    // PUT: http://localhost:8080/api/students/{id}
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        // Tương tự, hứng kết quả bằng StudentDTO để tránh lỗi "Incompatible types"
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);

        return ResponseEntity.ok(updatedStudent);
    }

    // --- 4. xóa học sinh ---
    // DELETE: http://localhost:8080/api/students/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}