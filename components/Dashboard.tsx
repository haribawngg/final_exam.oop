import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, BookOpen, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Student, StudentStatus } from '../types';

interface DashboardProps {
  students: Student[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ students }) => {

  // --- 1. HÀM TÍNH ĐIỂM TRUNG BÌNH (SAFE LOGIC) ---
  // Hàm này sẽ không bị lỗi dù học sinh chưa có điểm
  const calculateStudentGPA = (student: Student) => {
    // Nếu không có scores hoặc scores rỗng -> Trả về 0
    if (!student.scores || Object.keys(student.scores).length === 0) {
      return 0;
    }

    const subjects = Object.values(student.scores);
    // Lọc ra những môn có điểm final hợp lệ
    const validSubjects = subjects.filter((subj: any) => typeof subj.final === 'number');

    if (validSubjects.length === 0) return 0;

    const sum = validSubjects.reduce((acc, subj: any) => acc + (subj.final || 0), 0);
    return sum / validSubjects.length;
  };

  // --- 2. HÀM TÍNH ĐIỂM TRUNG BÌNH THEO MÔN (SAFE LOGIC) ---
  const calculateSubjectAvg = (subjectKey: string) => {
    // Lấy ra tất cả điểm final của môn học đó (nếu có)
    const validScores = students
      .map(s => s.scores?.[subjectKey]?.final) // Dùng ?. để không bị lỗi nếu thiếu môn
      .filter((score): score is number => typeof score === 'number'); // Lọc bỏ undefined

    if (validScores.length === 0) return 0;
    return (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1);
  };

  // --- 3. TÍNH TOÁN THỐNG KÊ ---
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === StudentStatus.ACTIVE || s.status === 'Đang học').length;

  // Tính trung bình Toán và Văn (hoặc Tiếng Anh)
  // Lưu ý: Key phải khớp với key trong object scores (ví dụ: 'math', 'literature', 'english')
  const avgMath = calculateSubjectAvg('math');
  const avgLit = calculateSubjectAvg('literature'); // Hoặc 'english' tùy dữ liệu của bạn

  // --- 4. CHUẨN BỊ DỮ LIỆU BIỂU ĐỒ ---
  const gradeDistribution = [
    { name: 'Giỏi (>=8)', value: students.filter(s => calculateStudentGPA(s) >= 8).length },
    { name: 'Khá (6.5-8)', value: students.filter(s => {
      const gpa = calculateStudentGPA(s);
      return gpa >= 6.5 && gpa < 8;
    }).length },
    { name: 'TB (5-6.5)', value: students.filter(s => {
      const gpa = calculateStudentGPA(s);
      return gpa >= 5 && gpa < 6.5;
    }).length },
    { name: 'Yếu (<5)', value: students.filter(s => {
        const gpa = calculateStudentGPA(s);
        // Chỉ tính là yếu nếu có điểm (gpa > 0) mà dưới 5. Nếu chưa có điểm (gpa=0) thì thôi hoặc đưa vào nhóm khác.
        // Ở đây tạm tính gpa < 5 bao gồm cả chưa có điểm để đơn giản, hoặc bạn có thể filter gpa > 0
        return gpa < 5;
    }).length },
  ];

  const classPerformance = Array.from(new Set(students.map(s => s.className))).map(className => {
    const classStudents = students.filter(s => s.className === className);
    if (classStudents.length === 0) return { name: `Lớp ${className}`, score: 0 };

    const classAvg = classStudents.reduce((acc, s) => acc + calculateStudentGPA(s), 0) / classStudents.length;
    return { name: `Lớp ${className || '?' }`, score: parseFloat(classAvg.toFixed(1)) };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Tổng quan</h2>
           <p className="text-slate-500">Thống kê dữ liệu trường học cập nhật mới nhất</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border">
          Năm học 2023 - 2024
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng học sinh</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalStudents}</h3>
            <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> +2.5% so với tháng trước</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">Đang theo học</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{activeStudents}</h3>
            <p className="text-xs text-slate-400 mt-1">/{totalStudents} học sinh</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">ĐTB Toán</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{avgMath}</h3>
             <p className="text-xs text-amber-600 flex items-center mt-1"><AlertCircle size={12} className="mr-1" /> Cần cải thiện</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Award size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">ĐTB Ngữ Văn</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{avgLit}</h3>
            <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> Ổn định</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Điểm trung bình theo lớp</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 10]} />
                <RechartsTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Phân loại học lực</h3>
          <div className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;