import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type: 'OAuth2',
        user:process.env.GOOGLE_USER,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
        clientId:process.env.GOOGLE_CLIENT_ID
    }
})
transporter.verify()
    .then(()=>{console.log("Email Transporter is ready to send Email");})
    .catch((err)=>{console.log("Email Transporter verification failed",err)})

export async function sendEmail({to,subject,html,text}){
    const mailOptions={
        from:process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };
    const details=await transporter.sendMail(mailOptions);
    console.log("Email sent:",details)
    return "email send successfully,to "+to
}