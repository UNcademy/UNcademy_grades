const db = require("../models");
const Teacher = db.Teacher;
const ClassList = db.ClassList;
const TeacherRole = db.TeacherRole;

exports.saveClassList = (req,res) => {
    const teacher = {
        teacherName: req.body.teacherName
    }
    const classList = {
        semester: req.body.semester,
        courseName: req.body.courseName,
        courseGroup: req.body.courseGroup,
        isNum: req.body.isNum
    }

    ClassList.findClassList(classList.semester,classList.courseName,classList.courseGroup)
        .then(list => {
            if(list.length === 0){
                Teacher.findTeacherByName(teacher.teacherName)
                    .then(found => {
                        if(found.length === 0){
                            Teacher.create(teacher)
                                .then(data => {
                                    ClassList.create(classList)
                                        .then(data2 => {
                                            const teacherRole = {
                                                TeacherTeacherId: data.dataValues.teacherId,
                                                ClassListClassListId: data2.dataValues.classListId,
                                                isHead: true,
                                                classroom: req.body.classroom,
                                                wDays: req.body.wDays,
                                                schedule: req.body.schedule,
                                            }
                                            TeacherRole.create(teacherRole)
                                                .then(() => {
                                                    res.json(Object.assign(data.dataValues, data2.dataValues))
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
                                })
                                .catch(err => {
                                    res.status(400).send({
                                        message:
                                            err.message
                                    });
                                });
                        } else {
                            TeacherRole.occupiedSchedule(req.body.wDays,req.body.schedule,classList.semester,found[0].teacherId, -1)
                                .then(sch => {
                                    if (sch === 0){
                                        ClassList.create(classList)
                                            .then(data2 => {
                                                const teacherRole = {
                                                    TeacherTeacherId: found[0].teacherId,
                                                    ClassListClassListId: data2.dataValues.classListId,
                                                    isHead: true,
                                                    classroom: req.body.classroom,
                                                    wDays: req.body.wDays,
                                                    schedule: req.body.schedule,
                                                }
                                                TeacherRole.create(teacherRole)
                                                    .then(() => {
                                                        res.json(Object.assign(found[0], data2.dataValues))
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
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message
                        });
                    });
            } else {
                res.status(400).send({
                    message:
                        "This Class List was already created."
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

exports.getSchedule = (req,res) => {
    const mySch = {
        teacherName: req.body.teacherName,
        semester: req.body.semester
    }
    Teacher.findTeacherByName(mySch.teacherName)
        .then(found => {
            if(found.length === 0){
                res.status(400).send({
                    message:
                        "The Teacher was not found."
                });
            } else {
                TeacherRole.findClassListsByTeacher(mySch.semester,found[0].teacherId)
                    .then(data => {
                        res.json(data)
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

exports.clDetails = (req,res) => {
    ClassList.findClassListByPk(req.params.id)
        .then(found => {
            if (found.length === 0){
                res.status(400).send({
                    message:
                        "Class list does not exist."
                });
            } else {
                if (found[0].isNum){
                    ClassList.findByPk(req.params.id,{
                        attributes: ['semester','courseName','courseGroup'],
                        include: [{
                            model: db.EnrolledStudent,
                            include: [{
                                model: db.Student,
                                attributes: ['studentName','studyProgram'],
                            },
                                {
                                    model: db.Task,
                                    attributes: ['taskName','weight'],
                                    required: false,
                                    through: {
                                        attributes: ['value']
                                    }
                                }],
                            attributes: ['absences','isApproved']
                        },
                            {
                                model: db.Teacher,
                                attributes: ['teacherName'],
                                through: {
                                    attributes: ['isHead']
                                }
                            }]

                    })
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => {
                            res.status(400).send({
                                message:
                                err.message
                            });
                        });
                } else {
                    ClassList.findByPk(req.params.id,{
                        attributes: ['semester','courseName','courseGroup'],
                        include: [{
                            model: db.EnrolledStudent,
                            include: {
                                model: db.Student,
                                attributes: ['studentName','studyProgram'],
                            },
                            attributes: ['absences','isApproved']
                        },
                            {
                                model: db.Teacher,
                                attributes: ['teacherName'],
                                through: {
                                    attributes: ['isHead']
                                }
                            }]

                    })
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => {
                            res.status(400).send({
                                message:
                                err.message
                            });
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

exports.editClassList = (req,res) => {
    ClassList.findByPk(req.params.id)
        .then(data => {
            if (data === null){
                res.status(400).send({
                    message:
                        "The class list was not found."
                });
            } else {
                const newClassListItems = {
                    semester: req.body.semester,
                    courseName: req.body.courseName,
                    courseGroup: req.body.courseGroup,
                    isNum: req.body.isNum
                }
                ClassList.findClassList(newClassListItems.semester,newClassListItems.courseName,newClassListItems.courseGroup)
                    .then(list => {
                        if (list.length === 0) {
                            ClassList.update(newClassListItems, {
                                where: {
                                    classListId: data.dataValues.classListId
                                }
                            })
                                .then(num => {
                                    if (num == 1) {
                                        res.send({
                                            message: "Class List info was changed successfully."
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
                                    "A Class List with this info was already created."
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

exports.deleteClassList = (req,res) => {
    ClassList.findByPk(req.params.id)
        .then(data => {
            if (data === null){
                res.status(400).send({
                    message:
                        "The class list was not found."
                });
            } else {
                ClassList.destroy({
                    where: {
                        classListId: req.params.id
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "The class list was successfully deleted."
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