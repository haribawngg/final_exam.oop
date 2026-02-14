import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Phone, X, Eye, Calendar, MapPin, User as UserIcon, Save, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Student, StudentStatus, StudentScores, Gender, GradeLevel } from '../types';
import { generateEmptyScores, SUBJECT_NAMES } from '../constants';

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAddStudent, onEditStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng học sinh mỗi trang

  // Add/Edit Student State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    fullName: '',
    id: '',
    className: '',
    dateOfBirth: '',
    gender: Gender.MALE,
    parentPhone: '',
    address: ''
  });

  // Derive unique classes for filter dropdown
  const classes = ['All', ...Array.from(new Set(students.map(s => s.className))).sort()];

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || student.className === filterClass;
    return matchesSearch && matchesClass;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterClass]);

  // Pagination Logic calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case StudentStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case StudentStatus.TRANSFERRED: return 'bg-yellow-100 text-yellow-700';
      case StudentStatus.DROPPED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setStudentFormData({
      fullName: '',
      id: '',
      className: '',
      dateOfBirth: '',
      gender: Gender.MALE,
      parentPhone: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setIsEditing(true);
    setStudentFormData({
      fullName: student.fullName,
      id: student.id,
      className: student.className,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      parentPhone: student.parentPhone,
      address: student.address
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh ${student.fullName} (${student.id})? Hành động này không thể hoàn tác.`)) {
      onDeleteStudent(student.id);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.fullName || !studentFormData.id || !studentFormData.className) return;

    if (isEditing) {
      // Find original student to preserve scores and other static data
      const originalStudent = students.find(s => s.id === studentFormData.id);
      
      const updatedStudent: Student = {
        ...originalStudent!, // Preserve scores, status, etc.
        fullName: studentFormData.fullName,
        dateOfBirth: studentFormData.dateOfBirth,
        gender: studentFormData.gender as Gender,
        className: studentFormData.className,
        parentPhone: studentFormData.parentPhone,
        address: studentFormData.address,
      };
      onEditStudent(updatedStudent);
    } else {
      // Add new student
      const newStudent: Student = {
        id: studentFormData.id,
        fullName: studentFormData.fullName,
        dateOfBirth: studentFormData.dateOfBirth || new Date().toISOString(),
        gender: studentFormData.gender as Gender,
        className: studentFormData.className,
        gradeLevel: GradeLevel.SIX, 
        status: StudentStatus.ACTIVE,
        scores: generateEmptyScores(),
        avatarUrl: `https://picsum.photos/100/100?random=${Date.now()}`,
        address: studentFormData.address || 'Đang cập nhật',
        parentPhone: studentFormData.parentPhone || 'Đang cập nhật'
      };
      onAddStudent(newStudent);
    }

    setIsModalOpen(false);
  };

  // Shared input class for consistency
  const inputClass = "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-colors disabled:bg-slate-100 disabled:text-slate-500";

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Danh sách học sinh</h2>
          <p className="text-slate-500">Quản lý hồ sơ, điểm số và thông tin liên lạc</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span>Thêm học sinh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã HS..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter size={20} className="text-slate-400" />
             <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
             >
                {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'Tất cả lớp' : `Lớp ${c}`}</option>)}
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider w-16">STT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">MSHS</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Họ và Tên</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Lớp</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">SĐT Phụ Huynh</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img className="h-8 w-8 rounded-full object-cover border border-slate-200" src={student.avatarUrl} alt="" />
                        <span className="text-sm font-medium text-slate-900">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {student.parentPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Sửa thông tin"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(student)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Xóa học sinh"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="text-slate-200" />
                      <p>Không tìm thấy học sinh nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastItem, filteredStudents.length)}</span> trong số <span className="font-medium">{filteredStudents.length}</span> kết quả
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={16} /> Trước
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-blue-600 text-white">
              <h3 className="text-xl font-bold">{isEditing ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    className={inputClass}
                    placeholder="VD: Nguyễn Văn A"
                    value={studentFormData.fullName}
                    onChange={e => setStudentFormData({...studentFormData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã học sinh <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    className={inputClass}
                    placeholder="VD: HS099"
                    value={studentFormData.id}
                    onChange={e => setStudentFormData({...studentFormData, id: e.target.value})}
                    disabled={isEditing} // Không cho phép sửa ID
                    title={isEditing ? "Không thể thay đổi mã học sinh" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label>
                  <input 
                    type="date" 
                    className={inputClass}
                    value={studentFormData.dateOfBirth}
                    onChange={e => setStudentFormData({...studentFormData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                  <select 
                    className={inputClass}
                    value={studentFormData.gender}
                    onChange={e => setStudentFormData({...studentFormData, gender: e.target.value as Gender})}
                  >
                    <option value={Gender.MALE}>Nam</option>
                    <option value={Gender.FEMALE}>Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lớp <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    className={inputClass}
                    placeholder="VD: 6A"
                    value={studentFormData.className}
                    onChange={e => setStudentFormData({...studentFormData, className: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SĐT Phụ huynh</label>
                  <input 
                    type="tel" 
                    className={inputClass}
                    placeholder="0912..."
                    value={studentFormData.parentPhone}
                    onChange={e => setStudentFormData({...studentFormData, parentPhone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="Địa chỉ liên hệ..."
                    value={studentFormData.address}
                    onChange={e => setStudentFormData({...studentFormData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 shadow-sm shadow-blue-500/30 transition-all"
                >
                  <Save size={18} />
                  {isEditing ? 'Cập nhật' : 'Lưu học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSCRIPT MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Bảng điểm chi tiết</h3>
                <p className="text-slate-500 mt-1">Năm học 2023 - 2024</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 bg-slate-50">
              
              {/* Student Info Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <img 
                  src={selectedStudent.avatarUrl} 
                  alt={selectedStudent.fullName} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                   <div>
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><UserIcon size={14}/> Họ và tên</p>
                      <p className="font-semibold text-slate-800 text-lg">{selectedStudent.fullName}</p>
                   </div>
                   <div>
                      <p className="text-sm text-slate-500 mb-1">Mã học sinh</p>
                      <p className="font-semibold text-slate-800 text-lg">{selectedStudent.id}</p>
                   </div>
                   <div>
                      <p className="text-sm text-slate-500 mb-1">Lớp</p>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-md">{selectedStudent.className}</span>
                   </div>
                   <div>
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Calendar size={14}/> Ngày sinh</p>
                      <p className="font-semibold text-slate-800">{new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                   </div>
                   <div className="sm:col-span-2">
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><MapPin size={14}/> Địa chỉ</p>
                      <p className="font-semibold text-slate-800">{selectedStudent.address}</p>
                   </div>
                </div>
              </div>

              {/* Detailed Transcript Table */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th rowSpan={2} className="px-4 py-3 text-left border-r border-blue-500 font-semibold min-w-[150px]">Môn học</th>
                        <th colSpan={4} className="px-4 py-2 text-center border-r border-blue-500 border-b font-semibold bg-blue-700">Học Kì 1</th>
                        <th colSpan={4} className="px-4 py-2 text-center border-r border-blue-500 border-b font-semibold bg-blue-700">Học Kì 2</th>
                        <th rowSpan={2} className="px-4 py-3 text-center font-bold bg-blue-800 min-w-[80px]">Tổng kết</th>
                      </tr>
                      <tr className="bg-blue-50 text-blue-900 text-xs font-semibold">
                        {/* Semester 1 Sub-columns */}
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">Miệng</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">15'</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">1 Tiết</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20 bg-blue-100">Cuối kỳ</th>
                        
                        {/* Semester 2 Sub-columns */}
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">Miệng</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">15'</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20">1 Tiết</th>
                        <th className="px-2 py-2 border-r border-blue-200 text-center w-20 bg-blue-100">Cuối kỳ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {(Object.keys(selectedStudent.scores) as Array<keyof StudentScores>).map((subjectKey) => {
                        const score = selectedStudent.scores[subjectKey];
                        return (
                          <tr key={subjectKey} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800 border-r border-slate-200">
                              {SUBJECT_NAMES[subjectKey]}
                            </td>
                            
                            {/* Semester 1 Data */}
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem1.oral}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem1.fifteen}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem1.fortyFive}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100 font-bold text-slate-800 bg-slate-50">{score.sem1.exam}</td>
                            
                            {/* Semester 2 Data */}
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem2.oral}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem2.fifteen}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100">{score.sem2.fortyFive}</td>
                            <td className="px-2 py-3 text-center border-r border-slate-100 font-bold text-slate-800 bg-slate-50">{score.sem2.exam}</td>
                            
                            {/* Final */}
                            <td className="px-2 py-3 text-center font-bold text-blue-700 bg-blue-50">
                              {score.final}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;