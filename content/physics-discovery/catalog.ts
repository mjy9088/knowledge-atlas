import type {ContentEntry} from '../../packages/content/types.js';
import atomEvidencePage from './atom-evidence/page.js';
import electronEvidencePage from './electron-evidence/page.js';
import inertialMotionPage from './inertial-motion/page.js';
import nuclearConstituentsPage from './nuclear-constituents/page.js';
import nuclearScatteringPage from './nuclear-scattering/page.js';
import quantumSpectraPage from './quantum-spectra/page.js';

export const DISCOVERY_ENTRIES: ContentEntry[] = [
  {directory: 'physics-discovery/inertial-motion', article: 'article.ko.json', claims: 'claims.json', page: inertialMotionPage},
  {directory: 'physics-discovery/atom-evidence', article: 'article.ko.json', claims: 'claims.json', page: atomEvidencePage},
  {directory: 'physics-discovery/nuclear-scattering', article: 'article.ko.json', claims: 'claims.json', page: nuclearScatteringPage},
  {directory: 'physics-discovery/electron-evidence', article: 'article.ko.json', claims: 'claims.json', page: electronEvidencePage},
  {directory: 'physics-discovery/nuclear-constituents', article: 'article.ko.json', claims: 'claims.json', page: nuclearConstituentsPage},
  {directory: 'physics-discovery/quantum-spectra', article: 'article.ko.json', claims: 'claims.json', page: quantumSpectraPage},
];
