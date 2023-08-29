import {Router} from "express"
import { createCourse, deleteCourse, getAllCourses, getLecturesByCourseId, updateCourse } from "../controllers/course.controller.js";
import isLoggedIn, { authorizedRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()

router
    .route("/")
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single('thumbnail'),
        createCourse
    );
router
    .route("/:courseID")
    .get(
        isLoggedIn, 
        getLecturesByCourseId
    )
    .put(
        isLoggedIn,
        updateCourse
    )
    .delete(
        isLoggedIn,
        deleteCourse
    );

export default router;