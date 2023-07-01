const Mailjet = require('node-mailjet');

async function sendAccountValidationEmail(user, confirmation_link) {
    const {name, email} = user;
    if (!email) throw new Error("Erreur : champ 'email' non défini");
    if (!confirmation_link) throw new Error("Erreur : champ 'confirmation_link' non défini");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Erreur : format d'e-mail invalide");

    const data = {
        Messages: [
            {
                From: {
                    Email: process.env.EMAIL_SENDER,
                    Name: process.env.PROJECT_NAME
                },
                To: [
                    {
                        Email: email,
                        Name: name ?? email
                    }
                ],
                TemplateID: 4910924,
                Variables: {
                    name: name ?? email,
                    confirmation_link: confirmation_link
                },
                TemplateLanguage: true,
            }
        ]
    };
    try {
        return await _sendEmail(data);
    } catch (err) {
        throw err;
    }
}

async function _sendEmail(data) {
    try {
        const mailjet = Mailjet.apiConnect(
            process.env.MAILJET_PK,
            process.env.MAILJET_SK
        );

        const response = await mailjet
            .post('send', {version: 'v3.1'})
            .request(data);
        response.response.request.socket.destroy()

        return true;
    } catch (err) {
        throw err;
    }
}
module.exports = sendAccountValidationEmail;
