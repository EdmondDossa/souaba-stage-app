import React, { useEffect, useState } from "react";
import countryList from "@/data/country-in-fr.json";
import { getUserCountry } from "@/utils/get-user-country";


const CountrySelect =  ({ onChange, className = "", value }) => {
  const customClass = `w-full border border-gray-200 p-4 rounded-lg font-montserrat-medium ${className}`;
  const fallbackCountry = "Côte d'Ivoire";
  const [defaultCountry,setDefaultCountry] = useState(value || fallbackCountry);

  useEffect(()=>{
    async function getCountryDefaultValue(){
      const userCountry = await getUserCountry();
      setDefaultCountry(value || userCountry || fallbackCountry);
    }
    getCountryDefaultValue();
  },[value]);

  return (
    <select
      id="country"
      name="country"
      value={value || defaultCountry}
      onChange={(e) => {
        setDefaultCountry(e.target.value);
        onChange?.(e);
      }}
      className={customClass}
    >
      <option value="">Sélectionnez un pays</option>
      {countryList.map((country) => (
        <option key={country}> {country} </option>
      ))}
    </select>
  );
};

export default CountrySelect;
