export type RepresentationTechnology='dom'|'svg'|'canvas-2d'|'webgl-2';
export type RepresentationFit='semantic-text'|'controls'|'tables'|'labelled-2d'|'exact-2d-relationships'|'sampled-images'|'dense-2d-drawing'|'spatial-fields'|'depth-occlusion'|'complex-surfaces'|'dense-model-geometry';

export type RepresentationSelectionPolicy={
  readonly version:1;
  readonly selectionBasis:'explanatory-need';
  readonly choices:readonly {readonly technology:RepresentationTechnology;readonly explanatoryFits:readonly RepresentationFit[]}[];
  readonly execution:{readonly adapterMode:'registered-only';readonly embeddedExecutablePayloads:'forbidden'};
  readonly geometry:{readonly source:'pure-model-or-authored-data';readonly coordinateAndScaleConventions:'required';readonly numericalAndRenderingLimits:'required'};
  readonly state:{readonly getState:'required';readonly setState:'validated';readonly reset:'required';readonly independentSeek:'required-when-time-based'};
  readonly fallback:{readonly usableAlternative:'required';readonly limitationsDisclosure:'required';readonly gpuUnavailable:'required-for-webgl-2';readonly contextLoss:'required-for-webgl-2'};
  readonly accessibility:{readonly explanatoryAlternative:'required'};
  readonly resources:{readonly disposal:'required-for-canvas-2d-and-webgl-2'};
};

export const REPRESENTATION_SELECTION_POLICY={
  version:1,
  selectionBasis:'explanatory-need',
  choices:[
    {technology:'dom',explanatoryFits:['semantic-text','controls','tables']},
    {technology:'svg',explanatoryFits:['labelled-2d','exact-2d-relationships']},
    {technology:'canvas-2d',explanatoryFits:['sampled-images','dense-2d-drawing']},
    {technology:'webgl-2',explanatoryFits:['spatial-fields','depth-occlusion','complex-surfaces','dense-model-geometry']}
  ],
  execution:{adapterMode:'registered-only',embeddedExecutablePayloads:'forbidden'},
  geometry:{source:'pure-model-or-authored-data',coordinateAndScaleConventions:'required',numericalAndRenderingLimits:'required'},
  state:{getState:'required',setState:'validated',reset:'required',independentSeek:'required-when-time-based'},
  fallback:{usableAlternative:'required',limitationsDisclosure:'required',gpuUnavailable:'required-for-webgl-2',contextLoss:'required-for-webgl-2'},
  accessibility:{explanatoryAlternative:'required'},
  resources:{disposal:'required-for-canvas-2d-and-webgl-2'}
} as const satisfies RepresentationSelectionPolicy;
