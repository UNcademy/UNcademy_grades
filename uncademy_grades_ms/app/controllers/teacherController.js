const db = require("../models");
const TeacherRole = db.TeacherRole;
const ClassList = db.ClassList;
const Teacher = db.Teacher;

exports.addTeacher = (req, res) => {
    Teacher.findTeacherByName(req.body.teacherName)
        .then(found2 => {
            const newTeacher = {teacherName: req.body.teacherName}
            if(found2.length === 0){
                Teacher.create(newTeacher)
                    .then(newData => {
                        const newTeacherRole = {
                            TeacherTeacherId: newData.teacherId,
                            ClassListClassListId: req.params.cid,
                            isHead: false,
                            classroom: req.body.classroom,
                            wDays: req.body.wDays,
                            schedule: req.body.schedule
                        }
                        TeacherRole.create(newTeacherRole)
                            .then()
                            .catch(err => {
                                res.status(400).send({
                                    message:
                                    err.message
                                });
                            });
                        res.status(200).send({
                            message:
                                "The teacher was added to the classList."
                        })
                    })
                    .catch(err => {
                        res.status(400).send({
                            message:
                            err.message
                        });
                    });
            } else {
                TeacherRole.findTeacherRole(req.params.cid,found2[0].teacherId)
                    .then(found3 => {
                        if(found3.length === 0){
                            const newTeacherRole = {
                                TeacherTeacherId: found2[0].teacherId,
                                ClassListClassListId: req.params.cid,
                                isHead: false,
                                classroom: req.body.classroom,
                                wDays: req.body.wDays,
                                schedule: req.body.schedule
                            }
                            TeacherRole.create(newTeacherRole)
                                .then()
                                .catch(err => {
                                    res.status(400).send({
                                        message:
                                        err.message
                                    });
                                })
                            res.status(200).send({
                                message:
                                    "The teacher was added to the classList."
                            })
                        } else {
                            res.status(400).send({
                                message:
                                "This teacher was already related to Class List"
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

exports.removeTeacher = (req,res) => {
    TeacherRole.findTeacherRole(req.params.lid,req.params.tid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "The teacher was not related to this class list."
                });
            } else {
                TeacherRole.destroy({
                    where: {
                        ClassListClassListId: req.params.lid,
                        TeacherTeacherId: req.params.tid,
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "The teacher was successfully removed from class list."
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

exports.editTeacher = (req,res) => {
    TeacherRole.findTeacherRole(req.params.lid,req.params.tid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "The teacher was not related to this class list."
                });
            } else {
                ClassList.findByPk(req.params.lid)
                    .then(data => {
                        const teacherInfo = {
                            classroom: req.body.classroom,
                            schedule: req.body.schedule,
                            wDays: req.body.wDays,
                            isHead: req.body.isHead
                        }
                        const semester = data.dataValues.semester
                        TeacherRole.occupiedSchedule(teacherInfo.wDays,teacherInfo.schedule,semester,req.params.tid, req.params.lid)
                            .then(sch => {
                                if (sch === 0){
                                    TeacherRole.update(teacherInfo, {
                                        where: {
                                            ClassListClassListId: req.params.lid,
                                            TeacherTeacherId: req.params.tid,
                                        }
                                    })
                                        .then(num => {
                                            if (num == 1) {
                                                res.send({
                                                    message: "Teacher info was changed successfully."
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
                                            "This schedule is already occupied."
                                    });
                                }
                            })
                            .catch(err => {
                                res.status(400).send({
                                    message:
                                    err.message
                                });
                            });
                    })
                    .catch()
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}