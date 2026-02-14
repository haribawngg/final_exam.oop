import React from 'react';

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ'
}

export enum GradeLevel {
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9'
}

export enum StudentStatus {
  ACTIVE = 'Đang học',
  TRANSFERRED = 'Chuyển trường',
  DROPPED = 'Thôi học'
}

// Cấu trúc điểm chi tiết cho một kỳ
export interface SemesterScore {
  oral: number;       // Miệng
  fifteen: number;    // 15 phút
  fortyFive: number;  // 1 tiết
  exam: number;       // Cuối kỳ
  average: number;    // Điểm TB kỳ
}

// Cấu trúc điểm cho một môn học (cả năm)
export interface SubjectGrade {
  sem1: SemesterScore;
  sem2: SemesterScore;
  final: number;      // Tổng kết năm
}

// Danh sách các môn
export interface StudentScores {
  math: SubjectGrade;             // Toán
  literature: SubjectGrade;       // Văn
  english: SubjectGrade;          // Anh
  physics: SubjectGrade;          // Lí
  chemistry: SubjectGrade;        // Hóa
  biology: SubjectGrade;          // Sinh
  history: SubjectGrade;          // Sử
  geography: SubjectGrade;        // Địa
  civicEducation: SubjectGrade;   // GDCD
  technology: SubjectGrade;       // Công nghệ
  physicalEducation: SubjectGrade;// Thể dục
}

export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  className: string;
  gradeLevel: GradeLevel;
  status: StudentStatus;
  scores: StudentScores; // Cập nhật cấu trúc mới
  avatarUrl: string;
  address: string;
  parentPhone: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export interface AIAnalysisResult {
  markdown: string;
  timestamp: Date;
}