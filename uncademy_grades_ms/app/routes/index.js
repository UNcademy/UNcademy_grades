const ClassListController = require('../controllers/classListController');
const StudentController = require('../controllers/studentController');
const TaskController = require('../controllers/taskController')
const GradeController = require("../controllers/gradeController")
const TeacherController = require("../controllers/teacherController")

module.exports = (app) => {
    var router = require("express").Router();

    // Management of class lists (internal)
    router.post("/addClass", ClassListController.saveClassList);
    router.put("/class/:id/edit", ClassListController.editClassList);
    router.delete("/class/:id/delete", ClassListController.deleteClassList);

    // Management of class lists (internal)
    router.post("/addStudent", StudentController.saveStudent);
    router.put("/editStudent/:id", StudentController.editStudent);
    router.delete("/class/:lid/student/:sid/remove", StudentController.removeStudent);

    // Management of teachers (internal)
    router.post("/class/addTeacher/:cid", TeacherController.addTeacher);
    router.put("/class/:lid/teacher/:tid/edit", TeacherController.editTeacher);
    router.delete("/class/:lid/teacher/:tid/remove", TeacherController.removeTeacher);

    // Get schedule
    router.get("/schedule/teacher", ClassListController.getSchedule);

    // Get a class list
    router.get("/class/:id", ClassListController.clDetails);

    // Assign and select Tasks
    router.post("/class/:id/addTasks", TaskController.saveTask);
    router.get("/class/:lid/getTasks/:tid", TaskController.getTasks);
    router.put("/editTask/:id", TaskController.editTaskName);
    router.delete("/class/:id/deleteTasks", TaskController.deleteTasks);

    // Add Absences
    router.put("/class/:lid/student/:sid/addAbsences", StudentController.addAbsences);

    // Grades (non-numerical)
    router.put("/class/:lid/student/:sid/grade", GradeController.nonNumGrade);

    // Grades (numerical)
    router.post("/class/:lid/student/:sid/grade/:tid", GradeController.numGrade);
    router.put("/class/:lid/student/:sid/grade/:tid", GradeController.editNumGrade);

    app.use("/", router);
};