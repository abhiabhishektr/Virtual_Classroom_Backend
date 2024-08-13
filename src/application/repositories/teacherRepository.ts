// src/application/repositories/teacherRepository.ts
import TeacherRequest from '../../infrastructure/database/models/TeacherRequest';
import { ITeacherRequest } from '../../infrastructure/database/models/TeacherRequest';

// Create a new teacher request
export const createTeacherRequest = async (data: Omit<ITeacherRequest, '_id'>) => {
    const newRequest = new TeacherRequest(data);
    return await newRequest.save();
};

export const findOne = async (query: object) => {
    try {
        return await TeacherRequest.findOne(query).populate('userId', 'name email');
    } catch (error) {
        console.error('Error finding teacher request:', error);
        throw new Error('Error finding teacher request');
    }
};

// Get all teacher requests
export const getAllTeacherRequests = async () => {
    try {
        // Aggregate the TeacherRequests and join with the User collection
        const teacherRequests = await TeacherRequest.aggregate([
            {
                $addFields: {
                    userId: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Collection name
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    highestQualification: 1,
                    yearsOfTeachingExperience: 1,
                    subjects: 1,
                    bio: 1,
                    status: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            }
        ]);
                

        return teacherRequests;
    } catch (error) {
        console.error('Error fetching teacher requests:', error);
        throw error;
    }
};

// Find a teacher request by ID
export const getTeacherRequestById = async (id: string) => {
    return await TeacherRequest.findById(id).populate('userId', 'name email');
};

// Update teacher request status
export const updateTeacherRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    return await TeacherRequest.findByIdAndUpdate(id, { status }, { new: true });
};


export const deleteTeacherRequest = async (id: string) => {
  return await TeacherRequest.findByIdAndDelete(id);
};