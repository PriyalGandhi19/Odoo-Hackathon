// JavaScript for swap request management

async function loadSwapRequests() {
    try {
        const swaps = await apiFetch('/api/swaps/?from_profile__user=' + currentUser.id);
        const mainContent = document.getElementById('main-content');
        if (swaps.length === 0) {
            mainContent.innerHTML = '<p>No swap requests found.</p>';
            return;
        }
        let html = '<h2 class="text-xl font-bold mb-4">My Swap Requests</h2><div class="space-y-4">';
        swaps.forEach(swap => {
            html += `
                <div class="border p-4 rounded shadow">
                    <p><strong>To:</strong> ${swap.to_profile.user.username}</p>
                    <p><strong>Skill Offered:</strong> ${swap.skill_offered.name}</p>
                    <p><strong>Skill Requested:</strong> ${swap.skill_requested.name}</p>
                    <p><strong>Status:</strong> ${swap.status}</p>
                    <div class="mt-2">
                        ${swap.status === 'Pending' ? `
                        <button onclick="acceptSwap(${swap.id})" class="bg-green-600 text-white px-3 py-1 rounded mr-2">Accept</button>
                        <button onclick="rejectSwap(${swap.id})" class="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        mainContent.innerHTML = html;
    } catch (e) {
        alert('Failed to load swap requests: ' + e.message);
    }
}

async function acceptSwap(swapId) {
    try {
        await apiFetch(`/api/swaps/${swapId}/accept/`, {method: 'POST'});
        alert('Swap accepted');
        loadSwapRequests();
    } catch (e) {
        alert('Failed to accept swap: ' + e.message);
    }
}

async function rejectSwap(swapId) {
    try {
        await apiFetch(`/api/swaps/${swapId}/reject/`, {method: 'POST'});
        alert('Swap rejected');
        loadSwapRequests();
    } catch (e) {
        alert('Failed to reject swap: ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        loadSwapRequests();
    }
});
