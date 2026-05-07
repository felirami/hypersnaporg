const byteUnits = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatNumber(value: number | undefined | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatExactNumber(value: number | undefined | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en").format(value);
}

export function formatBytes(value: number | undefined | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unavailable";
  }

  let size = value;
  let unit = 0;
  while (size >= 1024 && unit < byteUnits.length - 1) {
    size /= 1024;
    unit += 1;
  }

  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${byteUnits[unit]}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function compactPeerId(peerId: string | undefined) {
  if (!peerId) {
    return "Unavailable";
  }

  return `${peerId.slice(0, 10)}...${peerId.slice(-8)}`;
}
