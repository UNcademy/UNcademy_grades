const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ClassList extends Model {
        static associate(models) {
            ClassList.belongsToMany(models.Teacher, {
                through: models.TeacherRole,
            });
            ClassList.hasMany(models.TeacherRole);
            ClassList.belongsToMany(models.Student, {
                through: models.EnrolledStudent,
            });
            ClassList.hasMany(models.EnrolledStudent);
        }
        static async findClassList(sem,cn,cg){
            const [results, metadata] = await sequelize.query("select * from classlist where semester = ? and courseName = ? and courseGroup = ?",{replacements:[sem,cn,cg]})
            return results;
        }

        static async findClassListByPk(id){
            const [results, metadata] = await sequelize.query("select * from classlist where classListId = ?",{replacements:[id]})
            return results;
        }
    }
    ClassList.init({
        classListId : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        semester : {
            type: DataTypes.STRING,
            allowNull: false
        },
        courseName : {
            type: DataTypes.STRING,
            allowNull: false
        },
        courseGroup : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isNum : {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ClassList',
        timestamps: false,
        freezeTableName: true
    });
    return ClassList;
};
