// helpers/patientHelper.js
const { db } = require('../firebase/firebaseConfig');

async function getAssignedPatients(doctorId) {
  const snapshot = await db.collection('patients')
    .where('doctorId', '==', doctorId)
    .get();

  const patients = [];
  snapshot.forEach(doc => patients.push(doc.data()));
  return patients;
}

module.exports = { getAssignedPatients };
