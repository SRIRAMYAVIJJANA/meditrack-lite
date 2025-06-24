const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const engine = require('ejs-mate');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
  secret: 'meditrack-secret',
  resave: false,
  saveUninitialized: true,
}));

// Flash
app.use(flash());

// Make flash messages available globally
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
