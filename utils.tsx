export function timeSince(createdAt) {
  const date = new Date(createdAt).getTime() / 1000;

  var seconds = Math.floor(new Date().getTime() / 1000 - date),
    interval = Math.floor(seconds / 31536000);

  if (interval > 1) return interval + "year";

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + "m";

  return Math.floor(seconds) + "s";
}
