import type {ContentEntry} from '../../packages/content/types.js';

const entry=(topic:string):ContentEntry=>({directory:`number-systems/${topic}`,article:'article.ko.json',claims:'claims.json',articleId:`article:number-systems.${topic}.ko`});

export const NUMBER_ENTRIES:ContentEntry[]=[
  entry('counting-zero'),entry('negative-numbers'),entry('rational-numbers'),entry('rational-representations'),
  entry('irrational-numbers'),entry('rational-density'),entry('real-completeness'),entry('complex-numbers'),
];
