import React, { useEffect, useState } from 'react';
import { LogOut, User, Calendar, MapPin, Phone, School, Award, ShieldCheck, Loader2 } from 'lucide-react';

interface StudentPortalProps {
  student: any;
  onLogout: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ student, onLogout }) => {

  // State để lưu điểm số lấy từ Backend
  const [gradesData, setGradesData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // --- HÀM GỌI API LẤY ĐIỂM ---
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        // Gọi vào API mà bạn vừa test thành công trên trình duyệt
        // Lưu ý: student.id phải lấy đúng từ lúc đăng nhập
        const response = await fetch(`http://localhost:8080/api/grades/student/${student.id}`);

        if (response.ok) {
          const rawData = await response.json();
          // Chế biến dữ liệu phẳng từ Backend thành dạng gom nhóm theo môn học
          const processed = processGrades(rawData);
          setGradesData(processed);
        }
      } catch (error) {
        console.error("Lỗi lấy điểm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (student && student.id) {
      fetchGrades();
    }
  }, [student]);

  // --- HÀM CHẾ BIẾN DỮ LIỆU (HELPER) ---
  // Biến đổi: [{subject: Toán, sem: HK1}, {subject: Toán, sem: HK2}]
  // Thành: { Toán: { sem1: {...}, sem2: {...} } }
  const processGrades = (data: any[]) => {
    const result: any = {};

    data.forEach(item => {
      const subjName = item.subjectName;
      if (!result[subjName]) {
        result[subjName] = { sem1: {}, sem2: {}, final: null };
      }

      // Kiểm tra xem item này thuộc học kỳ nào để xếp vào chỗ đúng
      if (item.semester === 'HK1') {
        result[subjName].sem1 = item;
      } else if (item.semester === 'HK2') {
        result[subjName].sem2 = item;
      }

      // Tạm thời lấy điểm trung bình HK2 làm điểm tổng kết (hoặc logic khác tùy bạn)
      if (item.scoreAverage) {
          result[subjName].final = item.scoreAverage;
      }
    });
    return result;
  };

  // Helper tạo Avatar từ tên
  const getInitials = (name: string) => {
    if (!name) return "HS";
    return name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                <School size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800">Cổng Thông Tin Học Sinh</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-800">{student.fullName || "Học sinh"}</span>
                <span className="text-xs text-slate-500">
                    {student.studentCode || "Mã HS"} {student.className ? `- Lớp ${student.className}` : ""}
                </span>
              </div>
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                <LogOut size={18} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">

        {/* Profile Section (Giữ nguyên như cũ) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
             <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 shadow-md overflow-hidden flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-500">{getInitials(student.fullName)}</span>
                </div>
             </div>
          </div>
          <div className="pt-16 pb-6 px-8">
             <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-slate-900">{student.fullName}</h1>
                   <p className="text-slate-500 font-medium">Mã học sinh: {student.studentCode}</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm border border-blue-100">
                  Trạng thái: {student.status || "Đang học"}
                </div>
             </div>
             {/* Thông tin chi tiết */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="flex items-center gap-3 text-slate-600">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><School size={16} /></div>
                   <div><p className="text-xs text-slate-400">Lớp học</p><p className="font-medium text-slate-800">{student.className || "6A"}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={16} /></div>
                   <div><p className="text-xs text-slate-400">Giới tính</p><p className="font-medium text-slate-800">{student.gender}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Calendar size={16} /></div>
                   <div><p className="text-xs text-slate-400">Ngày sinh</p><p className="font-medium text-slate-800">{student.dateOfBirth}</p></div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Phone size={16} /></div>
                   <div><p className="text-xs text-slate-400">Liên hệ phụ huynh</p><p className="font-medium text-slate-800">{student.parentPhoneNumber}</p></div>
                </div>
             </div>
          </div>
        </div>

        {/* --- BẢNG ĐIỂM ĐIỆN TỬ (PHẦN QUAN TRỌNG NHẤT) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Award className="text-yellow-500" />
               Sổ Điểm Điện Tử
             </h2>
             <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               Năm học: 2023 - 2024
             </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
                <div className="p-12 flex justify-center text-slate-500 gap-2">
                    <Loader2 className="animate-spin" /> Đang tải bảng điểm...
                </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th rowSpan={2} className="px-6 py-4 font-bold text-left bg-slate-100 border-r border-slate-200 w-1/4">Môn Học</th>
                  <th colSpan={5} className="px-4 py-2 text-center border-r border-slate-200 font-bold bg-blue-50 text-blue-800">Học Kỳ 1</th>
                  <th colSpan={5} className="px-4 py-2 text-center border-r border-slate-200 font-bold bg-purple-50 text-purple-800">Học Kỳ 2</th>
                  <th rowSpan={2} className="px-6 py-4 font-bold text-center bg-yellow-50 text-yellow-800 w-24">Tổng Kết</th>
                </tr>
                <tr className="text-[10px] font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
                  {/* Sem 1 Header */}
                  <th className="px-2 py-2 w-12 border-r">Miệng</th>
                  <th className="px-2 py-2 w-12 border-r">15'</th>
                  <th className="px-2 py-2 w-12 border-r">1 Tiết</th>
                  <th className="px-2 py-2 w-12 border-r">Thi</th>
                  <th className="px-2 py-2 w-12 border-r bg-blue-50/50 text-blue-700">TB</th>
                  {/* Sem 2 Header */}
                  <th className="px-2 py-2 w-12 border-r">Miệng</th>
                  <th className="px-2 py-2 w-12 border-r">15'</th>
                  <th className="px-2 py-2 w-12 border-r">1 Tiết</th>
                  <th className="px-2 py-2 w-12 border-r">Thi</th>
                  <th className="px-2 py-2 w-12 border-r bg-purple-50/50 text-purple-700">TB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {Object.keys(gradesData).length > 0 ? (
                  Object.keys(gradesData).map((subjectName) => {
                    const row = gradesData[subjectName];
                    const s1 = row.sem1 || {};
                    const s2 = row.sem2 || {};

                    return (
                      <tr key={subjectName} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 border-r border-slate-200 bg-slate-50/30">
                          {subjectName}
                        </td>

                        {/* Điểm HK1 */}
                        <td className="px-2 text-center border-r">{s1.scoreOral || '-'}</td>
                        <td className="px-2 text-center border-r">{s1.score15m || '-'}</td>
                        <td className="px-2 text-center border-r">{s1.score45m || '-'}</td>
                        <td className="px-2 text-center font-bold border-r">{s1.scoreFinal || '-'}</td>
                        <td className="px-2 text-center font-bold text-blue-600 bg-blue-50/30 border-r">{s1.scoreAverage || '-'}</td>

                        {/* Điểm HK2 */}
                        <td className="px-2 text-center border-r">{s2.scoreOral || '-'}</td>
                        <td className="px-2 text-center border-r">{s2.score15m || '-'}</td>
                        <td className="px-2 text-center border-r">{s2.score45m || '-'}</td>
                        <td className="px-2 text-center font-bold border-r">{s2.scoreFinal || '-'}</td>
                        <td className="px-2 text-center font-bold text-purple-600 bg-purple-50/30 border-r">{s2.scoreAverage || '-'}</td>

                        {/* Tổng kết */}
                        <td className="px-6 text-center font-extrabold text-lg text-slate-800 bg-yellow-50/30">
                          {row.final || '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                    <tr>
                        <td colSpan={12} className="px-6 py-12 text-center text-slate-500">
                           <ShieldCheck size={48} className="mx-auto mb-3 text-slate-300"/>
                           Chưa có dữ liệu điểm môn nào.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;