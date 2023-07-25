function notifyUser(event, userResponse) {
    const dataToSend = [
        `id: ${event.id}`,
        `event: ${event.name}`,
        `data: ${JSON.stringify(event.data)}`,
        "",
    ].join("\n");
    userResponse.write(dataToSend + "\n");
}

function notify(event, notifyAll = false, subscribers, eventsSent) {
    event.id ??= Date.now();
    Object.entries(subscribers).forEach(([username, res]) => {
        if (notifyAll || username !== event.data.username) {
            notifyUser(event, res);
        }
    });
    eventsSent.push(event);
}

module.exports = { notifyUser, notify };