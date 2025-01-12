const User = require('../models/User');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// send OTP
exports.sendOTP = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body;
        // check if user already exits
        const checkUserPresent = await User.findOne({email});
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User is already registered'
            })
        }
        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log('generated otp: ', otp);
        // check if otp is unique of not
        const result = await OTP.findOne(otp);
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne(otp)
        }
        const otpPayload = {email, otp};
        // create an entry of otp in the database
        const otpBody = await OTP.create(otpPayload)
        console.log('otp bdoy', otpBody)
        
        // return response
        return res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully' // usnig pre middleware in OTP model
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// sign up
exports.signUp = async (req, res) => {
    try {
        // fetch data from req body
        const { firstName, otp, lastName, email, password, confirmPassword, accountType } = req.body

        // validate data
        if (!firstName || !lastName || !email || !password || !accountType) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required!!'
            });
        }

        // match both passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'password and confirmPassword values are not same, please try again'
            });
        }

        // check if user already exist
        const existingUser = await User.findOne({email});
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User is already registered'
            });
        };

        // find the most recent stored OTP for the user
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        // validate otp
        if(recentOTP.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: 'otp not found'
            });
        } else if (otp !== recentOTP.otp) {
            // invalid otp
            return res.status(400).json({
                success: false,
                message: 'invalid otp'
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in db
        const profileDetails = await Profile.create({
            gender: null,
            dataOfBirth: null,
            about: null,
            contactNumber: null,
            subjects: []
        })
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
        })

        // return response
        res.status(200).json({
            success: true,
            message: 'User is registered successfully',
            user
        });


        
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'user cannot be registered please try again'
        })
    }
}

// login
exports.login = async (req, res) => {
    try {
        // get data from req body
        const { email, password } = req.body;

        // validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required please try again'
            })
        }

        // check if user exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered, please sign up first'
            });
        }
        // match password and generate jwt
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })

            user.token = token;
            user.password = undefined;

            // create a cookie & send reponse
            const options = {
                expires: new Date(Date.now() + 3 * 60 * 60 * 24 * 1000),
                httpOnly: true
            }

            res.cookie('token', token, options).status(200).json({
                success: true,
                user,
                token,
                message: 'logged in successfully'
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            })
        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login failure, please try again'
        })
    }
}