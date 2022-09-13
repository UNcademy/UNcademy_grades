const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Grade extends Model {
        static associate(models) {
            Grade.belongsTo(models.Task);
            Grade.belongsTo(models.EnrolledStudent);
        }
    }
    Grade.init({
        value : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Grade',
        timestamps: false,
        freezeTableName: true
    });
    return Grade;
};
