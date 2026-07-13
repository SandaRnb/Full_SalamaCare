import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, InputField, SelectField, PrimaryButton, Divider } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

const VOIES = ['Per os (orale)', 'Injectable IM', 'Injectable IV', 'Sous-cutané', 'Topique', 'Inhalé', 'Sublingual'];

export default function PrescriptionScreen() {
  const navigate = useNavigate();
  const { prescription, ajouterMedicament, supprimerMedicament, patientActif } = useApp();
  const [form, setForm] = useState({ medicament: '', posologie: '', duree: '', voie: '', note: '' });
  const [conseils, setConseils] = useState('');

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleAjouter = () => {
    if (!form.medicament.trim()) {
      window.alert('Champ requis : veuillez saisir le nom du médicament.');
      return;
    }
    ajouterMedicament(form);
    setForm({ medicament: '', posologie: '', duree: '', voie: '', note: '' });
  };

  const handleSupprimer = (id, nom) => {
    if (window.confirm(`Retirer "${nom}" de l'ordonnance ?`)) {
      supprimerMedicament(id);
    }
  };

  const genererOrdonnance = () => {
    if (prescription.length === 0) {
      window.alert('Ordonnance vide : ajoutez au moins un médicament avant de générer.');
      return;
    }
    if (window.confirm(`✓ Ordonnance générée : ${prescription.length} médicament(s) pour ${patientActif?.nom || 'le patient'}.\n\nContinuer vers orientation ?`)) {
      navigate('/orientation');
    }
  };

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <button className="touchable" onClick={() => navigate(-1)} style={styles.backBtn}>
          <span style={styles.backText}>← Retour</span>
        </button>
        <div style={styles.headerTitle}>Prescription</div>
        <div style={styles.countBadge}>
          <span style={styles.countText}>{prescription.length} médicament{prescription.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style={styles.scroll}>
        <Card>
          <SectionTitle title="Ajouter un médicament" />
          <InputField label="Médicament / DCI *" value={form.medicament} onChangeText={(v) => updateForm('medicament', v)} placeholder="Ex : Metformine 500mg, Amlodipine 5mg..." />
          <InputField label="Posologie" value={form.posologie} onChangeText={(v) => updateForm('posologie', v)} placeholder="Ex : 1 comprimé matin et soir" />
          <div style={styles.grid2}>
            <div style={styles.gridItem}>
              <InputField label="Durée du traitement" value={form.duree} onChangeText={(v) => updateForm('duree', v)} placeholder="Ex : 30 jours" />
            </div>
            <div style={styles.gridItem}>
              <SelectField label="Voie d'administration" value={form.voie} options={VOIES} onSelect={(v) => updateForm('voie', v)} />
            </div>
          </div>
          <InputField label="Instructions particulières" value={form.note} onChangeText={(v) => updateForm('note', v)} placeholder="Ex : à prendre au cours du repas, surveiller glycémie..." />
          <PrimaryButton label="+ Ajouter à l'ordonnance" onClick={handleAjouter} variant="secondary" />
        </Card>

        <Card>
          <SectionTitle title={`Ordonnance en cours (${prescription.length})`} />
          {prescription.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💊</div>
              <p style={styles.emptyText}>Aucun médicament prescrit pour l'instant.</p>
            </div>
          ) : (
            prescription.map((med, i) => (
              <div key={med.id}>
                <div style={styles.medItem}>
                  <div style={styles.medIndex}><span style={styles.medIndexText}>{i + 1}</span></div>
                  <div style={styles.medInfo}>
                    <div style={styles.medName}>{med.medicament}</div>
                    <div style={styles.medDetail}>{[med.posologie, med.voie, med.duree].filter(Boolean).join(' · ')}</div>
                    {med.note ? <div style={styles.medNote}>⚠ {med.note}</div> : null}
                  </div>
                  <button className="touchable" style={styles.deleteBtn} onClick={() => handleSupprimer(med.id, med.medicament)} aria-label={`Supprimer ${med.medicament}`}>
                    <span style={styles.deleteIcon}>✕</span>
                  </button>
                </div>
                {i < prescription.length - 1 && <Divider />}
              </div>
            ))
          )}
        </Card>

        <Card>
          <SectionTitle title="Conseils & recommandations" />
          <InputField label="Conseils hygiéno-diététiques" value={conseils} onChangeText={setConseils} placeholder="Régime alimentaire, activité physique, arrêt tabac, suivi à prévoir..." multiline numberOfLines={4} />
        </Card>

        <PrimaryButton label="Générer l'ordonnance" onClick={genererOrdonnance} variant="primary" />
        <PrimaryButton label="Continuer vers orientation →" onClick={() => navigate('/orientation')} variant="secondary" />

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
}

const styles = {
  safe: { height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.primary, overflow: 'hidden' },
  header: { backgroundColor: COLORS.primary, padding: `${SPACING.md}px ${SPACING.xl}px ${SPACING.lg}px` },
  backBtn: { marginBottom: SPACING.sm },
  backText: { color: COLORS.primaryAccent, fontSize: FONTS.base },
  headerTitle: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: 600 },
  countBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', padding: `3px ${SPACING.sm}px`, borderRadius: RADIUS.full, marginTop: 6 },
  countText: { color: COLORS.white, fontSize: FONTS.xs, fontWeight: 500 },
  scroll: { flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgPage, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: `${SPACING.lg}px ${SPACING.lg}px 0` },
  grid2: { display: 'flex', gap: SPACING.sm },
  gridItem: { flex: 1 },
  medItem: { display: 'flex', alignItems: 'flex-start', gap: SPACING.md, padding: `${SPACING.sm}px 0` },
  medIndex: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  medIndexText: { fontSize: FONTS.xs, fontWeight: 700, color: COLORS.primary },
  medInfo: { flex: 1 },
  medName: { fontSize: FONTS.base, fontWeight: 600, color: COLORS.textPrimary },
  medDetail: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  medNote: { fontSize: FONTS.xs, color: COLORS.warning, marginTop: 3 },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.dangerLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deleteIcon: { color: COLORS.danger, fontSize: 12, fontWeight: 700 },
  emptyState: { textAlign: 'center', padding: `${SPACING.xl}px 0` },
  emptyIcon: { fontSize: 32, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONTS.sm, color: COLORS.textHint },
};