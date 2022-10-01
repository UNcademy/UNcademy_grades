const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
const db = require("./app/models");
const forced = parseInt(process.argv[2]);

function alter_tables(flag){
    if (flag) {
        console.log("Drop and re-sync db.");
        const queryInterface = db.sequelize.getQueryInterface()
        queryInterface.sequelize.query(
            'ALTER TABLE Grade DROP FOREIGN KEY grade_ibfk_1')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade DROP FOREIGN KEY grade_ibfk_2')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade DROP PRIMARY KEY')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade ADD FOREIGN KEY (EnrolledStudentStudentStudentId) REFERENCES EnrolledStudent(StudentStudentId) ON DELETE CASCADE ON UPDATE CASCADE')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade ADD FOREIGN KEY (EnrolledStudentClassListClassListId) REFERENCES EnrolledStudent(ClassListClassListId) ON DELETE CASCADE ON UPDATE CASCADE')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade ADD FOREIGN KEY (TaskTaskId) REFERENCES Task(taskId) ON DELETE CASCADE ON UPDATE CASCADE')
        queryInterface.sequelize.query(
            'ALTER TABLE Grade ADD CONSTRAINT PRIMARY KEY (EnrolledStudentStudentStudentId, EnrolledStudentClassListClassListId, TaskTaskId) ')
        queryInterface.sequelize.query(
            'ALTER TABLE Task ADD FOREIGN KEY (TeacherRoleTeacherTeacherId) REFERENCES TeacherRole(TeacherTeacherId) ON DELETE CASCADE ON UPDATE CASCADE')
        queryInterface.sequelize.query(
            'ALTER TABLE Task ADD FOREIGN KEY (TeacherRoleClassListClassListId) REFERENCES TeacherRole(ClassListClassListId) ON DELETE CASCADE ON UPDATE CASCADE')
    }
}

db.sequelize.sync({ force: forced }).then(() => {
    alter_tables(forced)

});
app.get("/", (req, res) => {
    res.json({ message: "Welcome to uncademy_grades." });
});

// set port, listen for requests
require("./app/routes/index")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;
