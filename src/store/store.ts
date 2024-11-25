import { create } from 'zustand';
import { Class, Student, Instructor, Vehicle } from '../types';

interface Store {
  classes: Class[];
  students: Student[];
  instructors: Instructor[];
  vehicles: Vehicle[];
  addClass: (newClass: Class) => void;
  updateClass: (id: string, updatedClass: Class) => void;
  deleteClass: (id: string) => void;
  addStudentToClass: (classId: string, studentId: string) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Student) => void;
  deleteStudent: (id: string) => void;
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (id: string, instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  classes: [],
  students: [],
  instructors: [],
  vehicles: [],

  addClass: (newClass) =>
    set((state) => ({ classes: [...state.classes, newClass] })),

  updateClass: (id, updatedClass) =>
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === id ? updatedClass : cls
      ),
    })),

  deleteClass: (id) =>
    set((state) => ({
      classes: state.classes.filter((cls) => cls.id !== id),
      students: state.students.map(student => ({
        ...student,
        scheduledClasses: student.scheduledClasses.filter(classId => classId !== id)
      })),
      instructors: state.instructors.map(instructor => ({
        ...instructor,
        assignedClasses: instructor.assignedClasses.filter(classId => classId !== id)
      }))
    })),

  addStudentToClass: (classId, studentId) =>
    set((state) => {
      const updatedClass = state.classes.find(c => c.id === classId);
      if (!updatedClass || 
          (updatedClass.type === 'practical' && updatedClass.students.length >= 1) ||
          (updatedClass.type === 'seminar' && updatedClass.students.length >= 10)) {
        return state;
      }

      return {
        classes: state.classes.map(cls =>
          cls.id === classId
            ? { ...cls, students: [...cls.students, studentId] }
            : cls
        ),
        students: state.students.map(student =>
          student.id === studentId
            ? { ...student, scheduledClasses: [...student.scheduledClasses, classId] }
            : student
        )
      };
    }),

  removeStudentFromClass: (classId, studentId) =>
    set((state) => ({
      classes: state.classes.map(cls =>
        cls.id === classId
          ? { ...cls, students: cls.students.filter(id => id !== studentId) }
          : cls
      ),
      students: state.students.map(student =>
        student.id === studentId
          ? { ...student, scheduledClasses: student.scheduledClasses.filter(id => id !== classId) }
          : student
      )
    })),

  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),

  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? updatedStudent : student
      ),
    })),

  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
      classes: state.classes.map(cls => ({
        ...cls,
        students: cls.students.filter(studentId => studentId !== id)
      }))
    })),

  addInstructor: (instructor) =>
    set((state) => ({ instructors: [...state.instructors, instructor] })),

  updateInstructor: (id, updatedInstructor) =>
    set((state) => ({
      instructors: state.instructors.map((instructor) =>
        instructor.id === id ? updatedInstructor : instructor
      ),
    })),

  deleteInstructor: (id) =>
    set((state) => ({
      instructors: state.instructors.filter((instructor) => instructor.id !== id),
      classes: state.classes.filter(cls => cls.instructorId !== id)
    })),

  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [...state.vehicles, vehicle] })),

  updateVehicle: (id, updatedVehicle) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id ? updatedVehicle : vehicle
      ),
    })),

  deleteVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
      classes: state.classes.map(cls => ({
        ...cls,
        vehicleId: cls.vehicleId === id ? undefined : cls.vehicleId
      }))
    })),
}));