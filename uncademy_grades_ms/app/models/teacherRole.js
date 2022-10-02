const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TeacherRole extends Model {
        static associate(models) {
            TeacherRole.belongsTo(models.ClassList);
            TeacherRole.belongsTo(models.Teacher);
        }
        static async findClassListsByTeacher(sem,id){
            const lun = {}
            const mar = {}
            const mie = {}
            const jue = {}
            const vie = {}
            const sab = {}
            const [results, metadata] = await sequelize.query("select * from TeacherRole left join ClassList on TeacherRole.ClassListClassListId = ClassList.classListId where semester = ? and TeacherTeacherId = ?",{replacements:[sem,id]})
            for (const row of results) {
                if (row.wDays.split(",").includes('Lun')) {
                    lun[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
                if (row.wDays.split(",").includes('Mar')) {
                    mar[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
                if (row.wDays.split(",").includes('Mie')) {
                    mie[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
                if (row.wDays.split(",").includes('Jue')) {
                    jue[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
                if (row.wDays.split(",").includes('Vie')) {
                    vie[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
                if (row.wDays.split(",").includes('Sab')) {
                    sab[row.schedule] = {
                        id: row.classListId,
                        course: row.courseName,
                        group: row.courseGroup,
                        classroom: row.classroom
                    }
                }
            }
            const sortedSchedule = {
                monday: Object.fromEntries(Object.entries(lun).sort()),
                tuesday: Object.fromEntries(Object.entries(mar).sort()),
                wednesday: Object.fromEntries(Object.entries(mie).sort()),
                thursday: Object.fromEntries(Object.entries(jue).sort()),
                friday: Object.fromEntries(Object.entries(vie).sort()),
                saturday: Object.fromEntries(Object.entries(sab).sort()),
            };
            const response = {}
            for (const day in sortedSchedule) {
                let weekDayArray = []
                const weekDay = sortedSchedule[day]
                for (const sch in weekDay){
                    weekDayArray.push({
                        schedule: sch,
                        id: weekDay[sch].id,
                        course: weekDay[sch].course,
                        group: weekDay[sch].group,
                        classroom: weekDay[sch].classroom
                    })
                }
                response[day] = weekDayArray
            }
            return response
        }
        static async occupiedSchedule(ds,h,sem,tid,lid){
            const weekdays = ds.split(",")
            const dHours = h.split("-")
            let count = 0
            for (const d of weekdays) {
                let results, metadata
                if (lid === -1) {
                    [results, metadata] = await sequelize.query("select * from TeacherRole left join ClassList on TeacherRole.ClassListClassListId = ClassList.classListId where semester = ? and TeacherTeacherId = ?", {replacements: [sem, tid]})
                }
                else {
                    [results, metadata] = await sequelize.query("select * from TeacherRole left join ClassList on TeacherRole.ClassListClassListId = ClassList.classListId where semester = ? and TeacherTeacherId = ? and ClassListClassListId != ?", {replacements: [sem, tid, lid]})
                }
                for (const row of results){
                    if (row.wDays === null || row.schedule == null){
                        count = 0
                    }
                    else if (row.wDays.split(",").includes(d)){
                        const hs = row.schedule.split("-")
                        const range = Array(parseInt(hs[1]) - parseInt(hs[0]) + 1).fill().map((_, idx) => parseInt(hs[0]) + idx)
                        if (range.includes(parseInt(dHours[0])) || range.includes(parseInt(dHours[1]))){
                            count += 1
                        }
                        if (parseInt(dHours[0]) === range[range.length - 1] || parseInt(dHours[1]) === range[0]){
                            count -= 1
                        }
                    }
                }
            }
            return count;
        }
        static async findTeacherRole(cid,tid){
            const [results, metadata] = await sequelize.query("select * from TeacherRole where ClassListClassListId = ? and TeacherTeacherId = ?",{replacements:[cid,tid]})
            return results;
        }
    }
    TeacherRole.init({
        isHead : {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        classroom : {
            type: DataTypes.STRING,
            allowNull: true
        },
        wDays : {
            type: DataTypes.STRING,
            allowNull: true
        },
        schedule : {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'TeacherRole',
        timestamps: false,
        freezeTableName: true
    });
    return TeacherRole;
};
