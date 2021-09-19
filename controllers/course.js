const Course = require("../models/course");

function addCourse(req, res) {
    const body = req.body;
    const course = new Course(body);
    course.order = 1000;

    course.save((err, courseStored) => {
        if (err) {
            res.status(400).send({ code: 400, message: "Error creating a new course" });
        } else {
            if (!courseStored) {
                res.status(500).send({ code: 500, message: "Course al ready exist" });
            } else {
                res.status(200).send({ code: 200, message: "Course created successfully" });
            }
        }
    });
};

function getCourses(req, res) {
    Course.find()
        .sort({ order: "asc" })
        .exec((err, coursesStore) => {
            if (err) {
                res.status(500).send({ code: 500, message: "Server error" });
            } else {
                if (!coursesStore) {
                    res.status(404).send({ code: 404, message: "Not found any course" });
                } else {
                    res.status(200).send({ code: 200, courses: coursesStore });
                }
            }
        });
};

function deleteCourse(req, res) {
    const { id } = req.params;

    Course.findByIdAndRemove(id, (err, courseDeleted) => {
        if (err) {
            res.status(500).send({ code: 500, message: "Server error" });
        } else {
            if (!courseDeleted) {
                res.status(404).send({ code: 404, message: "Not found any course" });
            } else {
                res.status(200).send({ code: 200, message: "Course deleted successfully" });
            }
        }
    });
};

function updateCourse(req, res) {
    const courseData = req.body;
    const { id } = req.params;

    Course.findByIdAndUpdate(id, courseData,(err, courseUpdated) => {
        if (err) {
            res.status(500).send({ code: 500, message: "Server error" });
        } else {
            if (!courseUpdated) {
                res.status(404).send({ code: 404, message: "Not found any course" });
            } else {
                res.status(200).send({ code: 200, message: "Course updated successfully" });
            }
        }
    });
};

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse,
};