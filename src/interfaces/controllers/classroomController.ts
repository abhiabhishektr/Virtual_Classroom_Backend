// // backend/src/interfaces/controllers/classroomController.ts

// import { Request, Response } from 'express';
// import { startClassroom as startClassroomUseCase } from '../../application/use-cases/classroom/startClassroom';
// import { joinClassroom as joinClassroomUseCase } from '../../application/use-cases/classroom/joinClassroom';

// export const startClassroom = async (req: Request, res: Response) => {
//   try {
//     const classroom = await startClassroomUseCase((req as any).user, req.body);
//     res.status(201).json(classroom);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const joinClassroom = async (req: Request, res: Response) => {
//   try {
//     const classroom = await joinClassroomUseCase((req as any).user, req.body);
//     res.status(200).json(classroom);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
