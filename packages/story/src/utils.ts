/**
 * @param path path=/src/client/App.tsx
 */
export function getFixturesPath(path: string) {
  const queryStringMatch = path.match(/\?(.+)$/);
  const queryString = queryStringMatch?.[1];

  const searchParams = new URLSearchParams(queryString);
  const componentPath = searchParams.get("path");

  if (componentPath) {
    return `/src/fixtures${componentPath.replace("/src", "")}.json`;
  }
  return `/src/fixtures${componentPath}.json`;
}
