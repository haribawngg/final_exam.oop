package com.school.grademanagement.entity;

import jakarta.persistence.*;

@Entity //vẫn như cũ
@Table(name = "grades")
public class Grade {

    @Id //khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne //nhiều điểm số thuộc về 1 học sinh
    @JoinColumn(name = "student_id") //khóa ngoại
    private Student student;

    @ManyToOne //nhiều điểm số thuộc về một môn học
    @JoinColumn(name = "subject_id") //khóa ngoại
    private Subject subject;

    private Integer semester;

    private Double scoreOral;
    private Double score15m;
    private Double score45m;
    private Double scoreFinal;
    private Double scoreAverage;

    public Grade() {
    }

    public Grade(Student student, Subject subject, Integer semester, Double scoreOral, Double score15m, Double score45m, Double scoreFinal, Double scoreAverage) {
        this.student = student;
        this.subject = subject;
        this.semester = semester;
        this.scoreOral = scoreOral;
        this.score15m = score15m;
        this.score45m = score45m;
        this.scoreFinal = scoreFinal;
        this.scoreAverage = scoreAverage;
    }

    // --- getter and setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getScoreOral() { return scoreOral; }
    public void setScoreOral(Double scoreOral) { this.scoreOral = scoreOral; }

    public Double getScore15m() { return score15m; }
    public void setScore15m(Double score15m) { this.score15m = score15m; }

    public Double getScore45m() { return score45m; }
    public void setScore45m(Double score45m) { this.score45m = score45m; }

    public Double getScoreFinal() { return scoreFinal; }
    public void setScoreFinal(Double scoreFinal) { this.scoreFinal = scoreFinal; }

    public Double getScoreAverage() { return scoreAverage; }
    public void setScoreAverage(Double scoreAverage) { this.scoreAverage = scoreAverage; }
}