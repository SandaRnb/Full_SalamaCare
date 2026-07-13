import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, InputField, PrimaryButton, Avatar } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

export default function ConsultationScreen() {
  const navigate = useNavigate();
  const { patientActif, consultation, setConsultation } = useApp();

  const update = (key, val) => setConsultation(prev => ({ ...prev, [key]: val }));

  const enregistrer = () => {
    if (!consultation.motif.trim()) {
      window.alert('Champ requis : veuillez saisir le motif de consultation.');
      return;
    }
    if (window.confirm('Consultation enregistrée avec succès.\n\nContinuer vers le bilan ?')) {
      navigate('/bilan');
    }
  };

  const taStatus = () => {
    if (!consultation.ta) return null;
    const parts = consultation.ta.split('/');
    if (parts.length !== 2) return null;
    const sys = parseInt(parts[0]);
    if (sys >= 180) return COLORS.danger;
    if (sys >= 140) return COLORS.warning;
    if (sys >= 120) return COLORS.info;
    return COLORS.success;
  };

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <button className="touchable" onClick={() => navigate(-1)} style={styles.backBtn}>
          <span style={styles.backText}>← Retour</span>
        </button>
        <div style={styles.headerTitle}>Consultation</div>
        {patientActif && (
          <div style={styles.patientChip}>
            <Avatar initiales={patientActif.initiales} size={24} bgColor={COLORS.primaryMid} />
            <span style={styles.patientChipText}>{patientActif.nom.split(' ')[0]} {patientActif.nom.split(' ')[1]}</span>
          </div>
        )}
      </div>

      <div style={styles.scroll}>
        <Card>
          <SectionTitle title="Motif de consultation" />
          <InputField label="Motif principal *" value={consultation.motif} onChangeText={(v) => update('motif', v)} placeholder="Ex : céphalées, fatigue, contrôle tension..." />
        </Card>

        <Card>
          <SectionTitle title="Constantes vitales" />
          <div style={styles.taRow}>
            <div style={styles.taInput}>
              <InputField label="Tension artérielle (mmHg)" value={consultation.ta} onChangeText={(v) => update('ta', v)} placeholder="Ex : 130/85" />
            </div>
            {taStatus() && <div style={{ ...styles.taIndicator, backgroundColor: taStatus() }} />}
          </div>

          <InputField label="Fréquence cardiaque (bpm)" value={consultation.fc} onChangeText={(v) => update('fc', v)} placeholder="Ex : 78" keyboardType="numeric" />
        </Card>

        <Card>
          <SectionTitle title="Examen clinique & diagnostic" />
          <InputField label="Examen clinique" value={consultation.examenClinique} onChangeText={(v) => update('examenClinique', v)} placeholder="Observations à l'examen physique (auscultation, palpation...)..." multiline numberOfLines={3} />
          <InputField label="Diagnostic retenu" value={consultation.diagnostic} onChangeText={(v) => update('diagnostic', v)} placeholder="Ex : HTA mal contrôlée, décompensation diabétique..." multiline numberOfLines={2} />
        </Card>

        <div style={styles.buttonRow}>
          <PrimaryButton label="Enregistrer la consultation" onClick={enregistrer} variant="primary" style={{ flex: 1 }} />
        </div>
        <PrimaryButton label="Continuer vers le bilan →" onClick={() => navigate('/bilan')} variant="secondary" style={styles.secondaryBtn} />

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
  headerTitle: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: 600, marginBottom: SPACING.sm },
  patientChip: { display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', padding: `5px ${SPACING.sm}px`, borderRadius: RADIUS.full, gap: 7 },
  patientChipText: { color: COLORS.white, fontSize: FONTS.sm, fontWeight: 500 },
  scroll: { flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgPage, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: `${SPACING.lg}px ${SPACING.lg}px 0` },
  taRow: { display: 'flex', alignItems: 'center', gap: SPACING.sm },
  taInput: { flex: 1 },
  taIndicator: { width: 10, height: 10, borderRadius: 5, marginTop: 18, flexShrink: 0 },
  buttonRow: { display: 'flex', gap: SPACING.sm, marginBottom: SPACING.sm },
  secondaryBtn: { marginBottom: SPACING.sm },
};