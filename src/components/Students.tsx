import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { Student } from '../types';
import { useStore } from '../store/store';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewStudent, setShowNewStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    contact: '',
  });

  const { students, addStudent, updateStudent, deleteStudent } = useStore();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = Math.random().toString(36).substr(2, 9);
    addStudent({
      ...newStudent,
      id: studentId,
      scheduledClasses: [],
    });
    setShowNewStudent(false);
    setNewStudent({ name: '', contact: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este alumno?')) {
      deleteStudent(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alumnos</h2>
        <button
          onClick={() => setShowNewStudent(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
        >
          <UserPlus size={20} />
          <span>Nuevo Alumno</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clases Programadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {student.scheduledClasses.length} clases
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => {
                      setNewStudent({
                        name: student.name,
                        contact: student.contact,
                      });
                      setShowNewStudent(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Editar
                  </button>
                  <span className="mx-2">|</span>
                  <button 
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {newStudent.name ? 'Editar Alumno' : 'Nuevo Alumno'}
              </h3>
              <button onClick={() => {
                setShowNewStudent(false);
                setNewStudent({ name: '', contact: '' });
              }}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contacto</label>
                <input
                  type="tel"
                  value={newStudent.contact}
                  onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewStudent(false);
                    setNewStudent({ name: '', contact: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}