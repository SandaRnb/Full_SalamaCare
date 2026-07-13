import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar, Badge, Card, SectionTitle, Divider } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

export default function DossierScreen() {
  const navigate = useNavigate();
  const { patientActif, historique } = useApp();

  if (!patientActif) {
    return (
      <div style={styles.safe}>
        <p style={{ padding: 20, color: COLORS.textHint }}>Aucun patient sélectionné. Retournez à l'accueil.</p>
      </div>
    );
  }

  const consultationsPassees = historique[patientActif.id] || [];
  const imcColor = patientActif.imc < 18.5 ? COLORS.info
    : patientActif.imc < 25 ? COLORS.success
    : patientActif.imc < 30 ? COLORS.warning
    : COLORS.danger;

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <button className="touchable" onClick={() => navigate(-1)} style={styles.backBtn}>
          <span style={styles.backText}>← Retour</span>
        </button>
        <div style={styles.headerContent}>
          <Avatar initiales={patientActif.initiales} size={54} bgColor={COLORS.primaryMid} />
          <div style={styles.headerInfo}>
            <div style={styles.patientName}>{patientActif.nom}</div>
            <div style={styles.patientMeta}>
              {patientActif.sexe === 'F' ? 'Femme' : 'Homme'} · {patientActif.age} ans · N° {patientActif.id}
            </div>
            <div style={styles.badgesRow}>
              {patientActif.antecedents.slice(0, 2).map((ant, i) => (
                <Badge key={i} label={ant.split(' ')[0]} type={i === 0 ? 'warning' : 'info'} />
              ))}
              {patientActif.allergies.length > 0 && (
                <Badge label={`⚠ ${patientActif.allergies[0]}`} type="danger" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.scroll}>
        <div style={styles.metricsRow}>
          {[
            { v: `${patientActif.age} ans`, l: 'Âge' },
            { v: `${patientActif.taille} cm`, l: 'Taille' },
            { v: `${patientActif.poids} kg`, l: 'Poids' },
            { v: patientActif.imc.toFixed(1), l: 'IMC', color: imcColor },
          ].map((m, i) => (
            <div key={i} style={styles.metricBox}>
              <div style={{ ...styles.metricValue, ...(m.color ? { color: m.color } : {}) }}>{m.v}</div>
              <div style={styles.metricLabel}>{m.l}</div>
            </div>
          ))}
        </div>

        <Card style={styles.card}>
          <SectionTitle title="Informations personnelles" />
          {[
            { label: 'Date de naissance', value: patientActif.dateNaissance },
            { label: 'Téléphone', value: patientActif.tel },
            { label: 'Adresse', value: patientActif.adresse },
            { label: 'Groupe sanguin', value: patientActif.groupeSanguin },
          ].map(({ label, value }, i) => (
            <div key={i}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>{label}</span>
                <span style={styles.infoValue}>{value}</span>
              </div>
              <Divider />
            </div>
          ))}
        </Card>

        <Card style={styles.card}>
          <SectionTitle title="Antécédents médicaux" />
          <div style={styles.badgesRow}>
            {patientActif.antecedents.map((ant, i) => (
              <Badge key={i} label={ant} type={i % 2 === 0 ? 'warning' : 'info'} />
            ))}
          </div>
          <Divider />
          <span style={styles.infoLabel}>Allergies connues</span>
          <div style={{ ...styles.badgesRow, marginTop: 6 }}>
            {patientActif.allergies.length > 0
              ? patientActif.allergies.map((all, i) => <Badge key={i} label={`⚠ ${all}`} type="danger" />)
              : <span style={styles.infoValue}>Aucune allergie connue</span>}
          </div>
          <Divider />
          <span style={styles.infoLabel}>Antécédents familiaux</span>
          <p style={{ ...styles.infoValue, marginTop: 4, textAlign: 'left' }}>{patientActif.antecedentsFamiliaux}</p>
        </Card>

        <Card style={styles.card}>
          <SectionTitle title="Historique des consultations" />
          {consultationsPassees.length === 0 && (
            <p style={styles.emptyText}>Aucune consultation antérieure enregistrée.</p>
          )}
          {consultationsPassees.map((consult, i) => (
            <div key={i}>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: i === 0 ? COLORS.primary : COLORS.gray200 }} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>{consult.date}</div>
                  <div style={styles.timelineText}>{consult.motif}</div>
                  <div style={styles.timelineSub}>{consult.note} · {consult.medecin}</div>
                </div>
              </div>
              {i < consultationsPassees.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <button className="touchable" style={styles.ctaButton} onClick={() => navigate('/consultation')}>
          <span style={styles.ctaText}>🩺  Démarrer la consultation</span>
        </button>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
}

const styles = {
  safe: { height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: COLORS.primary, overflow: 'hidden' },
  header: { backgroundColor: COLORS.primary, padding: `${SPACING.md}px ${SPACING.xl}px ${SPACING.xl}px` },
  backBtn: { marginBottom: SPACING.md },
  backText: { color: COLORS.primaryAccent, fontSize: FONTS.base },
  headerContent: { display: 'flex', alignItems: 'flex-start', gap: SPACING.md },
  headerInfo: { flex: 1 },
  patientName: { color: COLORS.white, fontSize: FONTS.lg, fontWeight: 600, marginBottom: 3 },
  patientMeta: { color: COLORS.primaryAccent, fontSize: FONTS.sm },
  badgesRow: { display: 'flex', flexWrap: 'wrap', marginTop: 6 },
  scroll: { flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgPage, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: `${SPACING.lg}px ${SPACING.lg}px 0` },
  metricsRow: { display: 'flex', marginBottom: SPACING.md, gap: 8 },
  metricBox: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, border: `0.5px solid ${COLORS.border}`, padding: SPACING.sm, textAlign: 'center' },
  metricValue: { fontSize: FONTS.md, fontWeight: 600, color: COLORS.primary },
  metricLabel: { fontSize: FONTS.xs, color: COLORS.textHint, marginTop: 2 },
  card: { marginBottom: SPACING.md },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: `${SPACING.sm}px 0` },
  infoLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: 500 },
  infoValue: { fontSize: FONTS.sm, color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  timelineItem: { display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0` },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  timelineContent: { flex: 1 },
  timelineDate: { fontSize: FONTS.xs, color: COLORS.textHint },
  timelineText: { fontSize: FONTS.base, color: COLORS.textPrimary, fontWeight: 500 },
  timelineSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  emptyText: { fontSize: FONTS.sm, color: COLORS.textHint, textAlign: 'center', padding: `${SPACING.lg}px 0` },
  ctaButton: { width: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, textAlign: 'center', marginBottom: SPACING.md },
  ctaText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: 600 },
};