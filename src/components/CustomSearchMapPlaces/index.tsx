import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import styles from "./CustomSearchMapPlaces.module.scss";

interface PlaceResult {
  place_id?: string;
  display_name: string;
  lat: string;
  lon: string;
}

const DUMMY_OPTIONS: PlaceResult[] = [
  {
    place_id: "dummy-1",
    display_name: "Kathmandu, Bagmati Province, Nepal",
    lat: "27.708317",
    lon: "85.3205817",
  },
  {
    place_id: "dummy-2",
    display_name: "Pokhara, Gandaki Province, Nepal",
    lat: "28.209538",
    lon: "83.985567",
  },
  {
    place_id: "dummy-3",
    display_name: "Lalitpur, Bagmati Province, Nepal",
    lat: "27.676589",
    lon: "85.312950",
  },
  {
    place_id: "dummy-4",
    display_name: "Bhaktapur, Bagmati Province, Nepal",
    lat: "27.672288",
    lon: "85.428271",
  },
];

export interface CustomSearchMapPlacesProps {
  onPlaceSelect: (lat: number, lon: number, name: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSearchMapPlaces: React.FC<CustomSearchMapPlacesProps> = ({
  onPlaceSelect,
  placeholder = "Search places in Nepal...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch from Photon API (allows fuzzy matching)
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!debouncedTerm.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            debouncedTerm + " nepal"
          )}&limit=8`
        );
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = data.features.map((f: any) => ({
            place_id: f.properties.osm_id?.toString() || Math.random().toString(),
            display_name: [f.properties.name, f.properties.city, f.properties.state, f.properties.country]
              .filter(Boolean)
              .join(", "),
            lat: f.geometry.coordinates[1].toString(),
            lon: f.geometry.coordinates[0].toString(),
          }));
          setResults(formattedData);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [debouncedTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (place: PlaceResult) => {
    setSearchTerm(place.display_name);
    setIsOpen(false);
    onPlaceSelect(parseFloat(place.lat), parseFloat(place.lon), place.display_name);
  };

  return (
    <div className={`${styles.searchWrapper} ${className}`} ref={wrapperRef}>
      <div className={styles.inputContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && <FaSpinner className={styles.spinnerIcon} />}
      </div>

      {/* Suggested Chips below input */}
      <div className={styles.suggestionsContainer}>
        {DUMMY_OPTIONS.map((place, index) => (
          <button
            key={place.place_id || index}
            className={styles.suggestionChip}
            onClick={() => handleSelect(place)}
          >
            {place.display_name.split(",")[0]}
          </button>
        ))}
      </div>

      {isOpen && debouncedTerm.trim().length > 0 && (
        <div className={styles.dropdown}>
          {results.length > 0 ? (
            <ul className={styles.resultsList}>
              {results.map((place, index) => (
                <li
                  key={place.place_id || index}
                  className={styles.resultItem}
                  onClick={() => handleSelect(place)}
                >
                  <FaMapMarkerAlt className={styles.markerIcon} />
                  <span className={styles.placeName}>{place.display_name}</span>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && (
              <div className={styles.noResults}>No places found in Nepal.</div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSearchMapPlaces;
