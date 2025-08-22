import { Clock, CreditCard, Ban, CheckCircle } from "lucide-react";

export default function HotelPolicies() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Politiques de l'hôtel</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-in / Check-out */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-6 h-6 text-primary" />
            <h4 className="font-semibold text-gray-900">Heures d'arrivée et de départ</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Arrivée :</strong> À partir de 15h00</p>
            <p><strong>Départ :</strong> Avant 11h00</p>
            <p><strong>Réception :</strong> 24h/24</p>
          </div>
        </div>

        {/* Paiement */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <CreditCard className="w-6 h-6 text-primary" />
            <h4 className="font-semibold text-gray-900">Modes de paiement</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Carte de crédit (Visa, MasterCard)</p>
            <p>• Espèces</p>
            <p>• Virement bancaire</p>
            <p>• Mobile Money</p>
          </div>
        </div>

        {/* Annulation */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Ban className="w-6 h-6 text-primary" />
            <h4 className="font-semibold text-gray-900">Politique d'annulation</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Annulation gratuite jusqu'à 24h avant l'arrivée</p>
            <p>• Frais d'annulation : 50% après 24h</p>
            <p>• Aucun remboursement le jour même</p>
          </div>
        </div>

        {/* Règles de l'hôtel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h4 className="font-semibold text-gray-900">Règles de l'hôtel</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Animaux non autorisés</p>
            <p>• Interdiction de fumer</p>
            <p>• Respect du calme après 22h</p>
            <p>• Pièce d'identité requise</p>
          </div>
        </div>
      </div>
    </div>
  );
}
