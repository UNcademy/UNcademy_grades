const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            Student.belongsToMany(models.ClassList, {
                through: models.EnrolledStudent
            });
            Student.hasMany(models.EnrolledStudent);
        }
        static async findStudent(sn,sp){
            const [results, metadata] = await sequelize.query("select * from Student where studentName = ? and studyProgram = ?",{replacements:[sn,sp]})
            return results;
        }
    }
    Student.init({
        studentId : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        studentName : {
            type: DataTypes.STRING,
            allowNull: false
        },
        studyProgram : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Student',
        timestamps: false,
        freezeTableName: true
    });
    return Student;
};
