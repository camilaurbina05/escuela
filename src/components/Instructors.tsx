import React, { useState } from 'react';
import { UserCog, Calendar, Users as UsersIcon, Plus, X } from 'lucide-react';
import { Instructor } from '../types';
import { useStore } from '../store/store';

export default function Instructors() {
  const [showNewInstructor, setShowNewInstructor] = useState(false);
  const [showManageSchedule, setShowManageSchedule] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    availability: {
      'Lunes': true,
      'Martes': true,
      'Miércoles': true,
      'Jueves': true,
      'Viernes': true,
      'Sábado': false,
      'Domingo': false,
    },
  });

  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instructorId = Math.random().toString(36).substr(2, 9);
    addInstructor({
      ...newInstructor,
      id: instructorId,
      assignedClasses: [],
    });
    setShowNewInstructor(false);
    setNewInstructor({
      name: '',
      availability: {
        'Lunes': true,
        'Martes': true,
        'Miércoles': true,
        'Jueves': true,
        'Viernes': true,
        'Sábado': false,
        'Domingo': false,
      },
    });
  };

  const handleUpdateAvailability = (instructor: Instructor, day: string) => {
    const updatedInstructor = {
      ...instructor,
      availability: {
        ...instructor.availability,
        [day]: !instructor.availability[day],
      },
    };
    updateInstructor(instructor.id, updatedInstructor);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este instructor?')) {
      deleteInstructor(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Instructores</h2>
        <button
          onClick={() => setShowNewInstructor(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
        >
          <UserCog size={20} />
          <span>Nuevo Instructor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map(instructor => (
          <div key={instructor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCog size={24} className="text-red-600" />
                  <h3 className="text-lg font-semibold">{instructor.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(instructor.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium flex items-center space-x-2">
                  <Calendar size={18} className="text-red-600" />
                  <span>Disponibilidad</span>
                </h4>
                <div className="mt-2 space-y-1">
                  {Object.entries(instructor.availability).map(([day, available]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span>{day}</span>
                      <button
                        onClick={() => handleUpdateAvailability(instructor, day)}
                        className={`px-2 py-1 rounded-full text-sm ${
                          available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {available ? 'Disponible' : 'No disponible'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium flex items-center space-x-2">
                  <UsersIcon size={18} className="text-red-600" />
                  <span>Clases Asignadas</span>
                </h4>
                <div className="mt-2">
                  {instructor.assignedClasses.length > 0 ? (
                    instructor.assignedClasses.map((classId) => (
                      <div key={classId} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="text-sm">
                          <p>Clase ID: {classId}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No hay clases asignadas</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nuevo Instructor</h3>
              <button onClick={() => setShowNewInstructor(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  value={newInstructor.name}
                  onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad Inicial</label>
                {Object.entries(newInstructor.availability).map(([day, available]) => (
                  <div key={day} className="flex items-center justify-between mb-2">
                    <span>{day}</span>
                    <button
                      type="button"
                      onClick={() => setNewInstructor({
                        ...newInstructor,
                        availability: {
                          ...newInstructor.availability,
                          [day]: !available,
                        },
                      })}
                      className={`px-2 py-1 rounded-full text-sm ${
                        available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {available ? 'Disponible' : 'No disponible'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewInstructor(false)}
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