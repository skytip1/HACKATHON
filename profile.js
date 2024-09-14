async function fetchProfile() {
    try {
        const response = await fetch('/api/users/profile');
        if (!response.ok) throw new Error('Network response was not ok');

        const user = await response.json();
        document.getElementById('income').textContent = user.income;
        document.getElementById('studentStatus').textContent = user.studentStatus;
        document.getElementById('roommates').textContent = user.roommates;
        document.getElementById('location').textContent = user.location;
        document.getElementById('job').textContent = user.job;
        document.getElementById('salary').textContent = user.salary;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Fetch profile data when the page loads
document.addEventListener('DOMContentLoaded', fetchProfile);
