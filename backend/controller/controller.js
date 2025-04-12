//controllers for registration and login
const regPage = (req, res) => {
    res.render('register');
};

const logPage = (req, res) => {
    res.render('login');
};

module.exports = {
    regPage,
    logPage,
}