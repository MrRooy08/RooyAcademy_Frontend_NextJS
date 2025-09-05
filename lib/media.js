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

export function chunkFile(file) {

  let chunkSize; 
  if (file.size > 500 * 1024 * 1024) {
    chunkSize = 10 * 1024 * 1024; 
  } else if (file.size > 100 * 1024 * 1024) {
    chunkSize = 5 * 1024 * 1024; 
  } else {
    chunkSize = 2 * 1024 * 1024; 
  }

  const chunks = [];
  let start = 0;
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  return chunks;
}

export async function uploadChunksParallel (file , uploadFn, concurrency = 3) {
  const chunks = chunkFile(file); 
  const results = [];
  
  let index = 0, active = 0; 

  return new Promise ((resolve, reject) => {
    function next () {
      if (index >= chunks.length && active === 0 ) {
        return resolve(results);
      }

      while ( active < concurrency && index < chunks.length ) {
        const chunk = chunks[index];
        index++;
        active++;
        uploadFn(chunk)
          .then((result) => {
            results.push(result);
            active--;
            next();
          })
          .catch((error) => {
            reject(error);
          })
      }
    }
    next();
  })
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
