import { FaStar as Star } from "react-icons/fa";
import { FaStarHalfAlt as HalfStar, FaRegStar as EmptyStar  } from "react-icons/fa";

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
        <HalfStar key="half" className="text-primary" />
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