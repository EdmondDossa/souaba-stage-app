import { Shield } from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Nettoyage quotidien",
      description: "Désinfections et stérilisations"
    },
    {
      icon: Shield,
      title: "Extincteurs",
      description: "Détecteurs de fumée"
    },
    {
      icon: Shield,
      title: "Désinfections et stérilisations",
      description: ""
    },
    {
      icon: Shield,
      title: "Détecteurs de fumée",
      description: ""
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Sécurité et hygiène</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-2">
        {securityFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                {feature.description && (
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
