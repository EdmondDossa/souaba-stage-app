"use client";
import { Calendar, Minus, Plus, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function PropertyReservationForm({ 
  price,
  currency = "FCFA",
  period = "nuit",
  onBook
}) {
  const [reservationData, setReservationData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    babies: 0
  });

  const [isVisible, setIsVisible] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!componentRef.current) return;

      const scrollY = window.scrollY;
      const componentTop = componentRef.current.offsetTop;
      const componentHeight = componentRef.current.offsetHeight;
      
      // Point où on "dépasse" complètement le composant
      const passedPoint = componentTop + componentHeight + 200;
      
      if (scrollY > passedPoint) {
        setIsVisible(false);
      } else if (scrollY < passedPoint - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updateGuestCount = (type, operation) => {
    setReservationData(prev => ({
      ...prev,
      [type]: operation === 'increment' 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  const calculateTotal = () => {
    return "**********";
  };

  return (
    <div 
      ref={componentRef}
      className={`
        bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-4 
        transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8 pointer-events-none'}
      `}
    >
      {/* Prix total */}
      <div className="mb-6">
        <div className="text-xl font-bold mb-1 text-gray-800">
          Prix Total:
        </div>
        <div className="text-3xl font-bold text-primary">
          {calculateTotal()} {currency}
        </div>
      </div>

      <div className="space-y-5">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Arrivée
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={reservationData.checkIn}
                onChange={(e) => setReservationData(prev => ({...prev, checkIn: e.target.value}))}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Départ
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={reservationData.checkOut}
                onChange={(e) => setReservationData(prev => ({...prev, checkOut: e.target.value}))}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Nombre d'invités */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Nombre d&apos;invités
          </label>
          
          {/* Adultes */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
              <div>
                <div className="font-semibold">Adultes</div>
                <div className="text-sm text-gray-500">18 ans ou plus</div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => updateGuestCount('adults', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={reservationData.adults <= 1}
                >
                  <Minus size={16} className={reservationData.adults <= 1 ? "text-gray-300" : "text-gray-600"} />
                </button>
                <span className="font-semibold min-w-[2rem] text-center">{reservationData.adults}</span>
                <button
                  onClick={() => updateGuestCount('adults', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Enfants */}
            <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
              <div>
                <div className="font-semibold">Enfants</div>
                <div className="text-sm text-gray-500">2-17 ans</div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => updateGuestCount('children', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={reservationData.children <= 0}
                >
                  <Minus size={16} className={reservationData.children <= 0 ? "text-gray-300" : "text-gray-600"} />
                </button>
                <span className="font-semibold min-w-[2rem] text-center">{reservationData.children}</span>
                <button
                  onClick={() => updateGuestCount('children', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Bébés */}
            <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
              <div>
                <div className="font-semibold">Bébés</div>
                <div className="text-sm text-gray-500">Moins de 2 ans</div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => updateGuestCount('babies', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={reservationData.babies <= 0}
                >
                  <Minus size={16} className={reservationData.babies <= 0 ? "text-gray-300" : "text-gray-600"} />
                </button>
                <span className="font-semibold min-w-[2rem] text-center">{reservationData.babies}</span>
                <button
                  onClick={() => updateGuestCount('babies', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de réservation */}
        <button 
          onClick={() => onBook && onBook(reservationData)}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Réserver maintenant
        </button>

        {/* Informations supplémentaires */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Vous ne serez pas débité pour le moment</p>
          <p className="flex items-center justify-center space-x-1">
            <Shield size={14} />
            <span>Paiement sécurisé</span>
          </p>
        </div>
      </div>
    </div>
  );
}
