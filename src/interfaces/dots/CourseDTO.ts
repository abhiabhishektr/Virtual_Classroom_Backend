export interface CourseDTO {
  title: string;
  description: string;
  instructorId: string;
  duration: number;
  startDate: Date;
  fees: number;
  category: string;
  imageUrl: string;
}

export interface CourseTeacherDTO {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  fees: number;
}
