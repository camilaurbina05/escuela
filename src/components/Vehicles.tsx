import React, { useState } from 'react';
import { Car, Calendar, Plus, X } from 'lucide-react';
import { Vehicle } from '../types';
import { useStore } from '../store/store';

export default function Vehicles() {
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    plate: '',
    availability: {
      'Mañana': true,
      'Tarde': true,
      'Noche': true,
    },
  });

  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleId = Math.random().toString(36).substr(2, 9);
    addVehicle({
      ...newVehicle,
      id: vehicleId,
    });
    setShowNewVehicle(false);
    setNewVehicle({
      model: '',
      plate: '',
      availability: {
        'Mañana': true,
        'Tarde': true,
        'Noche': true,
      },
    });
  };

  const handleUpdateAvailability = (vehicle: Vehicle, timeSlot: string) => {
    const updatedVehicle = {
      ...vehicle,
      availability: {
        ...vehicle.availability,
        [timeSlot]: !vehicle.availability[timeSlot],
      },
    };
    updateVehicle(vehicle.id, updatedVehicle);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este vehículo?')) {
      deleteVehicle(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehículos</h2>
        <button
          onClick={() => setShowNewVehicle(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
        >
          <Plus size={20} />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Car size={24} className="text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold">{vehicle.model}</h3>
                    <p className="text-sm text-gray-600">Patente: {vehicle.plate}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium flex items-center space-x-2 mb-3">
                <Calendar size={18} className="text-red-600" />
                <span>Disponibilidad</span>
              </h4>
              <div className="space-y-2">
                {Object.entries(vehicle.availability).map(([timeSlot, available]) => (
                  <div key={timeSlot} className="flex items-center justify-between">
                    <span>{timeSlot}</span>
                    <button
                      onClick={() => handleUpdateAvailability(vehicle, timeSlot)}
                      className={`px-2 py-1 rounded-full text-sm ${
                        available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {available ? 'Disponible' : 'En uso'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Nuevo Vehículo</h3>
              <button onClick={() => setShowNewVehicle(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <input
                  type="text"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patente</label>
                <input
                  type="text"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad Inicial</label>
                {Object.entries(newVehicle.availability).map(([timeSlot, available]) => (
                  <div key={timeSlot} className="flex items-center justify-between mb-2">
                    <span>{timeSlot}</span>
                    <button
                      type="button"
                      onClick={() => setNewVehicle({
                        ...newVehicle,
                        availability: {
                          ...newVehicle.availability,
                          [timeSlot]: !available,
                        },
                      })}
                      className={`px-2 py-1 rounded-full text-sm ${
                        available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {available ? 'Disponible' : 'En uso'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewVehicle(false)}
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