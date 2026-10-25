export interface SourceReference { sourceId: string; locator: string }
export interface Claim {
  id: string; kind: string; statement: string; scope: string;
  assumptions: string[]; sourceRefs: SourceReference[]; reviewStatus: string;
}
export interface SourceRecord {
  id: string; title: string; author: string; canonicalUrl: string;
  retrievedAt: string; providerRevision: string; contentHash: string | null;
  license: string; rightsReview: string;
}
export interface ArticleBlock { id: string; text: string; claimRefs: string[] }
export interface Article {
  id: string; title: string; shortTitle?: string; conceptId: string; reviewStatus: string;
  blocks: ArticleBlock[]; relatedConcepts: string[]; scope?: string;
}
export interface Scene {
  id: string; title: string; block: number; from: number; to?: number;
  figure?: {src:string;alt:string;caption:string};
  motion?: {id:string};
  cards: string[]; known: string;
  skip?: {to:string;label:string};
  suggestion?: { example: string } | { n: number; basis: string; Z: number; mode?: string };
}
export interface ContentMainlineChapter { kind: 'mainline'; id: string; title: string; sceneIds: string[] }
export interface ContentDetourChapter { kind: 'detour'; id: string; title: string; sceneIds: string[]; parentSceneId: string; returnSceneId: string }
export type ContentChapter=ContentMainlineChapter|ContentDetourChapter;
export interface ContentPage {
  slug: string; articleId: string; label: string; category: string;
  cover?: boolean;
  coverArtwork?: {src:string;alt:string};
  experiment?: boolean; model?: 'classical' | 'fde' | 'sets' | 'ch' | null;
  interactive?: 'hydrogenic-orbitals' | 'physics-history' | 'typed-lambda' | 'binary-search' | 'sphere-slices' | 'base-rates' | 'nuclear-evidence' | 'weekday-worlds' | 'binary-relations' | 'monty-hall' | 'two-children';
  workbenchPlacement?: 'after-explanation';
  sceneVisualPlacement?: 'after-explanation';
  navigation?: {chapters:ContentChapter[];relatedArticleIds?:string[]};
  styles?: string[]; claimRefs?: string[]; scenes: Scene[];
}
export interface ContentEntry { directory: string; article: string; claims: string; articleId: string }
export interface CollectionMetadata {
  id: string; reviewStatus: string; sourceSnapshotVerified: boolean;
  articleRefs?: string[]; published?: boolean; schemaVersion?: number; title?: string;
}
export interface ContentCollection extends CollectionMetadata { articles: Article[] }
export interface SiteContent { collection: ContentCollection; claims: Claim[]; sources: SourceRecord[]; figureDimensions?:Readonly<Record<string,{readonly width:number;readonly height:number}>> }
export interface Concept { id: string; title: string; summary: string; reviewStatus: string; externalIds: string[] }
export interface KnowledgeRelation { from: string; to: string; type: string; context: string; status: string; sourceRefs?: string[] }
