// Common utility functions for Dream School app

// Date formatting functions
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('mr-IN');
};

export const formatDateForCalendar = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Grade calculation utilities
export const calculateGrade = (marks: number, totalMarks: number): string => {
  const percentage = (marks / totalMarks) * 100;
  
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
};

export const calculatePercentage = (marks: number, totalMarks: number): number => {
  return (marks / totalMarks) * 100;
};

// Subject names in Marathi
export const subjects = {
  marathi: 'मराठी',
  english: 'इंग्रजी',
  mathematics: 'गणित',
  science: 'विज्ञान',
  socialScience: 'सामाजिक शास्त्र',
  drawing: 'चित्रकला',
  physicalEducation: 'शारीरिक शिक्षण',
};

// Class levels
export const classes = ['१', '२', '३', '४', '५', '६', '७', '८'];

// Assessment types for CCE pattern
export const assessmentTypes = {
  fa1: 'सतत मूल्यांकन १',
  fa2: 'सतत मूल्यांकन २',
  sa1: 'अर्धवार्षिक परीक्षा',
  fa3: 'सतत मूल्यांकन ३',
  fa4: 'सतत मूल्यांकन ४',
  sa2: 'वार्षिक परीक्षा',
};

// Student data interface
export interface Student {
  id: string;
  name: string;
  class: string;
  rollNo: number;
  birthDate: string;
  parentName: string;
  contact: string;
}

// Assessment data interface
export interface Assessment {
  id: string;
  studentId: string;
  subject: string;
  assessmentType: string;
  marks: number;
  totalMarks: number;
  date: string;
  class: string;
}

// Calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'birthday' | 'holiday' | 'event' | 'exam';
  description?: string;
}

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validation functions
export const validateMarks = (marks: number, totalMarks: number): boolean => {
  return marks >= 0 && marks <= totalMarks;
};

export const validateStudentData = (student: Partial<Student>): boolean => {
  return !!(student.name && student.class && student.rollNo && student.birthDate);
};