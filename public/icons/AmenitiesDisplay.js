          {/* Commodités */}
          <div>
            <h2 className="text-2xl font-bold mb-6 font-montserrat-bold">Commodités offertes</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  {amenity.name === "Cuisine" ? (
                    <Image 
                      src="/icons/kitchen.svg" 
                      alt="Icône cuisine"
                      width={24}
                      height={24}
                      className="text-primary"
                    />
                  ) : (
                    <span className="text-2xl">{amenity.icon}</span>
                  )}
                  <span className="text-gray-700 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 text-primary font-semibold underline hover:no-underline transition-all">
              Afficher les 10 équipements
            </button>
          </div>
