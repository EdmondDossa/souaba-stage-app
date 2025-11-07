import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-48 h-48 relative">
            <Image
              src="/images/logo-primary.png"
              alt="404 Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h2 className="mt-6 text-5xl font-extrabold text-gray-900">
          404
        </h2>
        <p className="mt-2 text-xl text-gray-600">
          Oups ! La page que vous recherchez est introuvable.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
