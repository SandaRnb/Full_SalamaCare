import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SPECIALISTES } from '../data/mockData';
import { Card, SectionTitle, InputField, PrimaryButton, Switch } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

const URGENCES = [
  { key: 'programme', label: 'Programmé', color: COLORS.success, bg: COLORS.successLight },
  { key: 'urgent', label: 'Urgent (< 72h)', color: COLORS.warning, bg: COLORS.warningLight },
  { key: 'tres-urgent', label: 'Très urgent (< 24h)', color: COLORS.danger, bg: COLORS.dangerLight },
];

const SPEC_EMOJI = { S01: '❤️', S02: '🧠', S03: '⚡', S04: '🫁', S05: '👁️', S06: '💧' };

export default function OrientationScreen() {
  const navigate = useNavigate();
  const { orientation, setOrientation, patientActif } = useApp();

  const update = (key, val) => setOrientation(prev => ({ ...prev, [key]: val }));
  const selectSpecialite = (spec) => update('specialite', orientation.specialite?.id === spec.id ? null : spec);
  const selectUrgence = (key) => update('urgence', orientation.urgence === key ? null : key);
  const toggleJoindre = (key) => setOrientation(prev => ({ ...prev, joindre: { ...prev.joindre, [key]: !prev.joindre[key] } }));

  const genererCourrier = () => {
    if (!orientation.specialite) {
      window.alert('Spécialité requise : veuillez sélectionner une spécialité médicale.');
      return;
    }
    if (!orientation.motif.trim()) {
      window.alert("Motif requis : veuillez saisir le motif de l'orientation.");
      return;
    }
    if (window.confirm(`✓ Courrier généré : lettre d'orientation vers ${orientation.specialite.specialite} créée pour ${patientActif?.nom || 'le patient'}.\n\nTerminer ?`)) {
      navigate('/');
    }
  };

  const urgenceCourante = URGENCES.find(u => u.key === orientation.urgence);

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <button className="touchable" onClick={() => navigate(-1)} style={styles.backBtn}>
          <span style={styles.backText}>← Retour</span>
        </button>
        <div style={styles.headerTitle}>Orientation spécialiste</div>
        <div style={styles.headerSub}>Lettre de référence & courrier médical</div>
      </div>

      <div style={styles.scroll}>
        <Card>
          <SectionTitle title="Choisir la spécialité" />
          <div style={styles.specGrid}>
            {SPECIALISTES.map((spec) => {
              const isSelected = orientation.specialite?.id === spec.id;
              return (
                <button
                  key={spec.id}
                  className="touchable"
                  style={{ ...styles.specCard, ...(isSelected ? styles.specCardSelected : {}) }}
                  onClick={() => selectSpecialite(spec)}
                >
                  <span style={styles.specEmoji}>{SPEC_EMOJI[spec.id]}</span>
                  <span style={{ ...styles.specName, ...(isSelected ? styles.specNameSelected : {}) }}>{spec.specialite}</span>
                  <span style={styles.specDesc}>{spec.description}</span>
                </button>
              );
            })}
          </div>
          {orientation.specialite && (
            <div style={styles.selectedBanner}>
              <span style={styles.selectedBannerText}>✓ {orientation.specialite.specialite} sélectionné</span>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Degré d'urgence" />
          <div style={styles.urgenceRow}>
            {URGENCES.map((u) => {
              const isActive = orientation.urgence === u.key;
              return (
                <button
                  key={u.key}
                  className="touchable"
                  style={{ ...styles.urgenceBtn, ...(isActive ? { backgroundColor: u.bg, borderColor: u.color, borderWidth: 1.5 } : {}) }}
                  onClick={() => selectUrgence(u.key)}
                >
                  <span style={{ ...styles.urgenceBtnText, ...(isActive ? { color: u.color, fontWeight: 600 } : {}) }}>{u.label}</span>
                </button>
              );
            })}
          </div>
          {urgenceCourante && (
            <div style={{ ...styles.urgenceBanner, backgroundColor: urgenceCourante.bg, borderColor: urgenceCourante.color }}>
              <span style={{ ...styles.urgenceBannerText, color: urgenceCourante.color }}>
                {urgenceCourante.key === 'tres-urgent'
                  ? '🚨 Consultation dans les 24 heures — contacter le service directement'
                  : urgenceCourante.key === 'urgent'
                  ? '⚠️ Rendez-vous à obtenir dans les 72 heures'
                  : '📅 Rendez-vous à programmer sans urgence'}
              </span>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Courrier au spécialiste" />
          <InputField label="Spécialiste destinataire" value={orientation.destinataire} onChangeText={(v) => update('destinataire', v)} placeholder="Ex : Dr. Randria Jean — Cardiologue CHU Antananarivo" />
          <InputField label="Motif de l'orientation *" value={orientation.motif} onChangeText={(v) => update('motif', v)} placeholder="Décrire le motif clinique, éléments importants, questions posées au spécialiste..." multiline numberOfLines={5} />
        </Card>

        <Card>
          <SectionTitle title="Documents joints au courrier" />
          {[
            { key: 'bilan', label: 'Résultats bilan biologique' },
            { key: 'ecg', label: 'ECG' },
            { key: 'imagerie', label: 'Imagerie (radio, écho, scanner)' },
            { key: 'compteRendu', label: 'Compte-rendu de consultation' },
          ].map(({ key, label }) => (
            <div key={key} style={styles.switchRow}>
              <span style={styles.switchLabel}>{label}</span>
              <Switch value={orientation.joindre[key]} onValueChange={() => toggleJoindre(key)} />
            </div>
          ))}
        </Card>

        {(orientation.specialite || orientation.urgence) && (
          <Card style={styles.recapCard}>
            <SectionTitle title="Récapitulatif" />
            {orientation.specialite && <p style={styles.recapLine}>🏥 {orientation.specialite.specialite}</p>}
            {urgenceCourante && <p style={{ ...styles.recapLine, color: urgenceCourante.color }}>🕐 {urgenceCourante.label}</p>}
            {patientActif && <p style={styles.recapLine}>👤 {patientActif.nom} · {patientActif.age} ans</p>}
          </Card>
        )}

        <PrimaryButton label="Générer le courrier d'orientation" onClick={genererCourrier} />
        <PrimaryButton label="Enregistrer sans générer" onClick={() => window.alert('Enregistré : orientation sauvegardée.')} variant="secondary" />

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
  headerSub: { color: COLORS.primaryAccent, fontSize: FONTS.sm, marginTop: 3 },
  scroll: { flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgPage, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: `${SPACING.lg}px ${SPACING.lg}px 0` },
  specGrid: { display: 'flex', flexWrap: 'wrap', gap: SPACING.sm },
  specCard: { width: '47%', backgroundColor: COLORS.bgPage, borderRadius: RADIUS.md, border: `0.5px solid ${COLORS.border}`, padding: SPACING.md, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  specCardSelected: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 1.5 },
  specEmoji: { fontSize: 22, marginBottom: 6 },
  specName: { fontSize: FONTS.sm, fontWeight: 600, color: COLORS.textPrimary, textAlign: 'center' },
  specNameSelected: { color: COLORS.primary },
  specDesc: { fontSize: FONTS.xs, color: COLORS.textHint, marginTop: 3, textAlign: 'center' },
  selectedBanner: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.md, textAlign: 'center' },
  selectedBannerText: { fontSize: FONTS.sm, color: COLORS.primary, fontWeight: 600 },
  urgenceRow: { display: 'flex', gap: SPACING.sm, marginBottom: SPACING.md },
  urgenceBtn: { flex: 1, padding: `${SPACING.sm}px`, borderRadius: RADIUS.md, border: `0.5px solid ${COLORS.border}`, backgroundColor: COLORS.bgPage, textAlign: 'center' },
  urgenceBtnText: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  urgenceBanner: { borderRadius: RADIUS.md, border: '0.5px solid', padding: SPACING.md },
  urgenceBannerText: { fontSize: FONTS.sm, fontWeight: 500 },
  switchRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${SPACING.sm}px 0`, borderBottom: `0.5px solid ${COLORS.border}` },
  switchLabel: { fontSize: FONTS.base, color: COLORS.textPrimary, flex: 1 },
  recapCard: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  recapLine: { fontSize: FONTS.base, color: COLORS.primary, marginBottom: 5, fontWeight: 500 },
};