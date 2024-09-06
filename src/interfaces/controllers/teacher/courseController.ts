import { Request, Response } from 'express';
import * as courseService from '../../../application/services/courseService';
import cloudinary from '../../../infrastructure/cloudinaryConfig';
import { User } from '../../../types/user';
// import { courseValidator } from '../../../validations/courseValidator';


export const createCourse = async (req: Request, res: Response): Promise<any> => {

    try {

        // const { error } = courseValidator.validate(req.body);
        // if (error) {
        //     return res.status(400).json({ message: error.details[0].message });
        // }

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileStr = req.file.buffer.toString('base64');

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
            folder: 'courses',
            resource_type: 'auto',
        });

        const instructorId = (req.user as User)?.id ?? null;
        // The Cloudinary URL is available in the response
        const publicUrl = uploadResponse.secure_url;

        // Create course with the uploaded image URL
        const courseData = {
            ...req.body,
            imageUrl: publicUrl, // Assuming your course schema includes an imageUrl field
            instructorId: instructorId, // Assuming your course schema includes an imageUrl field
        };

        const course = await courseService.createNewCourse(courseData);
        res.status(201).json(course);
    } catch (error: any) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: error.message });
    }
};



export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {


        // const { error } = courseValidator.validate(req.body);
        // if (error) {
        //     res.status(400).json({ message: error.details[0].message });
        //     return
        // }

        const existingCourse = await courseService.getCourseDetails(req.params.id);
        if (!existingCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }


        if (req.file) {
            const oldImageUrl = existingCourse.imageUrl ?? null;
            if (oldImageUrl) {
                const publicId = oldImageUrl.split('/').pop()?.split('.')[0];

                if (publicId) {
                    await cloudinary.uploader.destroy(`courses/${publicId}`);
                }
            }
            const fileStr = req.file.buffer.toString('base64');

            // Upload the new image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
                folder: 'courses',
                resource_type: 'auto',
            });

            req.body.imageUrl = uploadResponse.secure_url;
        }


        const course = await courseService.updateExistingCourse(req.params.id, req.body);
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.deleteCourseById(req.params.id);
        if (course) {
            res.status(200).json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.getCourseDetails(req.params.id);
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = typeof req.query.search === 'string' ? req.query.search : '';
        const sort = typeof req.query.sort === 'string' ? req.query.sort : 'title';
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
        const category = typeof req.query.category === 'string' ? req.query.category : '';
        const priceRange = typeof req.query.priceRange === 'string' ? req.query.priceRange : '';

        // Construct the filter object based on category and priceRange
        const filterObj: any = {};

        if (category) {
            filterObj.category = { $in: category.split(',') };
        }

        if (priceRange) {
            const [operator, value] = priceRange.split(':');
            filterObj.fees = { [operator]: parseFloat(value) };
        }


        // Get the total number of courses matching the search and filter criteria
        const totalCourses = await courseService.countDocuments(search, filterObj);

        // Fetch the paginated list of courses
        let courses = await courseService.getAllCourseDetails(
            search,
            sort,
            filterObj,
            page,
            limit
        );

        const totalPages = Math.ceil(totalCourses / limit);

        // Send the response
        res.status(200).json({
            data: {
                courses,
                totalPages
            }
        });
    } catch (error: any) {
        console.error("Error in getCourses:", error.message);
        res.status(500).json({ error: error.message });
    }
};


// const duplicatedCourses = Array.from({ length: 5 }, () => [...courses]);
// courses = duplicatedCourses.reduce((acc, curr) => acc.concat(curr), []);

// // Recalculate total courses and total pages based on the simulated dataset
// const simulatedTotalCourses = courses.length;
// const totalPages = Math.ceil(simulatedTotalCourses / limit);

// // Send the response
// res.status(200).json({
//     data: {
//         courses,
//         totalPages
//     }
// });


export const getCoursesbyTeacher = async (_req: Request, res: Response): Promise<void> => {
    try {

        const courses = await courseService.getAllCourseDetailsbyTeacher((_req.user as User)?.id ?? null);
        res.status(200).json({ data: courses });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};




export const updateContents = async (_req: Request, res: Response): Promise<void> => {
    try {


    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};




