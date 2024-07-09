// backend/src/interfaces/controllers/classroomController.ts

import { Request, Response } from 'express';
import { startClassroom, joinClassroom } from '../../application/use-cases/classroom';

export const startClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await startClassroom((req as any).user, req.body);
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await joinClassroom((req as any).user, req.body);
    res.status(200).json(classroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
