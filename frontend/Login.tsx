import React, { useState } from 'react';
import { User, Lock, GraduationCap, School, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'; // Thêm icon Loader2, AlertCircle

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // --- STATE ---
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Thêm 2 state mới để xử lý API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- HÀM XỬ LÝ ĐĂNG NHẬP (ĐÃ SỬA ĐỔI) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');       // Xóa lỗi cũ
    setIsLoading(true); // Bật trạng thái loading

    try {
      // Gọi API Backend Spring Boot
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Gửi dữ liệu đúng theo LoginRequest của Backend
        body: JSON.stringify({
          username: username,
          password: password,
          role: role === 'student' ? 'STUDENT' : 'TEACHER' // Chuyển sang chữ hoa để khớp với Backend
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Đăng nhập thành công:", data);

        // 1. Lưu thông tin user vào bộ nhớ trình duyệt
        localStorage.setItem("user", JSON.stringify(data));

        // 2. Thông báo cho App biết đã login xong
        onLogin(role);
      } else {
        // Nếu Server trả về lỗi (401, 403...)
        const errorText = await response.text();
        setError(errorText || "Thông tin đăng nhập không chính xác!");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Không thể kết nối đến Server. Vui lòng kiểm tra lại Backend!");
    } finally {
      setIsLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Left Side - Logo & Branding (GIỮ NGUYÊN) */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 z-0" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl ring-8 ring-white/10 p-4">
            <School size={80} className="text-blue-900" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Trường THCS Chu Văn An
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed opacity-90">
            Hệ thống quản lý học sinh và kết nối giáo dục trực tuyến.
            Đồng hành cùng sự phát triển của thế hệ tương lai.
          </p>
        </div>

        <div className="absolute bottom-8 text-blue-300 text-sm font-light">
          © 2024 EduManager System. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Đăng nhập</h2>
            <p className="text-slate-500 mt-2">
              Chào mừng quay trở lại! Vui lòng nhập thông tin để tiếp tục.
            </p>
          </div>

          {/* Role Slider (GIỮ NGUYÊN) */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex relative select-none">
            <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring ${role === 'student' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
            />
            <button
              type="button"
              onClick={() => { setRole('student'); setError(''); }} // Reset lỗi khi đổi tab
              className={`flex-1 flex items-center justify-center gap-2 py-3 z-10 text-sm font-semibold transition-colors rounded-lg ${role === 'student' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={18} />
              Học sinh / Phụ huynh
            </button>
            <button
              type="button"
              onClick={() => { setRole('teacher'); setError(''); }} // Reset lỗi khi đổi tab
              className={`flex-1 flex items-center justify-center gap-2 py-3 z-10 text-sm font-semibold transition-colors rounded-lg ${role === 'teacher' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <GraduationCap size={18} />
              Giáo viên
            </button>
          </div>

          {/* THÔNG BÁO LỖI (MỚI) */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {role === 'student' ? 'Mã học sinh' : 'Email đăng nhập'}
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    placeholder={role === 'student' ? "VD: HS001" : "VD: gv01@gmail.com"}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            {/* BUTTON CÓ HIỆU ỨNG LOADING (MỚI) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập ngay</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Gặp khó khăn khi đăng nhập? <a href="#" className="text-blue-600 font-semibold hover:underline">Liên hệ hỗ trợ</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;