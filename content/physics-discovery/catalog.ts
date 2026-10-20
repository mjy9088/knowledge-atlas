import type {ContentEntry} from '../../packages/content/types.js';
import atomEvidencePage from './atom-evidence/page.js';
import electronEvidencePage from './electron-evidence/page.js';
import inertialMotionPage from './inertial-motion/page.js';
import lightClockTimePage from './light-clock-time/page.js';
import nuclearConstituentsPage from './nuclear-constituents/page.js';
import nuclearScatteringPage from './nuclear-scattering/page.js';
import photoelectricEvidencePage from './photoelectric-evidence/page.js';
import protonChargeLedgerPage from './proton-charge-ledger/page.js';
import quarkEvidencePage from './quark-evidence/page.js';
import quantumSpectraPage from './quantum-spectra/page.js';

const entry=(topic:string):ContentEntry=>({directory:`physics-discovery/${topic}`,article:'article.ko.json',claims:'claims.json',articleId:`article:physics-discovery.${topic}.ko`});

export const DISCOVERY_ENTRIES:ContentEntry[]=[
  entry('inertial-motion'),entry('atom-evidence'),entry('nuclear-scattering'),entry('electron-evidence'),entry('nuclear-constituents'),
  entry('quark-evidence'),entry('proton-charge-ledger'),entry('quantum-spectra'),entry('photoelectric-evidence'),entry('light-clock-time'),
];
export const DISCOVERY_PAGES=[inertialMotionPage,atomEvidencePage,nuclearScatteringPage,electronEvidencePage,nuclearConstituentsPage,quarkEvidencePage,protonChargeLedgerPage,quantumSpectraPage,photoelectricEvidencePage,lightClockTimePage] as const;
