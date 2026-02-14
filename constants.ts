import { Student, Gender, GradeLevel, StudentStatus, SubjectGrade, StudentScores } from './types';

// Danh sách tên môn học tiếng Việt
export const SUBJECT_NAMES: Record<keyof StudentScores, string> = {
  math: 'Toán học',
  literature: 'Ngữ văn',
  english: 'Tiếng Anh',
  physics: 'Vật lí',
  chemistry: 'Hóa học',
  biology: 'Sinh học',
  history: 'Lịch sử',
  geography: 'Địa lí',
  civicEducation: 'GDCD',
  technology: 'Công nghệ',
  physicalEducation: 'Thể dục',
};

// Helper function để tạo điểm ngẫu nhiên hợp lý
const generateSubjectScore = (min: number, max: number): SubjectGrade => {
  const rand = (n: number, x: number) => parseFloat((Math.random() * (x - n) + n).toFixed(1));
  
  const s1 = {
    oral: rand(min, max),
    fifteen: rand(min, max),
    fortyFive: rand(min, max),
    exam: rand(min, max),
    get average() { return parseFloat(((this.oral + this.fifteen + this.fortyFive * 2 + this.exam * 3) / 7).toFixed(1)); }
  };
  
  const s2 = {
    oral: rand(min, max),
    fifteen: rand(min, max),
    fortyFive: rand(min, max),
    exam: rand(min, max),
    get average() { return parseFloat(((this.oral + this.fifteen + this.fortyFive * 2 + this.exam * 3) / 7).toFixed(1)); }
  };

  return {
    sem1: s1,
    sem2: s2,
    final: parseFloat(((s1.average + s2.average * 2) / 3).toFixed(1))
  };
};

export const generateEmptyScores = (): any => {
  const emptyTerm = { oral: 0, fifteen: 0, fortyFive: 0, exam: 0, average: 0 };
  const emptySubject = { sem1: emptyTerm, sem2: emptyTerm, final: 0 };
  return {
    math: JSON.parse(JSON.stringify(emptySubject)),
    literature: JSON.parse(JSON.stringify(emptySubject)),
    english: JSON.parse(JSON.stringify(emptySubject)),
    physics: JSON.parse(JSON.stringify(emptySubject)),
    chemistry: JSON.parse(JSON.stringify(emptySubject)),
    biology: JSON.parse(JSON.stringify(emptySubject)),
    history: JSON.parse(JSON.stringify(emptySubject)),
    geography: JSON.parse(JSON.stringify(emptySubject)),
    civicEducation: JSON.parse(JSON.stringify(emptySubject)),
    technology: JSON.parse(JSON.stringify(emptySubject)),
    physicalEducation: JSON.parse(JSON.stringify(emptySubject)),
  };
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'HS001',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '2012-05-12',
    gender: Gender.MALE,
    className: '6A',
    gradeLevel: GradeLevel.SIX,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(7, 9), 
      literature: generateSubjectScore(6, 8), 
      english: generateSubjectScore(8, 10), 
      physics: generateSubjectScore(7, 9),
      chemistry: generateSubjectScore(7, 9),
      biology: generateSubjectScore(7, 9),
      history: generateSubjectScore(7, 9),
      geography: generateSubjectScore(6, 8),
      civicEducation: generateSubjectScore(8, 10),
      technology: generateSubjectScore(8, 9),
      physicalEducation: generateSubjectScore(9, 10)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    address: '123 Đường Láng, Hà Nội',
    parentPhone: '0912345678'
  },
  {
    id: 'HS002',
    fullName: 'Trần Thị Bích',
    dateOfBirth: '2012-08-20',
    gender: Gender.FEMALE,
    className: '6A',
    gradeLevel: GradeLevel.SIX,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(5, 7), 
      literature: generateSubjectScore(8, 9), 
      english: generateSubjectScore(7, 9), 
      physics: generateSubjectScore(6, 8),
      chemistry: generateSubjectScore(6, 8),
      biology: generateSubjectScore(7, 9),
      history: generateSubjectScore(8, 9),
      geography: generateSubjectScore(7, 9),
      civicEducation: generateSubjectScore(8, 10),
      technology: generateSubjectScore(8, 9),
      physicalEducation: generateSubjectScore(7, 8)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    address: '45 Nguyễn Trãi, Hà Nội',
    parentPhone: '0987654321'
  },
  {
    id: 'HS003',
    fullName: 'Lê Hoàng Nam',
    dateOfBirth: '2011-03-15',
    gender: Gender.MALE,
    className: '7B',
    gradeLevel: GradeLevel.SEVEN,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(9, 10), 
      literature: generateSubjectScore(5, 7), 
      english: generateSubjectScore(6, 8), 
      physics: generateSubjectScore(8, 10),
      chemistry: generateSubjectScore(8, 9),
      biology: generateSubjectScore(7, 9),
      history: generateSubjectScore(6, 7),
      geography: generateSubjectScore(6, 8),
      civicEducation: generateSubjectScore(7, 9),
      technology: generateSubjectScore(9, 10),
      physicalEducation: generateSubjectScore(9, 10)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    address: '88 Cầu Giấy, Hà Nội',
    parentPhone: '0901239876'
  },
  {
    id: 'HS004',
    fullName: 'Phạm Minh Tú',
    dateOfBirth: '2010-11-02',
    gender: Gender.FEMALE,
    className: '8C',
    gradeLevel: GradeLevel.EIGHT,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(6, 8), 
      literature: generateSubjectScore(8, 10), 
      english: generateSubjectScore(9, 10), 
      physics: generateSubjectScore(7, 9),
      chemistry: generateSubjectScore(8, 9),
      biology: generateSubjectScore(8, 9),
      history: generateSubjectScore(8, 10),
      geography: generateSubjectScore(8, 9),
      civicEducation: generateSubjectScore(9, 10),
      technology: generateSubjectScore(8, 9),
      physicalEducation: generateSubjectScore(8, 9)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    address: '12 Kim Mã, Hà Nội',
    parentPhone: '0977889900'
  },
  {
    id: 'HS005',
    fullName: 'Vũ Đức Thắng',
    dateOfBirth: '2009-01-30',
    gender: Gender.MALE,
    className: '9A',
    gradeLevel: GradeLevel.NINE,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(4, 6), 
      literature: generateSubjectScore(5, 7), 
      english: generateSubjectScore(4, 6), 
      physics: generateSubjectScore(5, 6),
      chemistry: generateSubjectScore(4, 6),
      biology: generateSubjectScore(5, 7),
      history: generateSubjectScore(5, 6),
      geography: generateSubjectScore(5, 6),
      civicEducation: generateSubjectScore(6, 8),
      technology: generateSubjectScore(6, 7),
      physicalEducation: generateSubjectScore(7, 8)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=5',
    address: '56 Tây Sơn, Hà Nội',
    parentPhone: '0966554433'
  },
  {
    id: 'HS006',
    fullName: 'Đỗ Thị Lan',
    dateOfBirth: '2009-06-18',
    gender: Gender.FEMALE,
    className: '9A',
    gradeLevel: GradeLevel.NINE,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(7, 9), 
      literature: generateSubjectScore(7, 9), 
      english: generateSubjectScore(7, 9), 
      physics: generateSubjectScore(7, 8),
      chemistry: generateSubjectScore(7, 9),
      biology: generateSubjectScore(8, 9),
      history: generateSubjectScore(7, 9),
      geography: generateSubjectScore(7, 9),
      civicEducation: generateSubjectScore(8, 9),
      technology: generateSubjectScore(8, 9),
      physicalEducation: generateSubjectScore(8, 9)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=6',
    address: '78 Đê La Thành, Hà Nội',
    parentPhone: '0911223344'
  },
  {
    id: 'HS007',
    fullName: 'Ngô Kiến Huy',
    dateOfBirth: '2012-09-05',
    gender: Gender.MALE,
    className: '6B',
    gradeLevel: GradeLevel.SIX,
    status: StudentStatus.TRANSFERRED,
    scores: { 
      math: generateSubjectScore(3, 5), 
      literature: generateSubjectScore(4, 6), 
      english: generateSubjectScore(3, 5), 
      physics: generateSubjectScore(3, 5),
      chemistry: generateSubjectScore(3, 5),
      biology: generateSubjectScore(4, 6),
      history: generateSubjectScore(3, 5),
      geography: generateSubjectScore(4, 5),
      civicEducation: generateSubjectScore(5, 7),
      technology: generateSubjectScore(5, 6),
      physicalEducation: generateSubjectScore(6, 8)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=7',
    address: 'Unknown',
    parentPhone: '0999888777'
  },
  {
    id: 'HS008',
    fullName: 'Bùi Phương Thảo',
    dateOfBirth: '2011-04-22',
    gender: Gender.FEMALE,
    className: '7B',
    gradeLevel: GradeLevel.SEVEN,
    status: StudentStatus.ACTIVE,
    scores: { 
      math: generateSubjectScore(9, 10), 
      literature: generateSubjectScore(9, 10), 
      english: generateSubjectScore(9, 10), 
      physics: generateSubjectScore(9, 10),
      chemistry: generateSubjectScore(9, 10),
      biology: generateSubjectScore(9, 10),
      history: generateSubjectScore(9, 10),
      geography: generateSubjectScore(9, 10),
      civicEducation: generateSubjectScore(9, 10),
      technology: generateSubjectScore(9, 10),
      physicalEducation: generateSubjectScore(9, 10)
    },
    avatarUrl: 'https://picsum.photos/100/100?random=8',
    address: '101 Xã Đàn, Hà Nội',
    parentPhone: '0933445566'
  }
];

export const AI_MODEL_NAME = 'gemini-2.5-flash';
export const SYSTEM_INSTRUCTION = `Bạn là một trợ lý AI thông minh cho hệ thống quản lý trường học THCS. 
Nhiệm vụ của bạn là phân tích dữ liệu học sinh, điểm số, và đưa ra các nhận xét, gợi ý sư phạm hữu ích.
Hãy trả lời bằng Tiếng Việt, sử dụng định dạng Markdown đẹp mắt.
Nếu được hỏi về dữ liệu cụ thể, hãy dựa vào dữ liệu JSON được cung cấp.`;