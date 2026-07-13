import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, InputField, PrimaryButton } from '../components/UIComponents';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

export default function BilanScreen() {
  const navigate = useNavigate();
  const { bilan, setBilan } = useApp();

  const update = (key, val) => setBilan(prev => ({ ...prev, [key]: val }));

  const enregistrer = () => {
    if (window.confirm('Bilan enregistré : les résultats ont été sauvegardés.\n\nAller à la prescription ?')) {
      navigate('/prescription');
    }
  };

  const valColor = (val, min, max) => {
    const n = parseFloat(val);
    if (isNaN(n)) return COLORS.textPrimary;
    if (n < min || n > max) return COLORS.danger;
    return COLORS.success;
  };

  return (
    <div style={styles.safe}>
      <div style={styles.header}>
        <button className="touchable" onClick={() => navigate(-1)} style={styles.backBtn}>
          <span style={styles.backText}>← Retour</span>
        </button>
        <div style={styles.headerTitle}>Saisie du bilan</div>
        <div style={styles.headerSub}>Résultats biologiques</div>
      </div>

      <div style={styles.scroll}>
        <Card>
          <SectionTitle title="Bilan biologique" />
          <div style={styles.grid2}>
            <div style={styles.gridItem}>
              <InputField label="Glycémie à jeun (g/L)" value={bilan.glycemieAJeun} onChangeText={(v) => update('glycemieAJeun', v)} placeholder="Norme : 0.7–1.1" keyboardType="decimal-pad" />
              {bilan.glycemieAJeun !== '' && (
                <p style={{ ...styles.normeHint, color: valColor(bilan.glycemieAJeun, 0.7, 1.1) }}>
                  {parseFloat(bilan.glycemieAJeun) > 1.1 ? '↑ Élevée' : '✓ Normale'}
                </p>
              )}
            </div>
            <div style={styles.gridItem}>
              <InputField label="HbA1c (%)" value={bilan.hba1c} onChangeText={(v) => update('hba1c', v)} placeholder="Norme : < 5.7%" keyboardType="decimal-pad" />
              {bilan.hba1c !== '' && (
                <p style={{ ...styles.normeHint, color: valColor(bilan.hba1c, 0, 5.7) }}>
                  {parseFloat(bilan.hba1c) > 5.7 ? '↑ Élevée' : '✓ Normale'}
                </p>
              )}
            </div>
          </div>

          <InputField label="NFS — résultats complets" value={bilan.nfs} onChangeText={(v) => update('nfs', v)} placeholder="GB, GR, Hb, Plaquettes, formule leucocytaire..." multiline numberOfLines={2} />
        </Card>

        <Card>
          <SectionTitle title="Interprétation clinique" />
          <InputField label="Synthèse et commentaires" value={bilan.interpretation} onChangeText={(v) => update('interpretation', v)} placeholder="Interprétation des résultats, corrélation clinique, conduite à tenir..." multiline numberOfLines={5} />
        </Card>

        <PrimaryButton label="Enregistrer le bilan" onClick={enregistrer} />
        <PrimaryButton label="Continuer vers la prescription →" onClick={() => navigate('/prescription')} variant="secondary" />

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
  grid2: { display: 'flex', flexWrap: 'wrap', gap: SPACING.sm },
  gridItem: { width: '47%' },
  normeHint: { fontSize: FONTS.xs, fontWeight: 600, marginTop: -8, marginBottom: 6 },
};