import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});

transporter.verify()
    .then(() => {
        console.log("transporter is ready to send emails");
    })
    .catch((err) => {
        console.error("Email transporter verification failed", err);
    });

export async function sendEmail({ to, subject, html, text = '' }) {

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    };

    const details = await transporter.sendMail(mailOptions);

    console.log("Email sent:", details);

    return "email sent successfully to " + to;
}