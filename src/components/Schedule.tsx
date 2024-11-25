import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Class } from '../types';
import { useStore } from '../store/store';

export default function Schedule() {
  const [showNewClass, setShowNewClass] = useState(false);
  const [showManageStudents, setShowManageStudents] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState({
    type: 'seminar',
    date: '',
    time: '',
    instructorId: '',
    vehicleId: '',
  });

  const { 
    classes, 
    addClass, 
    deleteClass, 
    instructors, 
    vehicles,
    students,
    addStudentToClass,
    removeStudentFromClass
  } = useStore();

  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
   
    const conflict = classes.find(
      (c) =>
        c.date === newClass.date &&
        c.time === newClass.time &&
        (c.instructorId === newClass.instructorId || c.vehicleId === newClass.vehicleId)
    );
  
    if (conflict) {
      alert('Ya existe una clase en este horario con el mismo instructor o vehículo.');
      return;
    }
  

    const classId = Math.random().toString(36).substr(2, 9);
    addClass({
      ...newClass,
      id: classId,
      students: [],
      maxCapacity: newClass.type === 'seminar' ? 10 : 1,
    } as Class);
    setShowNewClass(false);
  };
  

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('¿Está seguro de eliminar esta clase?')) {
      deleteClass(classId);
    }
  };

  const getClassDetails = (classItem: Class) => {
    const instructor = instructors.find(i => i.id === classItem.instructorId);
    const vehicle = vehicles.find(v => v.id === classItem.vehicleId);
    const enrolledStudents = students.filter(s => classItem.students.includes(s.id));
    
    return {
      instructor: instructor?.name || 'Sin instructor',
      vehicle: vehicle?.model || 'Sin vehículo',
      students: enrolledStudents,
      available: classItem.maxCapacity - classItem.students.length
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Horarios y Reservas</h2>
        <button
          onClick={() => setShowNewClass(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
        >
          <Plus size={20} />
          <span>Nueva Clase</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-[100px_1fr] gap-4">
          <div className="bg-red-50 p-4">
            <div className="h-16"></div>
            {timeSlots.map(time => (
              <div key={time} className="h-20 flex items-center justify-center text-gray-600">
                {time}
              </div>
            ))}
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const formattedDate = format(date, 'yyyy-MM-dd');
                return (
                  <div key={i} className="text-center">
                    <div className="h-16 flex flex-col justify-center bg-red-50 rounded-t-lg">
                      <span className="font-semibold">{format(date, 'EEEE')}</span>
                      <span className="text-sm text-gray-600">{format(date, 'dd/MM')}</span>
                    </div>
                    {timeSlots.map(time => {
                      const classForSlot = classes.find(
                        c => c.date === formattedDate && c.time === time
                      );
                      return (
                        <div key={time} className="h-20 border border-gray-200 flex items-center justify-center">
                          {classForSlot ? (
                            <div className="bg-red-100 p-2 rounded-lg w-full h-full flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold">
                                  {classForSlot.type === 'seminar' ? 'Seminario' : 'Práctica'}
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setSelectedClass(classForSlot);
                                      setShowManageStudents(true);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Users size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClass(classForSlot.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {getClassDetails(classForSlot).instructor}
                              </div>
                              <div className="text-xs text-gray-600">
                                {classForSlot.students.length}/{classForSlot.maxCapacity} cupos
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setNewClass({
                                  ...newClass,
                                  date: formattedDate,
                                  time,
                                });
                                setShowNewClass(true);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Plus size={20} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showNewClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nueva Clase</h3>
              <button onClick={() => setShowNewClass(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Clase</label>
                <select
                  value={newClass.type}
                  onChange={(e) => setNewClass({ ...newClass, type: e.target.value as 'seminar' | 'practical' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="seminar">Seminario</option>
                  <option value="practical">Práctica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select
                  value={newClass.instructorId}
                  onChange={(e) => setNewClass({ ...newClass, instructorId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Seleccionar instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              {newClass.type === 'practical' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                  <select
                    value={newClass.vehicleId}
                    onChange={(e) => setNewClass({ ...newClass, vehicleId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} - {vehicle.plate}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewClass(false)}
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

      {showManageStudents && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[480px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Gestionar Estudiantes</h3>
              <button onClick={() => {
                setShowManageStudents(false);
                setSelectedClass(null);
              }}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Estudiantes Inscritos</h4>
                {selectedClass.students.length > 0 ? (
                  <div className="space-y-2">
                    {students
                      .filter(s => selectedClass.students.includes(s.id))
                      .map(student => (
                        <div key={student.id} className="flex justify-between items-center">
                          <span>{student.name}</span>
                          <button
                            onClick={() => removeStudentFromClass(selectedClass.id, student.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay estudiantes inscritos</p>
                )}
              </div>
              
              {selectedClass.students.length < selectedClass.maxCapacity && (
                <div>
                  <h4 className="font-medium mb-2">Agregar Estudiante</h4>
                  <div className="space-y-2">
                    {students
                      .filter(s => !selectedClass.students.includes(s.id))
                      .map(student => (
                        <div key={student.id} className="flex justify-between items-center">
                          <span>{student.name}</span>
                          <button
                            onClick={() => addStudentToClass(selectedClass.id, student.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowManageStudents(false);
                  setSelectedClass(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}