import Course from "../model/course.model.js";
import AppError from "../utils/appError.js";
import fs from 'fs';
import cloudinary from 'cloudinary';

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

const createCourse = async (req, res, next) => {
    try {
        const {title, description, category, createdBy} = req.body;
        if(!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'DUMMY',
                secure_url: 'DUMMY'
            }
        });
        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
            });
            if(result){
                course.thumbnail = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                }
            }
            fs.rm('uploads/${req.file.filename}')
        }
        await course.save();
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const { courseID } = req.params;
        const course = await Course.findByIdAndUpdate(
            courseID,
            {
                $set: req.body,
            },
            {
                runValidators: true,
            }
        );
        if(!course) {
            return next(new AppError("No course found with this ID", 404));
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const {courseID} = req.params;
        const course = await Course.findById(courseID);
        if(!course) {
            return next(new AppError("No course found with this ID", 404));
        }
        await Course.findByIdAndDelete(courseID);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
}

export { getAllCourses,getLecturesByCourseId, createCourse, updateCourse, deleteCourse };