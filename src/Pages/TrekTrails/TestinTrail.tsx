// TrekTrails.jsx
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from "@react-google-maps/api";

interface MarkerData {
  position: { lat: number; lng: number };
  name: string | null;
  description: string | null;
  images: string[];
}

interface PathData {
  path: { lat: number; lng: number }[];
  name: string | null;
  description: string | null;
}

const TestinTrail: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  console.log("paths",paths)
  const kmlUrl = "/kmlFiles/demo-abc-I.kml";

  const handleMapLoad = (loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  };

  useEffect(() => {
    const fetchKml = async () => {
      try {
        const response = await fetch(kmlUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, "text/xml");
        
        const placemarks = kml.getElementsByTagName("Placemark");
        const newMarkers = [];
        const newPaths = [];
        const bounds = new window.google.maps.LatLngBounds();

        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const name = placemark.getElementsByTagName("name")[0]?.textContent;
          const description = placemark.getElementsByTagName("description")[0]?.textContent;
          
          // Parse images from gx:Carousel or gx:Image
          const images = [];
          
          // Helper to find elements by tag name, handling potential namespace issues
          const findElements = (element: Element, tagName: string) => {
            let tags = element.getElementsByTagName(tagName);
            if (tags.length === 0 && tagName.includes(":")) {
               // Try without prefix
               tags = element.getElementsByTagName(tagName.split(":")[1]);
            }
            return tags;
          };

          const imageTags = findElements(placemark, "gx:imageUrl");
          
          for (let j = 0; j < imageTags.length; j++) {
            let url = imageTags[j].textContent.trim();
            // Replace {size} with a concrete value. 
            // Google Earth images often use this placeholder.
            url = url.replace("{size}", "800");
            images.push(url);
          }
          
          if (name === "busket mela") {
            console.log("Busket Mela debug:", { name, images, rawTags: imageTags.length });
          }

          // Handle Points
          const point = placemark.getElementsByTagName("Point")[0];
          if (point) {
            const coords = point.getElementsByTagName("coordinates")[0]?.textContent.trim();
            if (coords) {
              const [lng, lat] = coords.split(",").map(Number);
              const position = { lat, lng };
              newMarkers.push({ position, name, description, images });
              bounds.extend(position);
            }
          }

          // Handle LineStrings (Trails)
          const lineString = placemark.getElementsByTagName("LineString")[0];
          if (lineString) {
            const coordsRaw = lineString.getElementsByTagName("coordinates")[0]?.textContent.trim();
            if (coordsRaw) {
              const path = coordsRaw.split(/\s+/).map((coord) => {
                const [lng, lat] = coord.split(",").map(Number);
                const position = { lat, lng };
                bounds.extend(position);
                return position;
              });
              newPaths.push({ path, name, description });
            }
          }
        }

        setMarkers(newMarkers);
        setPaths(newPaths);

        if (map && (newMarkers.length > 0 || newPaths.length > 0)) {
          map.fitBounds(bounds);
        }

      } catch (error) {
        console.error("Error fetching or parsing KML:", error);
      }
    };

    if (map) {
      fetchKml();
    }
  }, [map]);

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
  };

  return (
    <MiddleContentWrapper>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: "700px", width: "100%" }}
          center={{ lat: 28.6, lng: 83.7 }} // Default center roughly around Nepal/Annapurna area
          zoom={10}
          onLoad={handleMapLoad}
          mapTypeId="satellite"
          options={{
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            zoomControl: true,
          }}
        >
          {/* Render Trails */}
          {paths.map((trail, index) => (
            <Polyline
              key={`path-${index}`}
              path={trail.path}
              options={{
                strokeColor: "#ff2dc0fb", // Color from KML
                strokeOpacity: 1,
                strokeWeight: 4,
              }}
            />
          ))}

          {/* Render Markers */}
          {markers.map((marker, index) => (
            <Marker
              key={`marker-${index}`}
              position={marker.position}
              title={marker.name || undefined}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}

          {/* InfoWindow for Selected Marker */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div style={{ maxWidth: "300px", color: "#333" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>{selectedMarker.name}</h3>
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
                  <strong>Lat:</strong> {selectedMarker.position.lat.toFixed(5)}, <strong>Lng:</strong> {selectedMarker.position.lng.toFixed(5)}
                </div>
                {selectedMarker.description && (
                  <p style={{ fontSize: "14px", marginBottom: "8px" }}>{selectedMarker.description}</p>
                )}
                {selectedMarker.images && selectedMarker.images.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedMarker.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={selectedMarker.name || undefined} 
                        style={{ width: "100%", borderRadius: "4px", objectFit: "cover" }}
                        onError={(e) => {
                          console.error("Image failed to load:", img);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </MiddleContentWrapper>
  );
};

export default TestinTrail;
