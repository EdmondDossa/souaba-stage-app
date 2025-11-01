import { SearchX } from "lucide-react";

export default function NotFoundResults({ message = "Aucun élément trouvé" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
