package com.school.grademanagement.service;

import com.school.grademanagement.dto.StudentDTO;
import com.school.grademanagement.entity.*;
import com.school.grademanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service //đánh dấu đây là 1 bean xử lí
public class StudentService {

    //autowired là cơ chế tiêm sự phụ thuộc.4 service sẽ điều khiển 4 repo để lấy và lưu dữ liệu nên sẽ được khai báo ở đây
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private GradeRepository gradeRepository;

    // --- hàm helper: HÀM CHUYỂN ĐỔI ENTITY -> DTO (Dùng chung để code gọn hơn) ---
    // mục đích: chuyển đổi từ thực thể(tức là entity á) sang dto
    private StudentDTO convertToDTO(Student s) {
        String className = "Chưa xếp lớp";
        if (s.getClassEntity() != null) {
            className = s.getClassEntity().getClassName();
        }
        return new StudentDTO(
                s.getId(),
                s.getStudentCode(),
                s.getFullName(),
                className,
                s.getGender(),
                s.getParentPhoneNumber(),
                s.getStatus(),
                s.getDateOfBirth(),
                s.getAddress()
        );
    }
    //logic: lấy tên lớp từ classentity để gán vào chuỗi classname
    //nếu học sinh chưa có lớp, hiển thị "chưa xếp lớp"
    //ẩn mật khẩu

    // --- 1. lấy danh sách học sinh ---
    public List<StudentDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        List<StudentDTO> studentDTOS = new ArrayList<>();
        for (Student s : students) {
            studentDTOS.add(convertToDTO(s));
        }
        return studentDTOS;
    }

    // --- 2. thêm học sinh  ---
    @Transactional // Thêm Transactional để đảm bảo lưu student và grade cùng thành công
    public StudentDTO createStudent(StudentDTO dto) {
        Student student = new Student();

        if (dto.getStudentCode() == null || dto.getStudentCode().trim().isEmpty()) {
            // Tự sinh mã HS
            String autoCode = "HS" + System.currentTimeMillis() / 1000;
            student.setStudentCode(autoCode);
        } else {
            student.setStudentCode(dto.getStudentCode());
        }

        student.setFullName(dto.getFullName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setParentPhoneNumber(dto.getParentPhoneNumber());
        student.setAddress(dto.getAddress() != null ? dto.getAddress() : "");
        student.setStatus("Đang học");
        student.setPassword("123"); // Mật khẩu mặc định

        // Xử lý Lớp học
        ClassEntity classEntity = classRepository.findByClassName(dto.getClassName());
        if (classEntity == null) {
            List<ClassEntity> classes = classRepository.findAll();
            if (!classes.isEmpty()) {
                classEntity = classes.get(0);
            }
        }
        student.setClassEntity(classEntity);

        // Lưu học sinh
        Student savedStudent = studentRepository.save(student);

        // Tạo bảng điểm trống
        List<Subject> subjects = subjectRepository.findAll();
        for (Subject sub : subjects) {
            gradeRepository.save(new Grade(savedStudent, sub, 1, null, null, null, null, null));
            gradeRepository.save(new Grade(savedStudent, sub, 2, null, null, null, null, null));
        }

        // Trả về DTO để Controller không bị lỗi Incompatible types
        return convertToDTO(savedStudent);
    }

    // --- 3. cập nhật học sinh ---
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh với ID: " + id));

        existingStudent.setFullName(dto.getFullName());
        existingStudent.setDateOfBirth(dto.getDateOfBirth());
        existingStudent.setGender(dto.getGender());
        existingStudent.setParentPhoneNumber(dto.getParentPhoneNumber());
        existingStudent.setAddress(dto.getAddress());

        if (dto.getClassName() != null && !dto.getClassName().isEmpty()) {
            ClassEntity classEntity = classRepository.findByClassName(dto.getClassName());
            if (classEntity != null) {
                existingStudent.setClassEntity(classEntity);
            }
        }

        Student savedStudent = studentRepository.save(existingStudent);

        // Trả về DTO
        return convertToDTO(savedStudent);
    }

    // --- 4. xóa học sinh ---
    @Transactional
    public void deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            List<Grade> grades = gradeRepository.findByStudentId(id);
            if (!grades.isEmpty()) {
                gradeRepository.deleteAll(grades);
            }
            studentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Không tìm thấy học sinh để xóa");
        }
    }
}