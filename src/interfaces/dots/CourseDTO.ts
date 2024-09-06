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

export interface courseListingDTO {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  fees: number;
  isPurchased:boolean
  isBookmarked:boolean
}

export const mapToCourseListingDTO = (course: any): courseListingDTO => {
  return {
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    fees: course.fees,
    isPurchased:course.isPurchased,
    isBookmarked:course.isBookmarked
  };
};