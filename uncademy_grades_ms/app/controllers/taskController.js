const db = require("../models");
const Teacher = db.Teacher;
const Task = db.Task;
const TeacherRole = db.TeacherRole;
const ClassList = db.ClassList;

exports.saveTask = (req,res) => {
    ClassList.findByPk(req.params.id)
        .then(cl => {
            if (cl === null){
                res.status(400).send({
                    message:
                        "This Class List does not exist."
                });
            } else if (cl.dataValues.isNum) {
                const teacher = {
                    teacherName: req.body.teacherName
                }
                Teacher.findTeacherByName(teacher.teacherName)
                    .then(found => {
                        if(found.length === 0){
                            res.status(400).send({
                                message:
                                    "Access Denied; you are not registered."
                            });
                        } else {
                            const teacherId = found[0].teacherId
                            const classListId = req.params.id
                            Task.findTask(classListId)
                                .then(vt => {
                                    if (vt.length === 0){
                                        TeacherRole.findTeacherRole(classListId,teacherId)
                                            .then(data => {
                                                if(data.length === 0){
                                                    res.status(400).send({
                                                        message:
                                                            "Teacher is not related to this class list."
                                                    });
                                                }
                                                else{
                                                    if(data[0].isHead){
                                                        const tasks = req.body.tasks
                                                        let total = 0
                                                        for (const t of Object.keys(tasks)){
                                                            total += parseInt(tasks[t].weight)
                                                        }
                                                        if (total === 100){
                                                            for (const t of Object.keys(tasks)){
                                                                const newTeacher = {
                                                                    teacherName: tasks[t].assigned,
                                                                }
                                                                let newTeacherId = 0
                                                                Teacher.findTeacherByName(newTeacher.teacherName)
                                                                    .then(found2 => {
                                                                        if(found2.length === 0){
                                                                            Teacher.create(newTeacher)
                                                                                .then(newData => {
                                                                                    newTeacherId = newData.teacherId
                                                                                    TeacherRole.findTeacherRole(classListId,newTeacherId)
                                                                                        .then(found3 => {
                                                                                            const newTask = {
                                                                                                taskName: tasks[t].taskName,
                                                                                                weight: tasks[t].weight,
                                                                                                TeacherRoleTeacherTeacherId: newTeacherId,
                                                                                                TeacherRoleClassListClassListId: classListId
                                                                                            }
                                                                                            if(found3.length === 0){
                                                                                                const newTeacherRole = {
                                                                                                    TeacherTeacherId: newTeacherId,
                                                                                                    ClassListClassListId: classListId,
                                                                                                    isHead: false
                                                                                                }
                                                                                                TeacherRole.create(newTeacherRole)
                                                                                                    .then(() => {
                                                                                                        Task.create(newTask)
                                                                                                            .then()
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
                                                                                                Task.create(newTask)
                                                                                                    .then()
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
                                                                                })
                                                                                .catch(err => {
                                                                                    res.status(400).send({
                                                                                        message:
                                                                                        err.message
                                                                                    });
                                                                                });
                                                                        } else {
                                                                            newTeacherId = found2[0].teacherId;
                                                                            TeacherRole.findTeacherRole(classListId,newTeacherId)
                                                                                .then(found3 => {
                                                                                    const newTask = {
                                                                                        taskName: tasks[t].taskName,
                                                                                        weight: tasks[t].weight,
                                                                                        TeacherRoleTeacherTeacherId: newTeacherId,
                                                                                        TeacherRoleClassListClassListId: classListId
                                                                                    }
                                                                                    if(found3.length === 0){
                                                                                        const newTeacherRole = {
                                                                                            TeacherTeacherId: newTeacherId,
                                                                                            ClassListClassListId: classListId,
                                                                                            isHead: false
                                                                                        }
                                                                                        TeacherRole.create(newTeacherRole)
                                                                                            .then(() => {
                                                                                                Task.create(newTask)
                                                                                                    .then()
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
                                                                                        Task.create(newTask)
                                                                                            .then()
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
                                                            res.status(200).send({
                                                                message:
                                                                    "The tasks were saved successfully."
                                                            })
                                                        }
                                                        else {
                                                            res.status(400).send({
                                                                message:
                                                                    "Total sum of weights should be 100%."
                                                            });
                                                        }
                                                    }
                                                    else{
                                                        res.status(400).send({
                                                            message:
                                                                "Access Denied; you are not head of group."
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
                                    } else {
                                        res.status(400).send({
                                            message:
                                                "The tasks for this Class List were already defined."
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
                console.log(cl.dataValues.isNum)
                res.status(400).send({
                    message:
                        "This Class List does not receive numerical grades. The Tasks were not saved."
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

exports.editTaskName = (req,res) => {
    Task.findByPk(req.params.id)
        .then(data => {
            if (data === null){
                res.status(400).send({
                    message:
                        "No tasks were found."
                });
            } else {
                const newTaskName = {
                    taskName: req.body.taskName
                }
                Task.update(newTaskName, {
                    where: {
                        taskId: data.dataValues.taskId
                    }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Task name was changed successfully."
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

exports.getTasks = (req,res) => {
    Task.findTaskByTeacher(req.params.lid,req.params.tid)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "No tasks were found."
                });
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(400).send({
                message:
                err.message
            });
        });
}

exports.deleteTasks = (req,res) => {
    Task.findTask(req.params.id)
        .then(data => {
            if (data.length === 0){
                res.status(400).send({
                    message:
                        "No tasks were found."
                });
            } else {
                Task.destroy({
                    where: {
                        TeacherRoleClassListClassListId: req.params.id
                    }
                })
                    .then(num => {
                        if (num == data.length) {
                            res.send({
                                message: "All the tasks related to this class list were successfully removed."
                            });
                        } else {
                            res.send({
                                message: num.toString() + " rows were affected."
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