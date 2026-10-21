const SEGMENT=/^[a-z][a-z0-9-]*$/u;

export type KnowledgeRoute={readonly slug:string;readonly sceneId?:string};

function segment(value:string,label:string):string{
  if(!SEGMENT.test(value))throw new RangeError(`Invalid ${label}`);
  return value;
}

export const articlePath=(slug:string):string=>`/knowledge/${segment(slug,'article slug')}/`;

export const scenePath=(slug:string,sceneId:string):string=>
  `${articlePath(slug)}${segment(sceneId,'scene identity')}/`;

export function parseKnowledgePath(pathname:string):KnowledgeRoute|null{
  const match=/^\/knowledge\/([a-z][a-z0-9-]*)(?:\/([a-z][a-z0-9-]*))?\/$/u.exec(pathname);
  if(!match?.[1])return null;
  return match[2]?{slug:match[1],sceneId:match[2]}:{slug:match[1]};
}

export const isURLSafeSceneId=(value:string):boolean=>SEGMENT.test(value);
