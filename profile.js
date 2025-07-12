// JavaScript for user profile management

async function loadUserProfileDetails() {
    try {
        const profileData = await apiFetch('/api/profiles/?user__id=' + currentUser.id);
        if (profileData.length > 0) {
            const profile = profileData[0];
            document.getElementById('profile-location').value = profile.location || '';
            // Load skills offered and wanted
            // For simplicity, just display skill names
            const skillsOffered = profile.skills_offered.map(s => s.name).join(', ');
            const skillsWanted = profile.skills_wanted.map(s => s.name).join(', ');
            document.getElementById('profile-skills-offered').textContent = skillsOffered;
            document.getElementById('profile-skills-wanted').textContent = skillsWanted;
            // Availability checkboxes
            document.getElementById('availability-weekdays').checked = profile.availability_weekdays_evenings;
            document.getElementById('availability-weekends').checked = profile.availability_weekends;
            document.getElementById('availability-flexible').checked = profile.availability_flexible;
            // Visibility
            document.getElementById('profile-visibility').checked = profile.is_public;
        }
    } catch (e) {
        console.error('Failed to load profile details:', e);
    }
}

async function saveUserProfileDetails() {
    try {
        const location = document.getElementById('profile-location').value;
        const availability_weekdays_evenings = document.getElementById('availability-weekdays').checked;
        const availability_weekends = document.getElementById('availability-weekends').checked;
        const availability_flexible = document.getElementById('availability-flexible').checked;
        const is_public = document.getElementById('profile-visibility').checked;

        // Fetch profile id
        const profileData = await apiFetch('/api/profiles/?user__id=' + currentUser.id);
        if (profileData.length === 0) {
            alert('Profile not found');
            return;
        }
        const profileId = profileData[0].id;

        // Update profile
        await apiFetch('/api/profiles/' + profileId + '/', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                location,
                availability_weekdays_evenings,
                availability_weekends,
                availability_flexible,
                is_public
            })
        });
        alert('Profile updated successfully');
    } catch (e) {
        alert('Failed to update profile: ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        loadUserProfileDetails();
        document.getElementById('profile-save-btn').addEventListener('click', (e) => {
            e.preventDefault();
            saveUserProfileDetails();
        });
    }
});
