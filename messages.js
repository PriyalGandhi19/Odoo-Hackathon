// JavaScript for messaging functionality

async function loadMessages() {
    try {
        const messages = await apiFetch('/api/messages/?sender__user=' + currentUser.id);
        const mainContent = document.getElementById('main-content');
        if (messages.length === 0) {
            mainContent.innerHTML = '<p>No messages found.</p>';
            return;
        }
        let html = '<h2 class="text-xl font-bold mb-4">My Messages</h2><div class="space-y-4">';
        messages.forEach(msg => {
            html += `
                <div class="border p-4 rounded shadow">
                    <p><strong>To:</strong> ${msg.receiver.user.username}</p>
                    <p>${msg.content}</p>
                    <p class="text-xs text-gray-500">${new Date(msg.sent_at).toLocaleString()}</p>
                </div>
            `;
        });
        html += '</div>';
        mainContent.innerHTML = html;
    } catch (e) {
        alert('Failed to load messages: ' + e.message);
    }
}

async function sendMessage(receiverId, content) {
    try {
        await apiFetch('/api/messages/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sender: currentUser.id,
                receiver: receiverId,
                content: content
            })
        });
        alert('Message sent');
        loadMessages();
    } catch (e) {
        alert('Failed to send message: ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        loadMessages();
    }
});
