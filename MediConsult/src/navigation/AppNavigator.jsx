import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardScreen from '../screens/DashboardScreen';
import DossierScreen from '../screens/DossierScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import BilanScreen from '../screens/BilanScreen';
import PrescriptionScreen from '../screens/PrescriptionScreen';
import OrientationScreen from '../screens/OrientationScreen';
import COLORS from '../styles/colors';
import { FONTS } from '../styles/typography';

// 5 onglets (Bilan n'est pas un onglet, comme dans l'original — accessible via le flux)
const TABS = [
  { path: '/', emoji: '🏠', label: 'Accueil' },
  { path: '/dossier', emoji: '📁', label: 'Dossier' },
  { path: '/consultation', emoji: '🩺', label: '', center: true },
  { path: '/prescription', emoji: '💊', label: 'Ordonnance' },
  { path: '/orientation', emoji: '↗', label: 'Orientation' },
];

function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={tabStyles.bar}>
      {TABS.map((tab) => {
        const focused = location.pathname === tab.path;

        if (tab.center) {
          return (
            <button
              key={tab.path}
              className="touchable"
              onClick={() => navigate(tab.path)}
              style={{ ...tabStyles.centerBtn, ...(focused ? tabStyles.centerBtnActive : {}) }}
            >
              <span style={tabStyles.centerEmoji}>{tab.emoji}</span>
            </button>
          );
        }

        return (
          <button key={tab.path} className="touchable" onClick={() => navigate(tab.path)} style={tabStyles.iconWrap}>
            <span style={{ ...tabStyles.emoji, opacity: focused ? 1 : 0.45 }}>{tab.emoji}</span>
            <span style={{ ...tabStyles.label, color: focused ? COLORS.primary : COLORS.textHint }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AppNavigator() {
  const location = useLocation();
  const hideTabBar = location.pathname === '/bilan'; // écran atteint via le flux, sans tab bar

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/dossier" element={<DossierScreen />} />
          <Route path="/consultation" element={<ConsultationScreen />} />
          <Route path="/bilan" element={<BilanScreen />} />
          <Route path="/prescription" element={<PrescriptionScreen />} />
          <Route path="/orientation" element={<OrientationScreen />} />
        </Routes>
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  );
}

export default AppNavigator;

const tabStyles = {
  bar: {
    height: 70,
    display: 'flex',
    backgroundColor: COLORS.bgCard,
    borderTop: `0.5px solid ${COLORS.border}`,
    paddingTop: 4,
    paddingBottom: 8,
    boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
  },
  iconWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  emoji: { fontSize: 20, marginBottom: 2 },
  label: { fontSize: FONTS.xs, fontWeight: 500 },
  centerBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtnActive: {},
  centerEmoji: {
    fontSize: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `0.5px solid ${COLORS.border}`,
  },
};