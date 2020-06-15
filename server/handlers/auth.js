const bcrypt = require('bcryptjs');
const db = require('../../database');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const createError = require('http-errors')

exports.signUpDriver = async (req, res) => {

    let body = req.body;
    let profile = {};
    for(let key in body){
        profile[key] = body[key];
    }
    //profile.photo = req.file.destination;

    try {
        if (!req.body.password) throw createError(404, `missing password`);
        const {
            email
        } = profile;
        const driverEmail = await db.driver.findOne({where: {email}});
        const userEmail = await db.user.findOne({where: {email}});

        if (userEmail || driverEmail) {
            console.log(chalk.red('I am here'))
            throw createError(403, `email '${email}' already exist`)
        }
        const hashedPassword = await bcrypt.hash(profile.password, 10);
        profile.password = hashedPassword
        const driver = await db.driver.create(profile);
        if(!driver) throw createError(400, `driver not created`)
        else res.status(201).json({success: 'driver created successfully'});
        
    } catch (e) {
        res.status(e.status).json({error: e.message});
    }
};

exports.signUpUser = async (req, res) => {
    let body = req.body;
    let profile = {};
    for(let key in body){
       profile[key] = body[key];
        console.log(key + ' ' +body[key]+'\n');
    }
    //profile.photo = req.file.destination;
    
    try {
        if (!req.body.password) throw createError(404, `missing password`);
        const {
            email
        } = profile;
        const driverEmail = await db.driver.findOne({where: {email}});
        const userEmail = await db.user.findOne({where: {email}});

        if (userEmail || driverEmail) {
            throw createError(403, `email '${email}' already exist`)
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        profile.password = hashedPassword
        const user = await db.user.create(profile);

        if(!user) throw createError(400, `user not created`)
        else res.status(201).json({
            success: 'User created successfully'
        });
    } catch (e) {
        res.status(e.status).json({error: e.message});
    }
};

exports.login = async (req, res) => {

    try {
        if (!req.body.password) throw createError(404, `missing password`);
        if (!req.body.email) throw createError(404, `missing email`);
        
        let role ="user";
        const {
            email,
            password
        } = req.body;
        let user = await db.user.findOne({where: {email}});
        
        if (!user) {
            user = await db.driver.findOne({where: {email}});
            if (!user) throw createError(404, `User not registered`); else role = "driver"
        }

        if(user) {
            let validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw createError(401, `wrong Password`);
            }
            else {
                let token = jwt.sign({
                    id: user.id,
                    role: role
                }, 'process.env.SECRET');
                res.status(201).json({
                    message: 'Sucessfully logged in',
                    id: user.id,
                    role,
                    token
                })
            }
        }
    } catch (e) {
        res.status(e.status).json({error: e.message});
    }
};
