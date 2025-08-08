const VIDEO_BASE = process.env.NEXT_PUBLIC_API_URL_VIDEO_LESSON || "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL_IMAGE || VIDEO_BASE;
const COURSE_VIDEO_BASE = process.env.NEXT_PUBLIC_API_URL_VIDEO || "";

function _buildUrl(base, filename, folder = "") {
  if (!base) return folder ? `${folder}/${filename}` : filename;
  if (filename.startsWith("/")) filename = filename.slice(1);
  const cleanBase = base.replace(/\/$/, "");
  const path = folder ? `${folder.replace(/(^\/|\/$)/g, "")}/${filename}` : filename;
  return `${cleanBase}/${path}`;
}


export function getVideoURL(fileOrString, folder = "") {
  if (fileOrString instanceof File || fileOrString instanceof Blob) {
    return URL.createObjectURL(fileOrString);
  }

  if (typeof fileOrString !== "string") return "";

  if (/^https?:\/\//i.test(fileOrString)) return fileOrString;

  return _buildUrl(VIDEO_BASE, fileOrString, folder);
}

export function getCourseVideoURL(fileOrString, folder = "") {
  if (fileOrString instanceof File || fileOrString instanceof Blob) {
    return URL.createObjectURL(fileOrString);
  }

  if (typeof fileOrString !== "string") return "";

  if (/^https?:\/\//i.test(fileOrString)) return fileOrString;

  return _buildUrl(COURSE_VIDEO_BASE, fileOrString, folder);
}

export function getImageURL(fileOrString, folder = "") {
  if (fileOrString instanceof File || fileOrString instanceof Blob) {
    return URL.createObjectURL(fileOrString);
  }

  if (typeof fileOrString !== "string") return "";

  if (/^https?:\/\//i.test(fileOrString)) return fileOrString;

  return _buildUrl(IMAGE_BASE, fileOrString, folder);
}

export function getLevelText(level) {
  switch (level) {
    case "TD01":
      return "Cơ bản"
    case "TD02":
      return "Trung cấp"
    case "TD03":
      return "Nâng cao"
    default:
      return "Không xác định"
  }
}
