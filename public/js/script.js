// Targeting each button by ID
const googleBtn = document.querySelector('#google-icon').parentElement;
const microsoftBtn = document.querySelector('#ms-icon').parentElement;
const facebookBtn = document.querySelector('#fb-icon').parentElement;
const twitterBtn = document.querySelector('#twitter-icon').parentElement;

// Example: Adding event listeners
googleBtn.addEventListener('click', () => {
    window.location.href = "/auth/google";
}

);

microsoftBtn.addEventListener('click', () => {
    window.location.href = "/auth/github";
});

facebookBtn.addEventListener('click', () => {
    alert('Facebook button clicked!');
});

twitterBtn.addEventListener('click', () => {
    alert('Twitter button clicked!');
});
