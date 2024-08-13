"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCourseListingDTO = void 0;
const mapToCourseListingDTO = (course) => {
    return {
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        fees: course.fees
    };
};
exports.mapToCourseListingDTO = mapToCourseListingDTO;
