import React, { useState, useEffect } from 'react';
import { Save, Search, User, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Student } from '../types';

interface ScoreManagementProps {
  students: Student[];
  onUpdateScore: (studentId: string | number, newScores: any) => void;
  onAddStudent?: any;
  onDeleteStudent?: any;
}

const ScoreManagement: React.FC<ScoreManagementProps> = ({ students }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | string | null>(null); // Cho phép lưu cả ID tạm

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentCode && s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- 1. GỌI API & LỌC TRÙNG LẶP ---
  useEffect(() => {
    if (selectedStudentId) {
      setLoading(true);
      fetch(`http://localhost:8080/api/grades/student/${selectedStudentId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Dữ liệu gốc từ API:", data);

          if (Array.isArray(data)) {
            // THUẬT TOÁN: Lọc trùng lặp + Chuẩn hóa tên (Trim)
            const uniqueMap = data.reduce((acc: any, item: any) => {
                // Chuẩn hóa key: Cắt khoảng trắng thừa + chữ thường để so sánh chính xác
                const cleanName = item.subjectName ? item.subjectName.trim().toLowerCase() : 'unknown';
                const key = `${cleanName}-${item.semester}`;

                const existingItem = acc[key];

                // Ưu tiên giữ lại item có ID nếu trùng key (quan trọng để tránh mất ID)
                if (!existingItem || (!existingItem.id && item.id)) {
                   acc[key] = item;
                }
                return acc;
            }, {});

            setGrades(Object.values(uniqueMap));
          } else {
            setGrades([]);
          }

          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi lấy điểm:", err);
          setLoading(false);
        });
    } else {
      setGrades([]);
    }
  }, [selectedStudentId]);

  // --- 2. XỬ LÝ NHẬP ĐIỂM ---
  const handleInputChange = (index: number, field: string, value: string) => {
    if (value !== '') {
        const num = parseFloat(value);
        if (num < 0 || num > 10) return;
    }

    setGrades(prevGrades => prevGrades.map((g, i) => {
      if (i === index) {
        return { ...g, [field]: value };
      }
      return g;
    }));
  };

  // --- 3. LƯU ĐIỂM (TỰ ĐỘNG CHỌN UPDATE HOẶC CREATE) ---
  const handleSaveRow = async (grade: any) => {
    // Sử dụng ID thật hoặc tạo ID tạm để hiển thị loading
    const tempId = grade.id || `new-${grade.subjectName}-${grade.semester}`;
    setSavingId(tempId);

    // Chuẩn bị dữ liệu gửi đi
    const payload = {
        ...grade,
        // Đảm bảo luôn có studentId (nếu data gốc thiếu thì lấy từ selectedStudentId)
        studentId: grade.studentId || selectedStudentId,
        scoreOral: grade.scoreOral === '' || grade.scoreOral === null ? null : parseFloat(grade.scoreOral),
        score15m: grade.score15m === '' || grade.score15m === null ? null : parseFloat(grade.score15m),
        score45m: grade.score45m === '' || grade.score45m === null ? null : parseFloat(grade.score45m),
        scoreFinal: grade.scoreFinal === '' || grade.scoreFinal === null ? null : parseFloat(grade.scoreFinal),
    };

    try {
      let response;

      // LOGIC QUAN TRỌNG:
      // - Nếu có ID: Gọi PUT (Cập nhật)
      // - Nếu KHÔNG có ID: Gọi POST (Tạo mới)
      if (grade.id) {
        // Cập nhật điểm đã có
        response = await fetch(`http://localhost:8080/api/grades/${grade.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Tạo điểm mới
        // Xóa trường id null để tránh lỗi server
        const createPayload = { ...payload };
        delete createPayload.id;

        response = await fetch(`http://localhost:8080/api/grades`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload)
        });
      }

      if (response.ok) {
        const updatedGrade = await response.json();

        // Cập nhật lại giao diện ngay lập tức
        setGrades(prev => prev.map(g => {
            // Tìm dòng vừa lưu để update lại ID thật từ server trả về
            // So sánh tên môn và học kỳ vì dòng cũ có thể chưa có ID
            const isMatch = (g.id && g.id === updatedGrade.id) ||
                            (g.subjectName === updatedGrade.subjectName && g.semester === updatedGrade.semester);

            return isMatch ? updatedGrade : g;
        }));

        // alert("Lưu thành công!");
      } else {
        // Nếu lỗi 404 ở đây nghĩa là Backend chưa viết hàm @PostMapping
        if (response.status === 404) {
            alert("Lỗi 404: Server chưa hỗ trợ chức năng 'Tạo mới điểm'. Vui lòng kiểm tra lại Backend.");
        } else {
            alert("Lỗi khi lưu điểm! Mã lỗi: " + response.status);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Không kết nối được server.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 animate-fade-in">
      {/* CỘT TRÁI: DANH SÁCH HỌC SINH */}
      <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white z-10">
          <h3 className="font-bold text-slate-800 mb-4">Danh sách học sinh</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã HS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                selectedStudentId === student.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                  : 'hover:bg-slate-50 text-slate-600 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${selectedStudentId === student.id ? 'bg-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                {student.fullName.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-semibold text-sm truncate">{student.fullName}</p>
                <p className="text-xs opacity-70 truncate">{student.studentCode} - {student.className}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: BẢNG ĐIỂM */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {!selectedStudentId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <BookOpen size={64} className="mb-4 text-slate-200" />
            <p>Chọn học sinh để nhập điểm</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <User size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">Sổ Điểm Chi Tiết</h3>
                    <p className="text-xs text-slate-500">Nhấn icon Save bên phải để lưu từng môn</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                 <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500"/></div>
              ) : grades.length === 0 ? (
                 <div className="text-center text-orange-500 p-10 bg-orange-50 rounded-xl flex flex-col items-center">
                    <AlertCircle className="mb-2"/>
                    <p>Học sinh này chưa có bảng điểm.</p>
                 </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-3 text-left">Môn học</th>
                        <th className="p-3 text-center">Học kỳ</th>
                        <th className="p-3 text-center w-20">Miệng</th>
                        <th className="p-3 text-center w-20">15'</th>
                        <th className="p-3 text-center w-20">1 Tiết</th>
                        <th className="p-3 text-center w-20">Thi</th>
                        <th className="p-3 text-center bg-blue-50 text-blue-700">TB</th>
                        <th className="p-3 text-center">Lưu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {grades.map((grade, index) => {
                         // Tạo key an toàn: Dùng ID nếu có, không thì dùng index
                         const rowKey = grade.id || `temp-${index}`;
                         const isSaving = savingId === rowKey || savingId === grade.id;

                         return (
                            <tr key={rowKey} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-medium text-slate-800">{grade.subjectName}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold ${grade.semester === 1 ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {grade.semester === 1 ? 'HK1' : 'HK2'}
                                </span>
                              </td>

                              {['scoreOral', 'score15m', 'score45m', 'scoreFinal'].map((field) => (
                                  <td key={field} className="p-2">
                                      <input
                                        type="number"
                                        min="0" max="10" step="0.1"
                                        className="w-full text-center p-1.5 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium text-slate-700"
                                        placeholder="-"
                                        value={grade[field] ?? ''}
                                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                                      />
                                  </td>
                              ))}

                              <td className="p-3 text-center font-bold text-blue-600 bg-blue-50/30">
                                {grade.scoreAverage || '-'}
                              </td>

                              <td className="p-2 text-center">
                                <button
                                    onClick={() => handleSaveRow(grade)}
                                    disabled={isSaving}
                                    className={`p-2 rounded-lg transition-all ${
                                        isSaving
                                        ? 'bg-blue-50 text-blue-400'
                                        : 'text-slate-400 hover:text-white hover:bg-blue-500 shadow-sm hover:shadow-md'
                                    }`}
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
                                </button>
                              </td>
                            </tr>
                         );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreManagement;