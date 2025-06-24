// routes/auth.js
const express = require('express');
const router = express.Router();
const { db, auth } = require('../firebase/firebaseConfig');

// ─── RENDER PAGES ──────────────────────────
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('register', { hideNavbar: true });
});

router.get('/login', (req, res) => {
  res.render('login', { hideNavbar: true });
});

// ─── REGISTRATION ──────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email.endsWith('@meditrack.local')) {
    req.flash('error', 'Only @meditrack.local emails are allowed.');
    return res.redirect('/register');
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role,
      createdAt: new Date(),
    });

    req.flash('success', 'Registration successful! You can now log in.');
    return res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Error creating user: ' + err.message);
    return res.redirect('/register');
  }
});

// ─── LOGIN ────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      req.flash('error', 'Invalid email or user does not exist.');
      return res.redirect('/login');
    }

    let userData, uid;
    snapshot.forEach(doc => {
      userData = doc.data();
      uid = doc.id;
    });

    req.session.user = {
      uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    req.flash('success', 'Login successful!');
    if (userData.role === 'Doctor') {
      return res.redirect('/dashboard/doctor');
    } else {
      return res.redirect('/dashboard/patient');
    }
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Login failed. Please try again.');
    return res.redirect('/login');
  }
});

// ─── LOGOUT ───────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
