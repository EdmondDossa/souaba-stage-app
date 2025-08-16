export function hideString(string) {
  //we hide 60% of letters
  const numbersOfLettersToHide = (string.length * 0.5) | 0;
  const start = string.slice(0, 4);
  const middle = new Array(numbersOfLettersToHide).fill("*").join("");
  const end = string.slice(numbersOfLettersToHide + start.length);
  return start + middle + end;
}

export function formatTime(time) {
  let hour = Math.floor(time / 3600);
  let minute = Math.floor(time / 60) % 60;
  let seconde = time % 60;

  hour = hour.toString().padStart(2, "0");
  minute = minute.toString().padStart(2, "0");
  seconde = seconde.toString().padStart(2, "0");

  if (hour === "00") {
    return `${minute}min:${seconde}s`;
  } else {
    return `${hour}h:${minute}min:${seconde}s`;
  }
}

export function handlePhotoUpload(
  files,
  allowedExtensions = ["jpg", "jpeg", "png"],
  LIMIT_UPLOAD_SIZE = 5 * 1024 * 1024 /*5MB */
) {
  let uploadedPhotos = [];
  let fileError = false;

  for (const file of files) {
    const fileExtension = file.type.split("/").at(-1);
    if (
      !file.type?.startsWith("image/") ||
      !allowedExtensions.includes(fileExtension) ||
      file.size > LIMIT_UPLOAD_SIZE
    ) {
      fileError = true;
    } else {
      const urlPreview = URL.createObjectURL(file);
      uploadedPhotos.push({ file, url: urlPreview });
    }
  }

  const response = {
    fileError,
    media: uploadedPhotos,
  };

  if (fileError)
    response.message = `Taille MAX:5MB. Extensions autorisées ${allowedExtensions.join(
      ","
    )}.`;

    return response;
}
