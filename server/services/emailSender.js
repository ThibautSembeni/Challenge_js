const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    '43ab1a6caaa30c840a481ddf1645f3dd',
    '1165034d6ac67bd7345ef9aad61b1035',
);

module.exports = function sendAccountValidationEmail(user, confirmation_link) {
    const {name, email} = user
    if (!email) throw new Error("Erreur : champ 'email' non défini");
    if (!confirmation_link) throw new Error("Erreur : champ 'confirmation_link' non défini");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Erreur : format d'e-mail invalide");

    const data = {
        Messages: [
            {
                From: {
                    Email: "oussama.1941@gmail.com",
                    Name: "Application Name"
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
    }
    return _sendEmail(data);
}

function _sendEmail(data) {
    const request = mailjet
        .post('send', {version: 'v3.1'})
        .request(data);

    return request
        .then((result) => {
            console.log("E-mail envoyé avec succès");
            return result;
        })
        .catch((err) => {
            console.log(err.statusCode + " " + err.statusText);
            throw err;
        });
}