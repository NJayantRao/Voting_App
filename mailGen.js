import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendMail= async (options)=>{
    const mailGenerator= new Mailgen({
        theme:"default",
        product:{
             name: "Voting App",
            link: "https://votingapp.com",
        }
    })

    const emailText= mailGenerator.generatePlaintext(options.mailGenContent)

    const emailHTML= mailGenerator.generate(options.mailGenContent)

    //Sending mail
    const transporter = nodemailer.createTransport({
    host:process.env.MAIL_TRAP_SMTP_HOST,
    port: process.env.MAIL_TRAP_SMTP_PORT,
    auth: {
        user: process.env.MAIL_TRAP_SMTP_USER,
        pass: process.env.MAIL_TRAP_SMTP_PASS,
        },
    });

    //Sending
    const mail={
        from:"test@gmail.com",
        to:options.mail,
        subject:options.subject,
        text:emailText,
        html:emailHTML
    }

    try{
        await transporter.sendMail(mail)
    }catch(err){
        console.log(`Error: ${err}`)
    }

}

const mailGenContent= (username,verificationURL)=>{
    return{
        body: {
            name: username,
            intro: 'Welcome to Voting_App! We are very excited to have you on board.',
            action: {
                instructions: 'To complete Verification, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: verificationURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we would love to help.'
        }
    }
}

const forgotPasswordContent= (username,forgotPasswordURL)=>{
    return{
        body: {
            name: username,
            intro: 'Want to Reset your password.',
            action: {
                instructions: 'Click on Reset Button to proceed',
                button: {
                    color: '#e70a0aff', // Optional action button color
                    text: 'Reset Password',
                    link: forgotPasswordURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we would love to help.'
        }
    }
}

export { mailGenContent,forgotPasswordContent, sendMail }