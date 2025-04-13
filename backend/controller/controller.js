//controllers for registration and login
const regPage = (req, res) => {
    res.render('register');
};

const logPage = (req, res) => {
    res.render('login');
};

const profPage = (req, res) => {
    res.render('profile');
};

module.exports = {
    regPage,
    logPage,
    profPage,
}