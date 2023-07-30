const { notifyUser, notify } = require("../../utils/notify.sse");

const mockUserResponse = {
    dataToSend: "",
    write: function (data) {
        this.dataToSend += data;
    },
};

describe("notifyUser", () => {
    test("should notify the user with the correct event data", () => {
        const event = {
            id: 12345,
            name: "testEvent",
            data: { username: "user123", message: "Hello" },
        };

        notifyUser(event, mockUserResponse);

        expect(mockUserResponse.dataToSend).toContain(`id: ${event.id}`);
        expect(mockUserResponse.dataToSend).toContain(`event: ${event.name}`);
        expect(mockUserResponse.dataToSend).toContain(
            `data: ${JSON.stringify(event.data)}`
        );
    });
});

describe("notify", () => {
    test("should notify the correct subscribers with the event data", () => {
        const event = {
            id: 12345,
            name: "testEvent",
            data: { username: "user123", message: "Hello" },
        };

        const subscribers = {
            user123: mockUserResponse,
            user456: mockUserResponse,
            user789: mockUserResponse,
        };

        const eventsSent = [];
        notify(event, false, subscribers, eventsSent);

        expect(eventsSent).toHaveLength(1);
        expect(eventsSent[0]).toEqual(event);
    });

    test("should notify all subscribers when notifyAll is true", () => {
        const event = {
            id: 12345,
            name: "testEvent",
            data: { username: "user123", message: "Hello" },
        };

        const subscribers = {
            user123: mockUserResponse,
            user456: mockUserResponse,
            user789: mockUserResponse,
        };

        const eventsSent = [];
        notify(event, true, subscribers, eventsSent);

        expect(eventsSent).toHaveLength(1);
        expect(eventsSent[0]).toEqual(event);
        expect(mockUserResponse.dataToSend).toContain(`id: ${event.id}`);
    });
});