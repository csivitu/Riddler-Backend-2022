import nodemailer from 'nodemailer'
import envHandler from '../managers/envHandler.js';

const sendEmail = async values =>{
    
    const transporter= nodemailer.createTransport({
        host: envHandler("EMAIL_HOST"),
        port: envHandler("EMAIL_PORT"),
        auth:{
            user:envHandler("EMAIL_USER"),
            pass:envHandler("EMAIL_PASS")
        }
    });

    const mailOptions= {
        from: `CSI <${envHandler("CSI_MAIL")}>`,
        to: values.email,
        subject: values.subject,
        text: values.body
        // html: options.html
    };

    await transporter.sendMail(mailOptions)
}

export default sendEmail;