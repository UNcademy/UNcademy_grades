const db = require("../models");
const TeacherRole = db.TeacherRole;
const ClassList = db.ClassList;

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
                        "The teacher was not found."
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
                        TeacherRole.occupiedSchedule(teacherInfo.wDays,teacherInfo.schedule,semester,req.params.tid)
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