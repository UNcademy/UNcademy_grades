const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsToMany(models.EnrolledStudent, {
                through: models.Grade
            });
            Task.hasMany(models.Grade, {as: "GradesTask"});
        }

        static async findTask(id){
            const [results, metadata] = await sequelize.query("select * from Task where TeacherRoleClassListClassListId = ?",{replacements:[id]})
            return results;
        }

        static async findTaskByTeacher(id1,id2){
            const [results, metadata] = await sequelize.query("select * from Task where TeacherRoleClassListClassListId = ? and TeacherRoleTeacherTeacherId = ?",{replacements:[id1,id2]})
            return results;
        }
    }
    Task.init({
        taskId : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        taskName : {
            type: DataTypes.STRING,
            allowNull: false
        },
        weight : {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        TeacherRoleTeacherTeacherId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TeacherRoleClassListClassListId : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Task',
        timestamps: false,
        freezeTableName: true
    });
    return Task;
};
