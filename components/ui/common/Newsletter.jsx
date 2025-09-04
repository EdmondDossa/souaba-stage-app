"use client";
import React, { useState } from 'react';
import Image from "next/image";
import SvgIcon from './SvgIcon';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Ici vous pouvez ajouter la logique d'inscription à la newsletter
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email inscrit:', email);
      setEmail('');
      // Vous pouvez ajouter une notification de succès ici
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-6">
        <div className="flex-shrink-0 justify-center">
          <h3 className="text-2xl font-bold mb-2 font-montserrat-bold text-gray-900">
            Newsletter
          </h3>
          <p className="text-gray-600">
            Restez a jour
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex max-w-2xl">
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="w-150 px-3 bg-white py-2 border border-gray-300 rounded-l-full rounded-tr-3xl focus:outline-none text-sm"
              required
              disabled={isLoading}
          />
          <button
              type="submit"
              disabled={isLoading}
              className="text-white flex items-center justify-center pr-5"
          >
            <SvgIcon name={"send btn"} size={80} className="text-white -ml-8" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
