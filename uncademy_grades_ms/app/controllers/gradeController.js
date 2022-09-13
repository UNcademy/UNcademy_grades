const db = require("../models");
const ClassList = db.ClassList;
const EnrolledStudent = db.EnrolledStudent;
const TeacherRole = db.TeacherRole;
const Teacher = db.Teacher;
const Task = db.Task;
const Grade = db.Grade;

exports.nonNumGrade = (req,res) => {
    ClassList.findClassListByPk(req.params.lid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "Class List was not found."
                });
            } else {
                if (data[0].isNum) {
                    res.status(400).send({
                        message:
                            "This Class List requires numerical grades."
                    });
                } else {
                    const teacher = req.body.teacherName
                    Teacher.findTeacherByName(teacher)
                        .then(found => {
                            if (found.length === 0){
                                res.status(400).send({
                                    message: "Teacher was not found."
                                })
                            } else {
                                TeacherRole.findTeacherRole(req.params.lid,found[0].teacherId)
                                    .then(found2 => {
                                        if (found2.length === 0){
                                            res.status(400).send({
                                                message: "You are not related to this class list."
                                            })
                                        } else {
                                            const approves = {
                                                isApproved: req.body.isApproved
                                            }
                                            EnrolledStudent.findEnrolledStudent(req.params.lid, req.params.sid)
                                                .then(data2 => {
                                                    if (data2.length === 0) {
                                                        res.status(400).send({
                                                            message:
                                                                "The student was not found."
                                                        });
                                                    } else {
                                                        EnrolledStudent.update(approves, {
                                                            where: {
                                                                ClassListClassListId: data2[0].ClassListClassListId,
                                                                StudentStudentId: data2[0].StudentStudentId
                                                            }
                                                        })
                                                            .then(num => {
                                                                if (num == 1) {
                                                                    res.send({
                                                                        message: "Grade was added successfully."
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
                            })
                        })
                }
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.numGrade = (req,res) => {
    ClassList.findClassListByPk(req.params.lid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "Class List was not found."
                });
            } else {
                if (data[0].isNum) {
                    EnrolledStudent.findEnrolledStudent(req.params.lid, req.params.sid)
                        .then(data2 => {
                            if (data2.length === 0) {
                                res.status(400).send({
                                    message:
                                        "The student was not found."
                                });
                            } else {
                                const numGrade = {
                                    value: req.body.value,
                                    EnrolledStudentStudentStudentId: req.params.sid,
                                    EnrolledStudentClassListClassListId: req.params.lid,
                                    TaskTaskId: req.params.tid
                                }
                                Grade.create(numGrade)
                                    .then(grade => {
                                        res.send(grade)
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
                } else {
                    res.status(400).send({
                        message:
                            "This Class List does not require numerical grades."
                    });
                }
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.editNumGrade = (req,res) => {
    ClassList.findClassListByPk(req.params.lid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "Class List was not found."
                });
            } else {
                if (data[0].isNum) {
                    EnrolledStudent.findEnrolledStudent(req.params.lid, req.params.sid)
                        .then(data2 => {
                            if (data2.length === 0) {
                                res.status(400).send({
                                    message:
                                        "The student was not found."
                                });
                            } else {
                                const numGrade = {
                                    value: req.body.value,
                                }
                                Grade.update(numGrade, {
                                    where: {
                                        EnrolledStudentStudentStudentId: req.params.sid,
                                        EnrolledStudentClassListClassListId: req.params.lid,
                                        TaskTaskId: req.params.tid
                                    }
                                })
                                    .then(num => {
                                        if (num == 1) {
                                            res.send({
                                                message: "Grade was changed successfully."
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
                } else {
                    res.status(400).send({
                        message:
                            "This Class List does not require numerical grades."
                    });
                }
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}