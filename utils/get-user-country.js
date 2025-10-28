export async function getUserCountry() {
  try {
    const savedUserCountry = JSON.parse(localStorage.getItem("user-country-info") ?? '{}');
    const ONE_DAY = 24 * 60 * 60 * 60;

    if (!savedUserCountry?.country || savedUserCountry?.expiresAt < Date.now()) {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const countryCode = data.country;
      const regionNamesInFrench = new Intl.DisplayNames(["fr"], {
        type: "region",
      });
      const countryNameInFrench = regionNamesInFrench.of(countryCode);
      console.log(countryNameInFrench,'---');
      
      localStorage.setItem(
        "user-country-info",
        JSON.stringify({
          country: countryNameInFrench,
          expiresAt: Date.now() + ONE_DAY,
        })
      );
      return countryNameInFrench;
    }

    return savedUserCountry.country;
  } catch (error) {
    console.log("Erreur lors de la récupération du pays :", error);
    return null;
  }
}
