// // backend/src/application/use-cases/classroom/startClassroom.ts

// import { classroomRepository } from '../../repositories/classroomRepository';
// import { Classroom } from '../../domain/entities/Classroom';

// interface StartClassroomInput {
//   userId: string;
//   className: string;
//   description?: string;
//   // Add other fields as needed
// }

// export const startClassroom = async (userId: string, data: StartClassroomInput): Promise<Classroom> => {
//   // Example logic: Creating a new classroom
//   const { className, description } = data;
//   const newClassroom = await classroomRepository.create({
//     teacher: userId,
//     className,
//     description,
//     // Additional fields initialization
//   });
//   return newClassroom;
// };
