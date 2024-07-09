// // backend/src/application/use-cases/classroom/joinClassroom.ts

// import { classroomRepository } from '../../repositories/classroomRepository';
// import { Classroom } from '../../domain/entities/Classroom';

// interface JoinClassroomInput {
//   userId: string;
//   classroomId: string;
// }

// export const joinClassroom = async (userId: string, data: JoinClassroomInput): Promise<Classroom> => {
//   // Example logic: Adding a user to an existing classroom
//   const { classroomId } = data;
//   const classroom = await classroomRepository.findById(classroomId);
//   if (!classroom) {
//     throw new Error('Classroom not found');
//   }
//   // Logic to check if the user is already a member can be added here

//   // Example: Updating the classroom with the new member
//   classroom.members.push(userId);
//   await classroom.save();

//   return classroom;
// };
