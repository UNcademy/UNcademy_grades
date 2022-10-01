const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EnrolledStudent extends Model {
        static associate(models) {
            EnrolledStudent.belongsToMany(models.Task, {
                through: models.Grade,
                sourceKey: "StudentStudentId",
            });
            EnrolledStudent.hasMany(models.Grade, {
                as: "GradesEn",
            });
            EnrolledStudent.belongsTo(models.ClassList);
            EnrolledStudent.belongsTo(models.Student);
        }
        static async findEnrolledStudent(cl,st){
            const [results, metadata] = await sequelize.query("select * from EnrolledStudent where ClassListClassListId = ? and StudentStudentId = ?",{replacements:[cl,st]})
            return results;
        }
    }
    EnrolledStudent.init({
        absences : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isApproved : {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'EnrolledStudent',
        timestamps: false,
        freezeTableName: true
    });
    return EnrolledStudent;
};
