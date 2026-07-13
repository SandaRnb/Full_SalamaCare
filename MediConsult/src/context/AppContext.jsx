import React, { createContext, useContext, useState } from 'react';
import { PATIENTS, HISTORIQUE } from '../data/mockData';

const AppContext = createContext({});
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [patientActif, setPatientActif] = useState(PATIENTS[0]);
  const [patients, setPatients] = useState(PATIENTS);

  const [consultation, setConsultation] = useState({
    motif: '', anamnese: '', ta: '', fc: '', temperature: '',
    spo2: '', fr: '', glycemie: '', examenClinique: '', diagnostic: '',
  });

  const [bilan, setBilan] = useState({
    glycemieAJeun: '', hba1c: '', cholesterolTotal: '', ldl: '', hdl: '',
    triglycerides: '', creatinine: '', uree: '', nfs: '', ecg: '',
    imagerie: '', autresExamens: '', interpretation: '',
  });

  const [prescription, setPrescription] = useState([
    { id: '1', medicament: 'Amlodipine 5 mg', posologie: '1 cp/j le matin', duree: '30 jours', voie: 'Per os', note: '' },
    { id: '2', medicament: 'Metformine 500 mg', posologie: '1 cp matin et soir', duree: '30 jours', voie: 'Per os', note: 'Au cours du repas' },
  ]);

  const [orientation, setOrientation] = useState({
    specialite: null,
    urgence: null,
    destinataire: '',
    motif: '',
    joindre: { bilan: false, ecg: false, imagerie: false, compteRendu: false },
  });

  const ajouterMedicament = (med) => {
    const newId = Date.now().toString();
    setPrescription(prev => [...prev, { id: newId, ...med }]);
  };

  const supprimerMedicament = (id) => {
    setPrescription(prev => prev.filter(m => m.id !== id));
  };

  const resetConsultation = () => {
    setConsultation({ motif: '', anamnese: '', ta: '', fc: '', temperature: '', spo2: '', fr: '', glycemie: '', examenClinique: '', diagnostic: '' });
    setBilan({ glycemieAJeun: '', hba1c: '', cholesterolTotal: '', ldl: '', hdl: '', triglycerides: '', creatinine: '', uree: '', nfs: '', ecg: '', imagerie: '', autresExamens: '', interpretation: '' });
    setPrescription([]);
    setOrientation({ specialite: null, urgence: null, destinataire: '', motif: '', joindre: { bilan: false, ecg: false, imagerie: false, compteRendu: false } });
  };

  const value = {
    patientActif, setPatientActif,
    patients, setPatients,
    consultation, setConsultation,
    bilan, setBilan,
    prescription, ajouterMedicament, supprimerMedicament,
    orientation, setOrientation,
    resetConsultation,
    historique: HISTORIQUE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};