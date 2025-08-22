import React from "react";
import countryList from "@/data/country-in-fr.json";

const CountrySelect = ({ onChange, className, value }) => {
  const customClass = `w-full border border-gray-200 p-4 rounded-lg font-montserrat-medium ${className}`;
  return (
    <select
      id="country"
      name="country"
      value={value}
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
