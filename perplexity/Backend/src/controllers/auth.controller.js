import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../services/mail.services.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */

export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create(
        { username, email, password, verified: true }
    )

    const token = jwt.sign({
        id: user._id.toString(),
        username: user.username,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

   
    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

   
    sendEmail({
        to: email,
        subject: "welcome to Perplexity",
        html: `
            <p>Hi ${username},</p>
            <p>Thank you for registering at <strong>Perplexity</strong>.</p>
            <a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Best regards,<br/>The Perplexity Team</p>`
    }).catch(err => console.error("Email sending failed:", err.message));

    console.log("REGISTRATION SUCCESS: Created user ID:", user._id.toString());

    res.status(200).json({
        message: "User registered successfully",
        success: true,
        user: {
            username: user.username,
            email: user.email,
            id: user._id.toString()
        }
    });
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Invalid password"
        })
    }

    // Token is not generate when user is not verified
    // if (!user.verified) {
    //     return res.status(400).json({
    //         message: "Please verify your email befor logging in",
    //         success: false,
    //         err: "Email not verified"
    //     })
    // }

    const token = jwt.sign({
        id: user._id.toString(),
        username: user.username,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
})
    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        }
    });
}



/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */



export async function getMe(req, res) {
    try {
        const userId = req.user.id;
        
        console.log("=== GET ME DEBUG ===");
        console.log("req.user:", req.user);
        console.log("userId:", userId);
        console.log("userId type:", typeof userId);
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            console.log("GET-ME FAIL: User with ID", userId, "not found in database");
            return res.status(401).json({
                message: "User not found or session expired",
                success: false,
                err: "User not found"
            })
        }
        res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            user
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            err: error.message
        });
    }
}


export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }
        user.verified = true;
        await user.save();

        const html = `
        <h1> Email Verified Successfully</h1>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <a href= "${process.env.CLIENT_URL || 'http://localhost:3000'}/login">Login</a>
        `

        return res.send(html)
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "User not found"
        })
    }
}

/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification-email
 * @access Public
 * @body { email }
 */

export async function resendVerificationEmail(req, res) {

    const { email } = req.body

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        if (user.verified) {
            return res.status(400).json({
                message: "User already verified",
                success: false
            })
        }

        // generate new token
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        await sendEmail({
            to: user.email,
            subject: "Resend Email Verification - Perplexity",
            html: `
            <p>Hi ${user.username},</p>

            <p>You requested a new verification email.</p>

            <p>Click below to verify your account:</p>

            <a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${emailVerificationToken}">
            Verify Email
            </a>

            <p>If you did not request this email, please ignore it.</p>

            <p>Thanks,<br/>Perplexity Team</p>
            `
        })

        return res.status(200).json({
            message: "Verification email resent successfully",
            success: true
        })

    } catch (err) {

        console.error(err)

        return res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }
}


export async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    res.status(200).json({
        message: "User logged out successfully",
        success: true
    });
}
