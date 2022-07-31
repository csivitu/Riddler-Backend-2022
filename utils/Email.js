import nodemailer from 'nodemailer'

const sendEmail = async values =>{
    
    const transporter= nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });

    const mailOptions= {
        from: `CSI <${process.env.CSI_MAIL}>`,
        to: values.email,
        subject: values.subject,
        text: values.body
        // html: options.html
    };

    await transporter.sendMail(mailOptions)
}

export default sendEmail;