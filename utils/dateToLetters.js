import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function dateToLetters(date){
  if(!date) return "";
  const d = date.split("/").reverse().join("/");
  const dateToLetters = format(d, "d MMMM yyyy", { locale: fr });
  return dateToLetters;
}