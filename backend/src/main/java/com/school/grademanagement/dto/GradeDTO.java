package com.school.grademanagement.dto;

public class GradeDTO {
    private Long id;
    private String studentName; // Có thể null nếu không dùng
    private String subjectName;
    private String semester;    // QUAN TRỌNG

    private Double scoreOral;
    private Double score15m;
    private Double score45m;
    private Double scoreFinal;
    private Double scoreAverage;

    public GradeDTO() {}

    // Constructor phải khớp thứ tự với Service
    public GradeDTO(Long id, String subjectName, String semester, Double scoreOral, Double score15m, Double score45m, Double scoreFinal, Double scoreAverage) {
        this.id = id;
        this.subjectName = subjectName;
        this.semester = semester;
        this.scoreOral = scoreOral;
        this.score15m = score15m;
        this.score45m = score45m;
        this.scoreFinal = scoreFinal;
        this.scoreAverage = scoreAverage;
    }

    // ... (Giữ nguyên các Getter/Setter bên dưới) ...
    // Nhớ thêm Getter/Setter cho semester
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Double getScoreOral() {
        return scoreOral;
    }

    public void setScoreOral(Double scoreOral) {
        this.scoreOral = scoreOral;
    }

    public Double getScore15m() {
        return score15m;
    }

    public void setScore15m(Double score15m) {
        this.score15m = score15m;
    }

    public Double getScore45m() {
        return score45m;
    }

    public void setScore45m(Double score45m) {
        this.score45m = score45m;
    }

    public Double getScoreFinal() {
        return scoreFinal;
    }

    public void setScoreFinal(Double scoreFinal) {
        this.scoreFinal = scoreFinal;
    }

    public Double getScoreAverage() {
        return scoreAverage;
    }

    public void setScoreAverage(Double scoreAverage) {
        this.scoreAverage = scoreAverage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}