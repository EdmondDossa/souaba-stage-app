import Image from 'next/image';
import SvgIcon from './SvgIcon';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: "Security et hygiene",
      title: "Nettoyage quotidien",
      description: "Désinfections et stérilisations"
    },
    {
      icon: "Security et hygiene",
      title: "Extincteurs",
      description: "Détecteurs de fumée"
    },
    {
      icon: "Security et hygiene",
      title: "Désinfections et stérilisations",
      description: ""
    },
    {
      icon: "Security et hygiene",
      title: "Détecteurs de fumée",
      description: ""
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Sécurité et hygiène</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-2">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-4 p-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <SvgIcon name={feature.icon} size={24} className="" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{feature.title}</div>
              {feature.description && (
                <div className="text-gray-600 text-sm">{feature.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
