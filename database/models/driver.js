module.exports = (sql, Sequelize) => {
    const driver = sql.define({
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        password: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        adress: Sequelize.STRING,
        gender: Sequelize.STRING,
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        cin: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        rate: Sequelize.INTEGER,
        state: Sequelize.STRING,
        photo: Sequelize.STRING,
    })
}