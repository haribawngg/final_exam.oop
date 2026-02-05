package com.school.grademanagement.controller;

import com.school.grademanagement.dto.GradeDTO;
import com.school.grademanagement.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // <--- Import mới
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:3000") // <--- QUAN TRỌNG: Cho phép React gọi vào
public class GradeController {

    @Autowired
    private GradeService gradeService;

    // 1. API lấy bảng điểm (Cũ - Đã chuẩn hóa thêm ResponseEntity)
    // GET: http://localhost:8080/api/grades/student/1
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeDTO>> getGradesByStudentId(@PathVariable Long studentId) {
        List<GradeDTO> grades = gradeService.getGradesByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }

    // 2. API cập nhật điểm (MỚI - ĐỂ SỬA LỖI 404)
    // PUT: http://localhost:8080/api/grades/15
    @PutMapping("/{gradeId}")
    public ResponseEntity<GradeDTO> updateGrade(
            @PathVariable Long gradeId,
            @RequestBody GradeDTO gradeDTO) {

        // Gọi service xử lý tính toán và lưu DB
        GradeDTO updatedGrade = gradeService.updateScore(gradeId, gradeDTO);

        // Trả về kết quả mới nhất cho Frontend hiển thị
        return ResponseEntity.ok(updatedGrade);
    }
}