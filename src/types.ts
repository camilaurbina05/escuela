export interface Student {
  id: string;
  name: string;
  contact: string;
  scheduledClasses: string[];
}

export interface Instructor {
  id: string;
  name: string;
  availability: {
    [key: string]: boolean;
  };
  assignedClasses: string[];
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  availability: {
    [key: string]: {
      [hour: string]: boolean;
    };
  };
}

export interface Class {
  id: string;
  type: 'seminar' | 'practical';
  date: string;
  time: string;
  instructorId: string;
  vehicleId?: string;
  students: string[];
  maxCapacity: number;
}