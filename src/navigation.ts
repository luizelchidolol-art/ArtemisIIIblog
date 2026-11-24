const offline = location.protocol === "file:";
export const currentPage = offline
  ? new URLSearchParams(location.search).get("pagina") || "/"
  : location.pathname.replace(/\/$/, "") || "/";

export function pageLink(path: string) {
  if (!offline) return path;
  const [page, anchor] = path.split("#");
  return "?pagina=" + encodeURIComponent(page) + (anchor ? "#" + anchor : "");
}
