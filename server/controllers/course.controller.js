import Course from "../model/course.model.js";
import AppError from "../utils/appError.js";

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select("-lectures");
        res.status(200).json({
            success: true,
            message: "All courses:",
            courses,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const getLecturesByCourseId = async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const course = await Course.findById(courseID);
        if (!course) {
            return next(new AppError("No course found with this ID", 404));
        }
        res.status(200).json({
            success: true,
            message: "Lectures of the course:",
            lectures: course.lectures,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export { getAllCourses,getLecturesByCourseId };