import nodemailer from 'nodemailer'
const sendEmail = async (options) => {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        // service: 'gmail',
        port: process.env.EMAIL_PORT, // if secure = true then port = 465, if secure = false then port = 587
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // Define email options
    const mailOptions = {
        from: `"Test API" <dramcode93@gmail.com>`, // sender address - add your email here
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // Send Email
    await transporter.sendMail(mailOptions);

}

export default sendEmail