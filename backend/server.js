const express = require('express');
const path = require('path');
const AgileRoutes=require('./routes');
const app = express();
const PORT = process.env.PORT || 4000;

app.set('views', path.join(__dirname, '..', 'frontend', 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'backend')));

app.get('/', (req, res) => {
  res.render('index');
});
app.use('/api',AgileRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
