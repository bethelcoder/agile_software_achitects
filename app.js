//app config
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
const PORT = process.env.PORT || 4000;

// View and static config
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'frontend', 'view'));//if views is located in another folder called frontend!!
app.use(express.static('public'));
const userRoutes = require('./backend/routes/routes');


app.get('/', (req, res) => {
    res.render('index');
});

app.use('/users', userRoutes);
app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));