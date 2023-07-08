const sendAccountValidationEmail = require("../../services/emailSender")
const mongoose = require("mongoose");
describe('Test Email', () => {

    it('Send email with email not defined', async () => {

        const user = { name: 'John Doe' };
        const confirmationLink = 'https://example.com/confirm';

        try {
            await sendAccountValidationEmail(user, confirmationLink);
        } catch (error) {
            expect(error.message).toBe("Erreur : champ 'email' non défini");
        }
    });

    it('Send email with invalid email format ', async () => {
        const user = { name: 'John Doe', email: 'johndoe.com' };
        const confirmationLink = 'https://example.com/confirm';

        try {
            await sendAccountValidationEmail(user, confirmationLink);
        } catch (error) {
            expect(error.message).toBe("Erreur : format d'e-mail invalide");
        }
    });

    it('Send email with confirmation link not defined', async () => {
        const user = { name: 'John Doe', email: 'john@doe.com' };

        try {
            await sendAccountValidationEmail(user);
        } catch (error) {
            expect(error.message).toBe("Erreur : champ 'confirmation_link' non défini");
        }
    });

    it('should send the email successfully', async () => {
        const user = { name: 'John Doe', email: 'test@example.com' };
        const confirmationLink = 'https://example.com/confirm';
        const result = await sendAccountValidationEmail(user, confirmationLink);
        expect(result).toBe(true)

    });
});

afterAll(async () => {
    await mongoose.connection.close();
});