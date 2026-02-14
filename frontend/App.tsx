import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import ScoreManagement from './components/ScoreManagement';
import Login from './components/Login';
import StudentPortal from './components/StudentPortal';
import { Student, StudentScores } from './types';

const App: React.FC = () => {
  // 1. KHỞI TẠO STATE TỪ LOCALSTORAGE
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem("role") || "";
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // --- QUẢN LÝ DỮ LIỆU HỌC SINH ---
  const [students, setStudents] = useState<Student[]>([]);

  // --- HÀM GỌI API LẤY DANH SÁCH HỌC SINH ---
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/students");
      if (res.ok) {
        const data = await res.json();

        // Map dữ liệu từ Backend (Java DTO) sang Frontend (React Type)
        const mappedData = data.map((s: any) => ({
          ...s,
          // LƯU Ý QUAN TRỌNG:
          // Frontend cần 'id' là số ID trong Database để Sửa/Xóa chính xác.
          // 'studentCode' (Mã HS) chỉ để hiển thị.
          id: s.id,
          studentCode: s.studentCode,
          className: s.className || "Chưa xếp lớp",
          parentPhone: s.parentPhoneNumber,
          scores: {} // Tạm thời để trống
        }));

        setStudents(mappedData);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  // --- USE EFFECT: TỰ ĐỘNG TẢI DANH SÁCH ---
  useEffect(() => {
    if (userRole === 'teacher' || userRole === 'admin') {
      fetchStudents();
    }
  }, [userRole]);


  // --- HÀM XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT ---
  const handleLogin = (role: string) => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setUserRole(role);
    localStorage.setItem("role", role);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setUserRole('');
    setActiveTab('dashboard');
    setStudents([]);
  };

  // --- 1. CHỨC NĂNG THÊM (POST) ---
  const handleAddStudent = async (newStudent: Student) => {
    try {
      const response = await fetch("http://localhost:8080/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentCode: newStudent.studentCode, // Lưu ý: Form phải nhập studentCode
          fullName: newStudent.fullName,
          dateOfBirth: newStudent.dateOfBirth,
          gender: newStudent.gender,
          parentPhoneNumber: newStudent.parentPhone,
          className: newStudent.className,
          address: newStudent.address
        }),
      });

      if (response.ok) {
        alert("Thêm thành công!");
        fetchStudents(); // Load lại dữ liệu thật từ DB
      } else {
        alert("Lỗi thêm: " + await response.text());
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  // --- 2. CHỨC NĂNG SỬA (PUT) - ĐÃ SỬA LẠI CHO ĐÚNG ---
  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      console.log("Đang sửa học sinh ID:", updatedStudent.id);

      // Gọi API PUT kèm theo ID của học sinh
      const response = await fetch(`http://localhost:8080/api/students/${updatedStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: updatedStudent.fullName,
          dateOfBirth: updatedStudent.dateOfBirth,
          gender: updatedStudent.gender,
          parentPhoneNumber: updatedStudent.parentPhone,
          className: updatedStudent.className,
          address: updatedStudent.address,
          // Lưu ý: Thường Backend không cho sửa Mã HS (studentCode) nên có thể ko cần gửi hoặc backend sẽ bỏ qua
        }),
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        // QUAN TRỌNG: Gọi lại API để lấy dữ liệu đã được lưu trong DB
        // Điều này đảm bảo khi F5 dữ liệu vẫn còn.
        fetchStudents();
      } else {
        alert("Lỗi cập nhật: " + await response.text());
      }
    } catch (error) {
      console.error("Lỗi khi sửa:", error);
      alert("Lỗi kết nối Server");
    }
  };

  // --- 3. CHỨC NĂNG XÓA (DELETE) - ĐÃ SỬA LẠI CHO ĐÚNG ---
  const handleDeleteStudent = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này không?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Đã xóa học sinh!");
        fetchStudents(); // Load lại danh sách sau khi xóa
      } else {
        alert("Không thể xóa. Có thể do học sinh đã có điểm số.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  // --- Cập nhật điểm (Logic cũ, chưa nối API) ---
  const handleUpdateScore = (studentId: string, newScores: StudentScores) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, scores: newScores } : s
    ));
  };

  // --- LOGIC ĐIỀU HƯỚNG ---
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'student') {
    return <StudentPortal student={user} onLogout={handleLogout} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'students':
        return (
          <StudentList
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent} // Đã kết nối API
            onDeleteStudent={handleDeleteStudent} // Đã kết nối API
          />
        );
      case 'scores':
        return (
          <ScoreManagement
            students={students}
            onUpdateScore={handleUpdateScore}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Bảng điều khiển'}
              {activeTab === 'students' && 'Quản lý Hồ sơ'}
              {activeTab === 'scores' && 'Sổ Điểm Điện Tử'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-sm font-medium text-gray-600">Hệ thống ổn định</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
               <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-700">
                    {user.fullName || "Người dùng"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userRole === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                 {user.fullName ? user.fullName.split(' ').slice(-2).map((n:string) => n[0]).join('') : 'GV'}
               </div>
            </div>
          </div>
        </header>

        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;