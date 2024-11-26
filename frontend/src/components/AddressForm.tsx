import React, { FC, useEffect, useRef } from "react";
import "../App.css";

interface AddressFormProps {
  origin: string;
  setOrigin: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

const AddressForm: FC<AddressFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  onSearch,
}) => {
  const originInputRef = useRef<HTMLInputElement | null>(null);
  const destinationInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadAutocomplete = () => {
      if (originInputRef.current && destinationInputRef.current) {
        const options = {
          types: ["address"],
        };

        const originAutocomplete = new window.google.maps.places.Autocomplete(
          originInputRef.current,
          options
        );

        const destinationAutocomplete =
          new window.google.maps.places.Autocomplete(
            destinationInputRef.current,
            options
          );

        originAutocomplete.addListener("place_changed", () => {
          const place = originAutocomplete.getPlace();
          if (place.formatted_address) {
            setOrigin(place.formatted_address);
          }
        });

        destinationAutocomplete.addListener("place_changed", () => {
          const place = destinationAutocomplete.getPlace();
          if (place.formatted_address) {
            setDestination(place.formatted_address);
          }
        });
      }
    };

    if (window.google && window.google.maps.places) {
      loadAutocomplete();
    } else {
      window.onload = loadAutocomplete;
    }
  }, [setOrigin, setDestination]);

  return (
    <div className="address-form">
      <div className="input-container">
        <div className="input-section">
          <label htmlFor="origin" className="input-label">
            Partida:
          </label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            ref={originInputRef}
            className="input-field"
          />
        </div>

        <div className="input-section">
          <label htmlFor="destination" className="input-label">
            Destino:
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            ref={destinationInputRef}
            className="input-field"
          />
        </div>
      </div>

      <button onClick={onSearch} className="search-button">
        Fazer cotação
      </button>
    </div>
  );
};

export default AddressForm;
