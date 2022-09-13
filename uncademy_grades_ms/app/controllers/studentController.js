const db = require("../models");
const Student = db.Student;
const ClassList = db.ClassList;
const EnrolledStudent = db.EnrolledStudent;

exports.saveStudent = (req,res) => {
    const student = {
        studentName: req.body.studentName,
        studyProgram: req.body.studyProgram
    }
    const classList = {
        semester: req.body.semester,
        courseName: req.body.courseName,
        courseGroup: req.body.courseGroup,
    }

    ClassList.findClassList(classList.semester,classList.courseName,classList.courseGroup)
        .then(list => {
            if(list.length === 0){
                res.status(400).send({
                    message:
                        "The Class List was not found."
                });
            } else {
                Student.findStudent(student.studentName, student.studyProgram)
                    .then(found => {
                        if (found.length === 0) {
                            Student.create(student)
                                .then(data => {
                                    const enrolledStudent = {
                                        ClassListClassListId: list[0].classListId,
                                        StudentStudentId: data.dataValues.studentId,
                                    }
                                    EnrolledStudent.create(enrolledStudent)
                                        .then(() => {
                                            res.json(Object.assign(data.dataValues, list[0]))
                                        })
                                        .catch(err => {
                                            res.status(400).send({
                                                message:
                                                err.message
                                            });
                                        });
                                })
                                .catch(err => {
                                    res.status(400).send({
                                        message:
                                        err.message
                                    });
                                });
                        } else {
                            const enrolledStudent = {
                                ClassListClassListId: list[0].classListId,
                                StudentStudentId: found[0].studentId
                            }
                            EnrolledStudent.findEnrolledStudent(enrolledStudent.ClassListClassListId,enrolledStudent.StudentStudentId)
                                .then(found2 => {
                                    if (found2.length === 0) {
                                        EnrolledStudent.create(enrolledStudent)
                                            .then(() => {
                                                res.json(Object.assign(found[0], list[0]))
                                            })
                                            .catch(err => {
                                                res.status(400).send({
                                                    message:
                                                    err.message
                                                });
                                            });
                                    } else {
                                        res.status(400).send({
                                            message:
                                                "This Student was already enrolled to the class list"
                                        });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({
                                        message:
                                        err.message
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                            err.message
                        });
                    });
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.addAbsences = (req,res) => {
    const absences = req.body.absences
    const maxAbsences = req.body.maxAbsences
    let abs
    if (parseInt(absences) > parseInt(maxAbsences)) {
        abs = {
            absences: absences,
            isApproved: false
        }
    } else {
        abs = {
            absences: absences,
        }
    }
    EnrolledStudent.findEnrolledStudent(req.params.lid,req.params.sid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "The student was not found."
                });
            } else {
                EnrolledStudent.update(abs, {
                    where: {
                        ClassListClassListId: data[0].ClassListClassListId,
                        StudentStudentId: data[0].StudentStudentId
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Absences were added successfully."
                            });
                        } else {
                            res.send({
                                message: "You did not perform any changes."
                            });
                        }
                    })
                    .catch(err => {
                        res.status(400).send({
                            message:
                            err.message
                        });
                    });
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.removeStudent = (req,res) => {
    EnrolledStudent.findEnrolledStudent(req.params.lid,req.params.sid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "The student was not enrolled to this class list."
                });
            } else {
                EnrolledStudent.destroy({
                    where: {
                        ClassListClassListId: req.params.lid,
                        StudentStudentId: req.params.sid,
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "The student was successfully removed from class list."
                            });
                        } else {
                            res.send({
                                message: "You did not perform any changes."
                            });
                        }
                    })
                    .catch(err => {
                        res.status(400).send({
                            message:
                            err.message
                        });
                    });
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.editStudent = (req,res) => {
    Student.findByPk(req.params.id)
        .then(data => {
            if (data === null){
                res.status(400).send({
                    message:
                        "The student was not found."
                });
            } else {
                const newStudentInfo = {
                    studentName: req.body.studentName,
                    studyProgram: req.body.studyProgram
                }
                Student.findStudent(newStudentInfo.studentName,newStudentInfo.studyProgram)
                    .then(found => {
                        if (found.length === 0) {
                            Student.update(newStudentInfo, {
                                where: {
                                    studentId: data.dataValues.studentId
                                }
                            })
                                .then(num => {
                                    if (num == 1) {
                                        res.send({
                                            message: "Student info was changed successfully."
                                        });
                                    } else {
                                        res.send({
                                            message: "You did not perform any changes."
                                        });
                                    }
                                })
                                .catch(err => {
                                    res.status(400).send({
                                        message:
                                        err.message
                                    });
                                });
                        } else {
                            res.status(400).send({
                                message:
                                    "A Student with this info was already created."
                            });
                        }
                    })
                    .catch(err => {
                        res.status(400).send({
                            message:
                            err.message
                        });
                    });
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}