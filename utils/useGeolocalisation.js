import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Vérifier si la géolocalisation est supportée
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: "La géolocalisation n'est pas supportée par ce navigateur"
      }));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };

    const success = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        loading: false,
        error: null,
      });
    };

    const error = (err) => {
      let errorMessage = 'Une erreur est survenue';
      
      switch(err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "L'accès à la position a été refusé";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Les informations de position ne sont pas disponibles";
          break;
        case err.TIMEOUT:
          errorMessage = "La demande de position a expiré";
          break;
        default:
          errorMessage = err.message;
      }

      setLocation(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    };

    navigator.geolocation.getCurrentPosition(success, error, defaultOptions);
  }, []);

  return location;
};