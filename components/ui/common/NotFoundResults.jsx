import { Search, FilterX, Inbox, RefreshCw } from 'lucide-react';

export default function NoResults({
  title = "Aucun résultat trouvé",
  message = "Essayez de modifier vos critères de recherche ou de filtres.",
  icon = 'search',
  className = "",
  action,
  onRetry,
  showRetry = false
}) {
  const getIcon = () => {
    const iconProps = {
      size: 64,
      className: "text-gray-400 mb-4"
    };

    switch (icon) {
      case 'filter':
        return <FilterX {...iconProps} />;
      case 'inbox':
        return <Inbox {...iconProps} />;
      case 'refresh':
        return <RefreshCw {...iconProps} />;
      case 'search':
      default:
        return <Search {...iconProps} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {getIcon()}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 max-w-md mb-6">
        {message}
      </p>

      <div className="flex gap-3">
        {action}
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}