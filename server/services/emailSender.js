const Mailjet = require('node-mailjet');

class EmailSender {
    static apiKey = '43ab1a6caaa30c840a481ddf1645f3dd';
    static apiSecret = '8eda4d98c6147572d0c7236292bfa92e'
    static emailSender = 'oussama.1941@gmail.com'
    static projectName = 'PROJECT_NAME'
    static mailjet = Mailjet.apiConnect(EmailSender.apiKey, EmailSender.apiSecret);

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static async sendForgotPasswordEmail(user, confirmationLink) {
        const {firstname, lastname, email} = user;

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!confirmationLink) throw new Error("Erreur : champ 'confirmationLink' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4965682,
            username: `${lastname} ${firstname}`,
            email: email,
            confirmation_link: confirmationLink
        }
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async sendEmailForOperation(user, status) {
        const {firstname, lastname, email} = user;

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4971789,
            username: `${lastname} ${firstname}`,
            email: email,
            status: status
        }
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async accountValidationEmail(user, confirmationLink) {
        const {firstname, lastname, email} = user;

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!confirmationLink) throw new Error("Erreur : champ 'confirmationLink' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4910924,
            username: `${lastname} ${firstname}`,
            email: email,
            confirmation_link: confirmationLink
        }
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async sendPendingValidationEmail(user) {
        const {name, email} = user;

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4940207,
            username: name ?? email,
            email: email
        }
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async sendCredentialsForMerchant(user, credentials) {
        const {firstname, lastname, email} = user;
        const {client_token, client_secret} = credentials

        if (!client_token) throw new Error("Erreur : champ 'client_token' non défini");
        if (!client_secret) throw new Error("Erreur : champ 'client_secret' non défini");

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4940725,
            username: firstname + " " + lastname,
            email: email,
            client_token: client_token,
            client_secret: client_secret
        }
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async sendDeclineMail(user) {
        const {firstname, lastname, email} = user;

        if (!email) throw new Error("Erreur : champ 'email' non défini");
        if (!EmailSender.validateEmail(email)) throw new Error("Erreur : format d'e-mail invalide");

        const data = {
            template_id: 4940728,
            username: firstname + " " + lastname,
            email: email
        }
        console.log("ok")
        try {
            return await EmailSender.sendEmail(data);
        } catch (err) {
            throw err;
        }
    }

    static async sendEmail(data) {
        const {template_id, username, email, confirmation_link, status, client_token, client_secret} = data
        const variables = {
            name: username
        };
        if (confirmation_link !== undefined) {
            variables.confirmation_link = confirmation_link;
        }
        if (client_token && client_secret) {
            variables.public_key = client_token;
            variables.private_key = client_secret;
        }
        if (status!== undefined) {
            variables.status = status;
        }
        const body = {
            From: {
                Email: EmailSender.emailSender,
                Name: EmailSender.projectName
            },
            To: [
                {
                    Email: email,
                    Name: username
                }
            ],
            TemplateID: template_id,
            Variables: variables,
            TemplateLanguage: true,
        }
        try {
            const response = await EmailSender.mailjet
                .post('send', {version: 'v3.1'})
                .request({Messages: [body]});
            response.response.request.socket.destroy();
            return true;
        } catch (err) {
            throw err;
        }
    }

}


module.exports = EmailSender;
