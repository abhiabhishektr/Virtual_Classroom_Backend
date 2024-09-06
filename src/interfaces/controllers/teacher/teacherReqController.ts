// src/interfaces/controllers/teacher/teacherReqController.ts
import { Request, Response } from 'express';
import * as teacherRepository from '../../../application/repositories/teacherRepository';
import { User } from '../../../types/user';
import { ITeacherRequest } from '../../../infrastructure/database/models/TeacherRequest';
import { teacherRequestSchema } from '../../../validations/teacherRequestSchema';
import { userRepository } from '../../../application/repositories/userRepository';
import { teacherDashboardUseCase } from '../../../application/use-cases/Teacher/TeacherDashboardUseCase';
import { createTeacherRepository } from '../../../application/repositories/teacherDashboardRepository';


const repository = createTeacherRepository();
const teacherUseCase = teacherDashboardUseCase(repository);




export const teacherDashboardController = async (req: Request, res: Response) => {
    try {
        const teacherId = (req.user as User)?.id ?? null;
        const getCourses = await teacherUseCase.getCourseSalesData(teacherId);
        const getsales = await teacherUseCase.getSalesData(teacherId);

        res.status(200).json({ data: {getCourses,getsales }});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new teacher request
export const createTeacherRequest = async (req: Request, res: Response) => {
    try {
        await teacherRequestSchema.validate(req.body, { abortEarly: false });
        const { qualification, experience, subjectsToTeach, bio } = req.body;

        const userId = ((req.user as User).id); // Convert user ID to ObjectId

        const existingRequest = await teacherRepository.findOne({ userId });
        if (existingRequest) {
            return res.status(400).json({ message: 'A request from this user already exists.' });
        }

        const newRequest = await teacherRepository.createTeacherRequest({
            userId,
            highestQualification: qualification,
            yearsOfTeachingExperience: experience,
            subjects: subjectsToTeach,
            bio,
            status: 'pending'
        } as ITeacherRequest);

        res.status(201).json({ message: 'Teacher request created successfully', data: newRequest });

    } catch (error) {

        res.status(500).json({ message: 'Error creating teacher request', error });
    }
};

export const teacherRequestStatus = async (req: Request, res: Response) => {

    try {

        // Get the user ID from the request object
        const userId = (req.user as User).id; // Make sure req.user is typed correctly

        // Fetch the teacher request status for the user
        const request = await teacherRepository.findOne({ userId });

        if (!request) {
            return res.status(404).json({ message: 'No teacher request found for the user.' });
        }

        // Respond with the request data and status
        res.status(200).json({
            request: {
                highestQualification: request.highestQualification,
                yearsOfTeachingExperience: request.yearsOfTeachingExperience,
                subjects: request.subjects,
                bio: request.bio,
            },
            status: request.status
        });
    } catch (error) {
        console.log(error);

        console.error('Error fetching teacher request status:', error);
        res.status(500).json({ message: 'Error fetching teacher request status', error: error });
    }
};




// Get all teacher requests
export const getAllTeacherRequests = async (req: Request, res: Response) => {
    try {
        const requests = await teacherRepository.getAllTeacherRequests();

        res.status(200).json({ data: requests });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving teacher requests', error });
    }
};

// Get a teacher request by ID
export const getTeacherRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await teacherRepository.getTeacherRequestById(id);

        if (!request) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }

        res.status(200).json({ data: request });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving teacher request', error });
    }
};

// Update teacher request status
export const updateTeacherRequestStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`status: ${status}`, `id: ${id}`);

    try {
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update the teacher request status
        const updatedRequest = await teacherRepository.updateTeacherRequestStatus(id, status);

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }

        // If the status is 'approved', update the user role
        if (status === 'approved') {
            await userRepository.updateUserRole(updatedRequest.userId, 'teacher');
        }
        if (status === 'rejected') {
            await userRepository.updateUserRole(updatedRequest.userId, 'user');
        }

        res.status(200).json({ message: 'Teacher request status updated', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teacher request status', error });
    }
};

// Delete teacher request
export const deleteTeacherRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Find the request by ID
        const request = await teacherRepository.getTeacherRequestById(id);

        if (!request) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }

        // Check if the request status is 'approved'
        if (request.status === 'approved') {
            console.log('Cannot delete approved request. Please reject it first.');

            return res.status(400).json({ message: 'Cannot delete approved request. Please reject it first.' });
        }

        // Delete the request
        await teacherRepository.deleteTeacherRequest(id);

        res.status(200).json({ message: 'Teacher request deleted successfully' });
    } catch (error) {

        console.error('Error deleting teacher request:', error);
        res.status(500).json({ message: 'Error deleting teacher request', error });
    }
};