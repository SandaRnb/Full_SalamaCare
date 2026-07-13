import React, { useState } from 'react';
import COLORS from '../styles/colors';
import { FONTS, SPACING, RADIUS } from '../styles/typography';

// ---------- BADGE ----------
export const Badge = ({ label, type = 'primary' }) => {
  const colorMap = {
    success: { bg: COLORS.successLight, text: COLORS.success },
    warning: { bg: COLORS.warningLight, text: COLORS.warning },
    danger:  { bg: COLORS.dangerLight,  text: COLORS.danger  },
    info:    { bg: COLORS.infoLight,    text: COLORS.info    },
    primary: { bg: COLORS.primaryLight, text: COLORS.primary },
  };
  const c = colorMap[type] || colorMap.primary;
  return (
    <span style={{ ...styles.badge, backgroundColor: c.bg }}>
      <span style={{ ...styles.badgeText, color: c.text }}>{label}</span>
    </span>
  );
};

// ---------- AVATAR ----------
export const Avatar = ({ initiales, size = 44, bgColor = COLORS.primaryLight }) => (
  <div style={{ ...styles.avatar, width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }}>
    <span style={{ ...styles.avatarText, fontSize: size * 0.28, color: COLORS.primary }}>{initiales}</span>
  </div>
);

// ---------- CARD ----------
export const Card = ({ children, style }) => (
  <div style={{ ...styles.card, ...style }}>{children}</div>
);

// ---------- SECTION TITLE ----------
export const SectionTitle = ({ title }) => (
  <div style={styles.sectionTitle}>{title.toUpperCase()}</div>
);

// ---------- INPUT FIELD ----------
export const InputField = ({
  label, value, onChangeText, placeholder = '',
  multiline = false, keyboardType = 'default', numberOfLines = 1,
}) => {
  const inputModeMap = { numeric: 'numeric', 'decimal-pad': 'decimal', default: 'text' };
  return (
    <div style={styles.inputWrapper}>
      <label style={styles.inputLabel}>{label}</label>
      {multiline ? (
        <textarea
          style={{ ...styles.input, height: numberOfLines * 24 + 16, resize: 'vertical' }}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          rows={numberOfLines}
        />
      ) : (
        <input
          style={styles.input}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          inputMode={inputModeMap[keyboardType] || 'text'}
        />
      )}
    </div>
  );
};

// ---------- SELECT FIELD ----------
export const SelectField = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.inputWrapper}>
      <label style={styles.inputLabel}>{label}</label>
      <button type="button" className="touchable" style={styles.selectTrigger} onClick={() => setOpen(!open)}>
        <span style={{ color: value ? COLORS.textPrimary : COLORS.textHint, fontSize: FONTS.base }}>
          {value || 'Choisir...'}
        </span>
        <span style={{ color: COLORS.textHint, fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={styles.dropdown}>
          {options.map((opt, i) => (
            <button
              type="button"
              key={i}
              className="touchable"
              style={{ ...styles.dropdownItem, ...(i < options.length - 1 ? styles.dropdownItemBorder : {}) }}
              onClick={() => { onSelect(opt); setOpen(false); }}
            >
              <span style={{ fontSize: FONTS.base, color: opt === value ? COLORS.primary : COLORS.textPrimary }}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- PRIMARY BUTTON ----------
export const PrimaryButton = ({ label, onClick, loading = false, variant = 'primary', style }) => {
  const variantStyles = {
    primary:   { bg: COLORS.primary,      text: COLORS.white },
    secondary: { bg: COLORS.primaryLight, text: COLORS.primary },
    danger:    { bg: COLORS.dangerLight,  text: COLORS.danger },
    success:   { bg: COLORS.successLight, text: COLORS.success },
  };
  const v = variantStyles[variant] || variantStyles.primary;
  return (
    <button
      className="touchable"
      style={{ ...styles.button, backgroundColor: v.bg, color: v.text, ...style }}
      onClick={onClick}
      disabled={loading}
    >
      {loading
        ? <span className="spinner" />
        : <span style={styles.buttonText}>{label}</span>}
    </button>
  );
};

// ---------- STAT BOX ----------
export const StatBox = ({ value, label, color = COLORS.primary }) => (
  <div style={styles.statBox}>
    <div style={{ ...styles.statValue, color }}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

// ---------- DIVIDER ----------
export const Divider = ({ style }) => <div style={{ ...styles.divider, ...style }} />;

// ---------- SWITCH (remplace React Native Switch) ----------
export const Switch = ({ value, onValueChange }) => (
  <button
    type="button"
    className="touchable"
    onClick={onValueChange}
    style={{
      width: 44, height: 26, borderRadius: 13,
      backgroundColor: value ? COLORS.primaryMid : COLORS.border,
      padding: 2, display: 'flex', alignItems: 'center',
      justifyContent: value ? 'flex-end' : 'flex-start',
      transition: 'background-color .2s',
    }}
  >
    <span style={{
      width: 22, height: 22, borderRadius: 11, display: 'block',
      backgroundColor: value ? COLORS.primary : COLORS.white,
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

// ============================================================
// STYLES
// ============================================================
const styles = {
  badge: {
    display: 'inline-block',
    padding: `3px ${SPACING.sm}px`,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    marginTop: SPACING.xs,
  },
  badgeText: { fontSize: FONTS.xs, fontWeight: 600 },

  avatar: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: 600 },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    border: `0.5px solid ${COLORS.border}`,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: FONTS.xs,
    fontWeight: 600,
    color: COLORS.primaryMid,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },

  inputWrapper: { marginBottom: SPACING.md },
  inputLabel: { display: 'block', fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: 500, marginBottom: 5 },
  input: {
    width: '100%',
    backgroundColor: COLORS.bgInput,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: RADIUS.md,
    padding: `9px ${SPACING.md}px`,
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
    minHeight: 38,
  },

  selectTrigger: {
    width: '100%',
    backgroundColor: COLORS.bgInput,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: RADIUS.md,
    padding: `9px ${SPACING.md}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 38,
  },
  dropdown: {
    backgroundColor: COLORS.bgCard,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: RADIUS.md,
    marginTop: 4,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: { width: '100%', padding: `11px ${SPACING.md}px` },
  dropdownItemBorder: { borderBottom: `0.5px solid ${COLORS.border}` },

  button: {
    width: '100%',
    padding: `${SPACING.md}px ${SPACING.xl}px`,
    borderRadius: RADIUS.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: { fontSize: FONTS.base, fontWeight: 600 },

  statBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    border: `0.5px solid ${COLORS.border}`,
    padding: SPACING.md,
    textAlign: 'center',
  },
  statValue: { fontSize: FONTS.xl, fontWeight: 600 },
  statLabel: { fontSize: FONTS.xs, color: COLORS.textHint, marginTop: 3 },

  divider: { height: 0.5, backgroundColor: COLORS.border, margin: `${SPACING.md}px 0` },
};