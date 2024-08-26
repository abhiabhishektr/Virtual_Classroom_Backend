import { Request, Response } from 'express';
import { getCourseDetails } from '../../application/services/courseService';
import { DEFAULT_NOTIFICATION_LINK } from '../../utils/Constants';
// import { startLiveClassService, endLiveClassService, getLiveClassStatusService } from '../services/liveClassService';
// 
export const startLiveClass = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.body;
        const courseDetails = await getCourseDetails(courseId);

        if (!courseDetails) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const notification = {
            title: 'Live Class Started',
            message: `The live class for course ${courseDetails.title} has started.`,
            date: new Date(),
            link: DEFAULT_NOTIFICATION_LINK, // Default link or dynamic based on course
        };

        // await startLiveClassService(courseId);
        res.status(200).json({ message: 'Live class started successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to start live class', error: (error as Error).message });
    }
};








// export const endLiveClass = async (req: Request, res: Response) => {
//     try {
//         const { courseId } = req.body;
//         await endLiveClassService(courseId);
//         res.status(200).json({ message: 'Live class ended successfully' });
//     } catch (error) {
//         const errorMessage = (error as Error).message;
//         res.status(500).json({ message: 'Failed to end live class', error: errorMessage });
//     }
// };

// export const getLiveClassStatus = async (req: Request, res: Response) => {
//     try {
//         const { courseId } = req.query;
//         const status = await getLiveClassStatusService(courseId as string);
//         res.status(200).json(status);
//     } catch (error) {
//         const errorMessage = (error as Error).message;
//         res.status(500).json({ message: 'Failed to get live class status', error: errorMessage });
//     }
// };
