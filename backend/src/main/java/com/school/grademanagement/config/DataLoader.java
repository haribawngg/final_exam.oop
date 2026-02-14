package com.school.grademanagement.config;

import com.school.grademanagement.entity.*;
import com.school.grademanagement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(TeacherRepository teacherRepo,
                                   StudentRepository studentRepo,
                                   ClassRepository classRepo,
                                   SubjectRepository subjectRepo,
                                   GradeRepository gradeRepo
    ) {
        return args -> {
            // 1. KIỂM TRA & TẠO GIÁO VIÊN (Chỉ tạo nếu chưa có)
            Teacher teacher = null;
            if (teacherRepo.count() == 0) {
                teacher = new Teacher("Nguyễn Văn A", "gv01@gmail.com", "0912345678", "123456"); // Lưu ý: Password này chưa mã hóa
                teacherRepo.save(teacher);
            } else {
                teacher = teacherRepo.findAll().get(0); // Lấy giáo viên đầu tiên nếu đã có
            }

            // 2. KIỂM TRA & TẠO LỚP HỌC
            ClassEntity class6A = null;
            if (classRepo.count() == 0) {
                class6A = new ClassEntity("6A", teacher);
                classRepo.save(class6A);
            } else {
                class6A = classRepo.findAll().get(0);
            }

            // 3. KIỂM TRA & TẠO MÔN HỌC (QUAN TRỌNG ĐỂ KHÔNG BỊ LẶP)
            // Viết hàm tiện ích nhỏ để tìm hoặc tạo
            Subject math = createSubjectIfNotExists(subjectRepo, "Toán học");
            Subject lit = createSubjectIfNotExists(subjectRepo, "Ngữ văn");
            Subject eng = createSubjectIfNotExists(subjectRepo, "Tiếng Anh");

            // 4. TẠO HỌC SINH & ĐIỂM (Chỉ tạo nếu chưa có HS nào)
            if (studentRepo.count() == 0) {

                // Tạo HS1
                Student s1 = new Student();
                s1.setStudentCode("HS001");
                s1.setFullName("Lê Hoàng Nam");
                s1.setDateOfBirth(LocalDate.of(2012, 5, 20));
                s1.setGender("Nam");
                s1.setParentPhoneNumber("0987654321");
                s1.setStatus("Đang học");
                s1.setPassword("123");
                s1.setClassEntity(class6A);
                studentRepo.save(s1);

                // Tạo HS2
                Student s2 = new Student();
                s2.setStudentCode("HS002");
                s2.setFullName("Trần Thị Bích");
                s2.setDateOfBirth(LocalDate.of(2012, 8, 15));
                s2.setGender("Nữ");
                s2.setParentPhoneNumber("0909090909");
                s2.setStatus("Đang học");
                s2.setPassword("123");
                s2.setClassEntity(class6A);
                studentRepo.save(s2);

                // 5. TẠO ĐIỂM SỐ MẪU (Cho HS1)
                // Lưu ý: Chỉ tạo nếu chưa có điểm (tránh trùng lặp nếu chạy lại)
                if (gradeRepo.count() == 0) {
                    // Toán - HK1
                    gradeRepo.save(new Grade(s1, math, 1, 9.0, 8.5, 9.0, 8.0, 8.6));
                    // Văn - HK1
                    gradeRepo.save(new Grade(s1, lit, 1, 7.5, 8.0, 7.5, 8.0, 7.8));
                    // Toán - HK2
                    gradeRepo.save(new Grade(s1, math, 2, 8.0, 9.0, 8.5, 9.0, 8.8));

                    // Tạo thêm các điểm trống cho các môn khác để đủ bộ (Optional)
                    gradeRepo.save(new Grade(s1, eng, 1, null, null, null, null, null));
                }

                System.out.println(">>> ĐÃ TẠO DỮ LIỆU MẪU AN TOÀN (KHÔNG TRÙNG LẶP)! <<<");
            }
        };
    }

    // Hàm phụ trợ: Tìm môn học, nếu không thấy thì tạo mới
    private Subject createSubjectIfNotExists(SubjectRepository repo, String name) {
        // Cần đảm bảo bạn đã có hàm findBySubjectName trong SubjectRepository
        // Nếu chưa có, bạn có thể dùng logic try-catch hoặc findAll().stream()
        // Ở đây mình dùng cách đơn giản nhất:

        // Cách 1: Nếu bạn ĐÃ thêm 'Subject findBySubjectName(String name);' vào Repository
        // return repo.findBySubjectName(name).orElseGet(() -> repo.save(new Subject(name)));

        // Cách 2: Cách "thủ công" an toàn không cần sửa Repository (Dùng cho người mới)
        for (Subject s : repo.findAll()) {
            if (s.getSubjectName().equalsIgnoreCase(name)) {
                return s; // Đã có rồi thì trả về luôn, không tạo mới
            }
        }
        // Chưa có thì tạo mới
        return repo.save(new Subject(name));
    }
}