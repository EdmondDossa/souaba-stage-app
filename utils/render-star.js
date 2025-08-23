import { IoStar as Star } from "react-icons/io5";
import { IoStarHalfOutline as HalfStart } from "react-icons/io5";
import { IoStarOutline as EmptyStar } from "react-icons/io5";

 // Fonction pour générer les étoiles
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="text-primary"
        />
      );
    }

    // Demi-étoile
    if (hasHalfStar) {
      stars.push(
        <HalfStart key="half" className="text-primary" />
      );
    }

    // Étoiles vides
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
       <EmptyStar key={i} className="text-primary bg" />
      );
    }

    return stars;
  };

  export default renderStars;