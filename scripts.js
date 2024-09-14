document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const userData = Object.fromEntries(formData.entries());

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').innerText = 'User data submitted successfully!';
        fetchMatches(data._id); // Fetch apartments and matches for the new user
    })
    .catch(error => {
        console.error('Error submitting user data:', error);
        document.getElementById('responseMessage').innerText = 'Error submitting user data.';
    });
});

function fetchMatches(userId) {
    fetch(`/api/users/find-apartments/${userId}`)
        .then(response => response.json())
        .then(data => {
            const apartmentsDiv = document.getElementById('apartments');
            apartmentsDiv.innerHTML = ''; // Clear previous results

            const usersDiv = document.getElementById('users');
            usersDiv.innerHTML = ''; // Clear previous results

            if (data.apartments.length === 0) {
                apartmentsDiv.innerHTML = '<p>No apartments found.</p>';
            } else {
                data.apartments.forEach(apartment => {
                    const div = document.createElement('div');
                    div.classList.add('apartment');
                    div.innerHTML = `
                        <h3>${apartment.name}</h3>
                        <p>Address: ${apartment.vicinity || 'N/A'}</p>
                        <p>Rating: ${apartment.rating || 'N/A'}</p>
                        <p>Types: ${apartment.types.join(', ')}</p>
                    `;
                    apartmentsDiv.appendChild(div);
                });
            }

            if (data.users.length === 0) {
                usersDiv.innerHTML = '<p>No users found.</p>';
            } else {
                data.users.forEach(user => {
                    const div = document.createElement('div');
                    div.classList.add('user');
                    div.innerHTML = `
                        <h3>${user.name}</h3>
                        <p>Income: ${user.income}</p>
                        <p>Student Status: ${user.studentStatus}</p>
                        <p>Roommates: ${user.roommates}</p>
                        <p>Location: ${user.location}</p>
                        <p>Job: ${user.job}</p>
                        <p>Salary: ${user.salary}</p>
                    `;
                    usersDiv.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            const apartmentsDiv = document.getElementById('apartments');
            apartmentsDiv.innerHTML = '<p>Error fetching apartments.</p>';
            const usersDiv = document.getElementById('users');
            usersDiv.innerHTML = '<p>Error fetching users.</p>';
        });
}

