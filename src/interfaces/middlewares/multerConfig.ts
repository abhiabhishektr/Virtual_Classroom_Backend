import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage to keep images in memory
const upload = multer({ storage });

export default upload;
