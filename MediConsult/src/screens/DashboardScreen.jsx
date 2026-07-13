import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PATIENTS, STATS_JOUR } from '../data/mockData';
import { Avatar, Badge, StatBox } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

const QUICK_ROUTES = {
  Dossier: '/dossier',
  Consultation: '/consultation',
  Bilan: '/bilan',
  Prescription: '/prescription',
  Orientation: '/orientation',
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { setPatientActif } = useApp();

  const ouvrirDossier = (patient) => {
    setPatientActif(patient);
    navigate('/dossier');
  };

  const statutColor = (statut) => ({
    'en-attente': COLORS.warning,
    'en-cours': COLORS.primaryMid,
    'termine': COLORS.textHint,
  }[statut] || COLORS.textHint);

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.logoText}>✚ SALAMACARE</h1>
          <Avatar initiales="RA" size={36} bgColor={COLORS.primaryMid} />
        </div>
        <div style={styles.greeting}>Bonjour, Dr. Rakoto</div>
        <div style={styles.headerSub}>{STATS_JOUR.date} · {STATS_JOUR.consultationsAujourdhui} consultations aujourd'hui</div>
      </div>

      <div style={styles.scroll} className="no-scrollbar">
        <div style={styles.statsRow}>
          <StatBox value={STATS_JOUR.consultationsAujourdhui} label="Aujourd'hui" color={COLORS.primary} />
          <StatBox value={STATS_JOUR.semaine} label="Cette semaine" color={COLORS.primaryMid} />
          <StatBox value={STATS_JOUR.bilansEnAttente} label="Bilans" color={COLORS.warning} />
        </div>

        {STATS_JOUR.orientationsUrgentes > 0 && (
          <div style={styles.alertBanner}>
            <span style={styles.alertText}>⚠ {STATS_JOUR.orientationsUrgentes} orientation urgente en attente</span>
          </div>
        )}

        <div style={styles.sectionLabel}>PATIENTS DU JOUR</div>

        {PATIENTS.map((patient) => (
          <button key={patient.id} className="touchable" style={styles.patientCard} onClick={() => ouvrirDossier(patient)}>
            <Avatar initiales={patient.initiales} size={46} bgColor={COLORS.primaryLight} />
            <div style={styles.patientInfo}>
              <div style={styles.patientName}>{patient.nom}</div>
              <div style={styles.patientMeta}>{patient.age} ans · {patient.rdvHeure} · {patient.rdvMotif}</div>
              <div style={styles.tagsRow}>
                {patient.antecedents.slice(0, 2).map((ant, i) => (
                  <Badge key={i} label={ant.split(' ')[0]} type={i === 0 ? 'warning' : 'info'} />
                ))}
              </div>
            </div>
            <div style={{ ...styles.statutDot, backgroundColor: statutColor(patient.statut) }} />
          </button>
        ))}

        <div style={{ ...styles.sectionLabel, marginTop: SPACING.lg }}>ACCÈS RAPIDE</div>
        <div style={styles.quickGrid}>
          {[
            { label: 'Dossier', icon: '📁', screen: 'Dossier', color: COLORS.primaryLight },
            { label: 'Consultation', icon: '🩺', screen: 'Consultation', color: COLORS.infoLight },
            { label: 'Bilan', icon: '🧪', screen: 'Bilan', color: '#EAF3DE' },
            { label: 'Prescription', icon: '💊', screen: 'Prescription', color: COLORS.warningLight },
            { label: 'Orientation', icon: '↗', screen: 'Orientation', color: COLORS.dangerLight },
          ].map((item) => (
            <button
              key={item.label}
              className="touchable"
              style={{ ...styles.quickItem, backgroundColor: item.color }}
              onClick={() => navigate(QUICK_ROUTES[item.screen])}
            >
              <span style={styles.quickIcon}>{item.icon}</span>
              <span style={styles.quickLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
}

const styles = {
  safe: { height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.primary, overflow: 'hidden' },
  header: { backgroundColor: COLORS.primary, padding: `${SPACING.lg}px ${SPACING.xl}px ${SPACING.xl}px` },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  logoText: { color: COLORS.primaryAccent, fontWeight: 600, letterSpacing: 0.5 },
  greeting: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: 600, marginBottom: 4 },
  headerSub: { color: COLORS.primaryAccent, fontSize: FONTS.sm },
  scroll: { flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgPage, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, paddingTop: SPACING.lg },
  statsRow: { display: 'flex', padding: `0 ${SPACING.lg}px`, gap: 8, marginBottom: SPACING.md },
  alertBanner: { margin: `0 ${SPACING.lg}px ${SPACING.md}px`, backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.md, padding: SPACING.md, border: `0.5px solid ${COLORS.danger}` },
  alertText: { color: COLORS.danger, fontSize: FONTS.sm, fontWeight: 500 },
  sectionLabel: { fontSize: FONTS.xs, fontWeight: 600, color: COLORS.primaryMid, letterSpacing: 0.8, padding: `0 ${SPACING.xl}px`, marginBottom: SPACING.sm },
  patientCard: { display: 'flex', alignItems: 'flex-start', backgroundColor: COLORS.bgCard, margin: `0 ${SPACING.lg}px ${SPACING.sm}px`, borderRadius: RADIUS.lg, padding: SPACING.md, border: `0.5px solid ${COLORS.border}`, gap: SPACING.md },
  patientInfo: { flex: 1 },
  patientName: { fontSize: FONTS.md, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 3 },
  patientMeta: { fontSize: FONTS.sm, color: COLORS.textHint },
  tagsRow: { display: 'flex', flexWrap: 'wrap', marginTop: 4 },
  statutDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  quickGrid: { display: 'flex', flexWrap: 'wrap', padding: `0 ${SPACING.lg}px`, gap: SPACING.sm },
  quickItem: { width: '30%', borderRadius: RADIUS.lg, padding: SPACING.md, display: 'flex', flexDirection: 'column', alignItems: 'center', border: `0.5px solid ${COLORS.border}` },
  quickIcon: { fontSize: 22, marginBottom: 6 },
  quickLabel: { fontSize: FONTS.xs, fontWeight: 600, color: COLORS.textPrimary, textAlign: 'center' },
};