const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {
            Teacher.belongsToMany(models.ClassList, {
                through: models.TeacherRole,
            });
            Teacher.hasMany(models.TeacherRole);
        }
        static async findTeacherByName(name){
            const [results, metadata] = await sequelize.query("select * from teacher where teacherName = ?",{replacements:[name]})
            return results;
        }
    }
    Teacher.init({
        teacherId : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        teacherName : {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Teacher',
        timestamps: false,
        freezeTableName: true
    });
    return Teacher;
};
