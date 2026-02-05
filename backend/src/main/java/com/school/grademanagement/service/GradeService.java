package com.school.grademanagement.service;

import com.school.grademanagement.dto.GradeDTO;
import com.school.grademanagement.entity.Grade;
import com.school.grademanagement.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired; // Nhớ import cái này
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service //vx như cái student
public class GradeService {

    @Autowired // <--- QUAN TRỌNG: Thêm dòng này để kết nối Database
    private GradeRepository gradeRepository;

    public List<GradeDTO> getGradesByStudentId(Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        List<GradeDTO> gradeDTOS = new ArrayList<>();

        for (Grade g : grades) {
            // Bây giờ các hàm g.get... sẽ hết báo đỏ
            GradeDTO dto = new GradeDTO(
                    g.getId(),
                    g.getSubject().getSubjectName(),
                    "HK" + g.getSemester(), // Ví dụ: HK1
                    g.getScoreOral(),
                    g.getScore15m(),
                    g.getScore45m(),
                    g.getScoreFinal(),
                    g.getScoreAverage()
            );
            gradeDTOS.add(dto);
        }
        return gradeDTOS;
    }

    // --- cập nhật điểm số ---
    @Transactional // Đảm bảo toàn vẹn dữ liệu
    public GradeDTO updateScore(Long gradeId, GradeDTO newScoreData) {
        // 1. Tìm bản ghi điểm trong DB
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bảng điểm với ID: " + gradeId));

        // 2. Cập nhật các điểm thành phần từ DTO gửi lên
        grade.setScoreOral(newScoreData.getScoreOral());
        grade.setScore15m(newScoreData.getScore15m());
        grade.setScore45m(newScoreData.getScore45m());
        grade.setScoreFinal(newScoreData.getScoreFinal());

        // 3. Tính toán lại điểm trung bình (QUAN TRỌNG)
        // Công thức: (Miệng + 15p + 1Tiết*2 + Thi*3) / Tổng hệ số
        // Bạn có thể tùy chỉnh công thức theo quy chế trường bạn
        double totalScore = 0;
        int totalCoeff = 0; // Tổng hệ số

        if (grade.getScoreOral() != null) {
            totalScore += grade.getScoreOral();
            totalCoeff += 1;
        }
        if (grade.getScore15m() != null) {
            totalScore += grade.getScore15m();
            totalCoeff += 1;
        }
        if (grade.getScore45m() != null) {
            totalScore += grade.getScore45m() * 2;
            totalCoeff += 2;
        }
        if (grade.getScoreFinal() != null) {
            totalScore += grade.getScoreFinal() * 3;
            totalCoeff += 3;
        }

        // Tránh chia cho 0
        if (totalCoeff > 0) {
            double avg = totalScore / totalCoeff;
            // Làm tròn 1 chữ số thập phân (VD: 8.66 -> 8.7)
            avg = Math.round(avg * 10.0) / 10.0;
            grade.setScoreAverage(avg);
        } else {
            grade.setScoreAverage(null);
        }

        // 4. Lưu vào Database
        Grade savedGrade = gradeRepository.save(grade);

        // 5. Trả về DTO mới nhất
        return new GradeDTO(
                savedGrade.getId(),
                savedGrade.getSubject().getSubjectName(),
                "HK" + savedGrade.getSemester(),
                savedGrade.getScoreOral(),
                savedGrade.getScore15m(),
                savedGrade.getScore45m(),
                savedGrade.getScoreFinal(),
                savedGrade.getScoreAverage()
        );
    }
}