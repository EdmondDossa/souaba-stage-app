export function hideString(string){
  //we hide 60% of letters
   const numbersOfLettersToHide = (string.length * 0.5) | 0;
   const start = string.slice(0,4);
   const middle = new Array(numbersOfLettersToHide).fill("*").join("");
   const end = string.slice(numbersOfLettersToHide+start.length);
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