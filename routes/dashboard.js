const express = require('express');
const router = express.Router();
const { getAssignedPatients } = require('../helpers/patientHelper');

// Doctor Dashboard
router.get('/doctor', async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== 'Doctor') {
    return res.redirect('/login');
  }

  try {
    const patients = await getAssignedPatients(user.uid);

    res.render('doctorDashboard', {
      user,
      patients,
      page: 'dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading doctor dashboard.');
  }
});
// Patient Dashboard
router.get('/patient', async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== 'Patient') {
    return res.redirect('/login');
  }

  try {
    // Replace with your actual logic to fetch appointments
    const appointments = []; // e.g., await getAppointmentsForPatient(user.uid);

    res.render('patientDashboard', {
      user,
      appointments,
      page: 'dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading patient dashboard.');
  }
});

module.exports = router;
