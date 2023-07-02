const API_URL = 'http://localhost:3000'

describe('Test register', () => {
    const target_url = 'register'
    const url = `${API_URL}/${target_url}`

    it('Register User', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@test.com',
            password: 'password',
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.firstname).toBe(registrationData.firstname);
        expect(responseData.lastname).toBe(registrationData.lastname);
        expect(responseData.email).toBe(registrationData.email);
    });

    it('User already exists', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@test.com',
            password: 'password',
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        expect(response.status).toBe(409);
    });

    it('Register User with customer role', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'customer@test.com',
            password: 'password',
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.role).toBe('customer');
    });

    it('Register User with merchant role', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'merchant@test.com',
            password: 'password',
            kbis: 'kbis',
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.role).toBe('merchant');
    });

    it('Register with incorrect email type', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'incorrectEmail.com',
            password: 'password',
            kbis: 'kbis',
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const responseData = await response.json();

        expect(response.status).toBe(422);
        expect(responseData.email).toBeDefined();
        expect(responseData.email).toContain("L'email doit être valide");
    });

    it('Register with incorrect password', async () => {
        const registrationData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });
        const responseData = await response.json();

        expect(response.status).toBe(422);
        expect(responseData.password).toBeDefined();
        expect(responseData.password).toContain("Validation len on password failed");
    });

    it('Register with multiple incorrect field', async () => {
        const registrationData = {
            firstname: 'f',
            lastname: 'Doe',
            email: 'incorrect@field.com',
            password: 'pass'
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        const responseData = await response.json();

        expect(response.status).toBe(422);
        expect(responseData.password).toBeDefined();
        expect(responseData.firstname).toBeDefined();
        expect(responseData.password).toContain("Validation len on password failed");
        expect(responseData.firstname).toContain("Le prénom doit contenir entre 2 et 50 caractères");
    });

});
