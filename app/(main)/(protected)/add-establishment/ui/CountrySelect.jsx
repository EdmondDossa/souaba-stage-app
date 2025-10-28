import React, { useEffect, useState } from "react";
import countryList from "@/data/country-in-fr.json";
import { getUserCountry } from "@/utils/get-user-country";


const CountrySelect =  ({ onChange, className, value }) => {
  const customClass = `w-full border border-gray-200 p-4 rounded-lg font-montserrat-medium ${className}`;
  const [defaultCountry,setDefaultCountry] = useState("");

  useEffect(()=>{
    async function getCountryDefaultValue(){
      const userCountry = await getUserCountry();
      console.log(userCountry);
      
      setDefaultCountry(userCountry);
    }
    getCountryDefaultValue();
  },[]);

  if(!defaultCountry) return;

  return (
    <select
      id="country"
      name="country"
      value={defaultCountry}
      onChange={onChange}
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
