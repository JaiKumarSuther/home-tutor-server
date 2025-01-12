const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token || req.body.token ||
        req.header('Authorization').replace('Bearer ', '');

        // check if token is missing
        if (!token) {
            return res.status(401).json({
                success: false, 
                message: "token is missing"
            });
        };

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log('decoded jwt', decode);
            req.user = decode;
        } catch(error) {
           // verifaction issue
            res.status(401).json({
                success: false,
                message: 'token is invalid'
            })
        }

        // move to next middleware
        next();

    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong while validating the token'
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'this is a protected for students only'
            })
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'user route cannot be verified'
        })
    }
}

exports.isTutor = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Tutor') {
            return res.status(401).json({
                success: false,
                message: 'this is a protected for Tutors only'
            })
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'user route cannot be verified'
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'this is a protected for Admins only'
            });
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'user route cannot be verified'
        })
    }
}