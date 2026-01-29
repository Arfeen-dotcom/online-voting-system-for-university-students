// Toggle Dark/Light Mode
function toggleMode() {
    document.body.classList.toggle("light");
}

// Handle Enter key on Student ID field - moves to password
function handleIdKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('password').focus();
    }
}

// Handle Enter key on Password field - submits login
function handlePasswordKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin();
    }
}

// Login Function
function handleLogin() {
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;

    if (!studentId) {
        alert("Please enter Student ID");
        return;
    }

    // Validate ID format: one character followed by 10 digits
    const idPattern = /^[a-zA-Z]\d{10}$/;
    if (!idPattern.test(studentId)) {
        alert("Invalid Student ID format. Use format: f2024376033 (1 letter + 10 digits)");
        document.getElementById('studentId').value = '';
        document.getElementById('password').value = '';
        document.getElementById('studentId').focus();
        return;
    }

    // Check if user has already voted
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
    if (votedUsers.includes(studentId.toLowerCase())) {
        alert("Sorry, you have already cast your vote.");
        document.getElementById('studentId').value = '';
        document.getElementById('password').value = '';
        document.getElementById('studentId').focus();
        return;
    }

    if (!password) {
        alert("Please enter Password");
        return;
    }

    // Hide login section, show voting section
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('votingSection').style.display = 'block';
    document.getElementById('infoSection').style.display = 'none';

    // Store current student ID for vote submission
    sessionStorage.setItem('currentStudentId', studentId.toLowerCase());
}

// Submit Vote Function
function submitVote() {
    const selectedVote = document.querySelector('input[name="vote"]:checked');

    if (!selectedVote) {
        alert("Please select a candidate before submitting");
        return;
    }

    // Get current student ID and add to voted users
    const studentId = sessionStorage.getItem('currentStudentId');
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
    votedUsers.push(studentId);
    localStorage.setItem('votedUsers', JSON.stringify(votedUsers));

    // Store the vote in votes object
    const votes = JSON.parse(localStorage.getItem('votes') || '{"Imran Khan": 0, "Nawaz Sharif": 0}');
    const candidate = selectedVote.value;
    votes[candidate] = (votes[candidate] || 0) + 1;
    localStorage.setItem('votes', JSON.stringify(votes));

    // Hide voting section, show thank you section
    document.getElementById('votingSection').style.display = 'none';
    document.getElementById('thankYouSection').style.display = 'block';

    // After 2 seconds, show results
    setTimeout(() => {
        document.getElementById('thankYouSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        renderChart();
    }, 2000);
}

// Render Election Results Chart
function renderChart() {
    const ctx = document.getElementById('resultChart');
    if (ctx) {
        // Get votes from localStorage
        const votes = JSON.parse(localStorage.getItem('votes') || '{"Imran Khan": 0, "Nawaz Sharif": 0}');
        const imranVotes = votes['Imran Khan'] || 0;
        const nawazVotes = votes['Nawaz Sharif'] || 0;
        const totalVotes = imranVotes + nawazVotes;

        // Calculate percentages
        const imranPercent = totalVotes > 0 ? ((imranVotes / totalVotes) * 100).toFixed(1) : 0;
        const nawazPercent = totalVotes > 0 ? ((nawazVotes / totalVotes) * 100).toFixed(1) : 0;

        // Determine winner
        const winner =
            imranVotes > nawazVotes ? 'Imran Khan' :
            nawazVotes > imranVotes ? 'Nawaz Sharif' :
            'Tie';

        // Create chart
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Imran Khan', 'Nawaz Sharif'],
                datasets: [{
                    label: 'Votes',
                    data: [imranVotes, nawazVotes],
                    backgroundColor: ['#FF6B6B', '#4ECDC4'],
                    borderColor: ['#FF5252', '#45B7AA'],
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 14, weight: 'bold' },
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        // Update vote stats
        document.getElementById('vote1Count').textContent = imranVotes;
        document.getElementById('vote2Count').textContent = nawazVotes;
        document.getElementById('percent1Count').textContent = imranPercent + '%';
        document.getElementById('percent2Count').textContent = nawazPercent + '%';
        document.getElementById('totalVotesDiv').textContent = 'Total Votes: ' + totalVotes;

        // Update vote bars
        const maxVotes = Math.max(imranVotes, nawazVotes) || 1;
        document.getElementById('fill1').style.width = (imranVotes / maxVotes * 100) + '%';
        document.getElementById('fill2').style.width = (nawazVotes / maxVotes * 100) + '%';

        // Show winner badge
        const winnerBadge = document.getElementById('winnerBadge');
        if (winner !== 'Tie' && totalVotes > 0) {
            winnerBadge.innerHTML = '👑 <strong>' + winner + '</strong> is Leading!';
            winnerBadge.style.display = 'block';
        } else if (winner === 'Tie') {
            winnerBadge.innerHTML = '⚖️ It\'s a Tie!';
            winnerBadge.style.display = 'block';
        }
    }
}

// ===============================
// RESET ALL VOTING DATA (ADDED)
// ===============================
function resetAllVotingData() {
    // Clear stored data
    localStorage.removeItem('votedUsers');
    localStorage.removeItem('votes');
    sessionStorage.removeItem('currentStudentId');

    // Reset UI
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('votingSection').style.display = 'none';
    document.getElementById('thankYouSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('infoSection').style.display = 'block';

    // Clear inputs
    document.getElementById('studentId').value = '';
    document.getElementById('password').value = '';

    alert("All voting data has been reset!");
}
