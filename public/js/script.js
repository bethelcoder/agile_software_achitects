// Targeting each button by ID
const googleBtn = document.querySelector('#google-icon').parentElement;
const microsoftBtn = document.querySelector('#ms-icon').parentElement;
const facebookBtn = document.querySelector('#fb-icon').parentElement;
const twitterBtn = document.querySelector('#twitter-icon').parentElement;
const signInBtn = document.querySelector('.signin');
const signUpBtn = document.querySelector('.signout');

// Example: Adding event listeners
googleBtn.addEventListener('click', () => {
    window.location.href = "/auth/google";
});

microsoftBtn.addEventListener('click', () => {
    window.location.href = "/auth/github";
});

facebookBtn.addEventListener('click', () => {
    alert('Facebook button clicked!');
});

twitterBtn.addEventListener('click', () => {
    alert('Twitter button clicked!');
});

signInBtn.addEventListener('click', () => {
    window.location.href = "/users/login";
});

signUpBtn.addEventListener('click', () => {
    window.location.href = "/users/register";
})

