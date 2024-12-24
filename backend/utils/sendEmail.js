const nodemailer = require('nodemailer');

const sendEmail = async (options) =>{
    const transporter = nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    if (options.name && options.file) {
        mailOptions.attachments = [
            {
                filename: options.name, 
                content: options.file.content, // Data URI content
                contentType: options.file.mimetype, 
            },
        ];
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail