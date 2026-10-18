import type { ContentEntry } from '../../packages/content/types.js';
import complexNumbersPage from './complex-numbers/page.js';
import countingZeroPage from './counting-zero/page.js';
import irrationalNumbersPage from './irrational-numbers/page.js';
import negativeNumbersPage from './negative-numbers/page.js';
import rationalNumbersPage from './rational-numbers/page.js';
import realCompletenessPage from './real-completeness/page.js';

export const NUMBER_ENTRIES: ContentEntry[] = [
  {
    directory: 'number-systems/counting-zero',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: countingZeroPage,
  },
  {
    directory: 'number-systems/negative-numbers',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: negativeNumbersPage,
  },
  {
    directory: 'number-systems/rational-numbers',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: rationalNumbersPage,
  },
  {
    directory: 'number-systems/irrational-numbers',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: irrationalNumbersPage,
  },
  {
    directory: 'number-systems/real-completeness',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: realCompletenessPage,
  },
  {
    directory: 'number-systems/complex-numbers',
    article: 'article.ko.json',
    claims: 'claims.json',
    page: complexNumbersPage,
  },
];
