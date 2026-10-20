const TEST_DIRECTORIES=new Set(['tests','__tests__','test-support']);

export function isTestPath(repositoryPath:string):boolean{
  const segments=repositoryPath.split(/[\\/]/u);
  return segments.some(segment=>TEST_DIRECTORIES.has(segment))||/\.(?:test|spec|browser)\./u.test(segments.at(-1)??'');
}
