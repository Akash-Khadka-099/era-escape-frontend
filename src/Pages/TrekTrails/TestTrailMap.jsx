import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import parse from 'html-react-parser';

// Fix for default marker icon in React Leaflet with Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TestTrailMap = () => {
  const [markers, setMarkers] = useState([]);
  const [paths, setPaths] = useState([]);
  const [center, setCenter] = useState([28.6, 83.7]); // Default center

  const kmlUrl = "/kmlFiles/demo-abc-I.kml";

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
        const bounds = []; 

        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const name = placemark.getElementsByTagName("name")[0]?.textContent;
          const description = placemark.getElementsByTagName("description")[0]?.textContent;
          
          // Parse images
          const images = [];
          const findElements = (element, tagName) => {
            let tags = element.getElementsByTagName(tagName);
            if (tags.length === 0 && tagName.includes(":")) {
               tags = element.getElementsByTagName(tagName.split(":")[1]);
            }
            return tags;
          };

          const imageTags = findElements(placemark, "gx:imageUrl");
          for (let j = 0; j < imageTags.length; j++) {
            let url = imageTags[j].textContent.trim();
            url = url.replace("{size}", "800");
            images.push(url);
          }

          // Handle Points
          const point = placemark.getElementsByTagName("Point")[0];
          if (point) {
            const coords = point.getElementsByTagName("coordinates")[0]?.textContent.trim();
            if (coords) {
              const [lng, lat] = coords.split(",").map(Number);
              const position = [lat, lng]; // Leaflet uses [lat, lng]
              newMarkers.push({ position, name, description, images });
              bounds.push(position);
            }
          }

          // Handle LineStrings (Trails)
          const lineString = placemark.getElementsByTagName("LineString")[0];
          if (lineString) {
            const coordsRaw = lineString.getElementsByTagName("coordinates")[0]?.textContent.trim();
            if (coordsRaw) {
              const path = coordsRaw.split(/\s+/).map((coord) => {
                const [lng, lat] = coord.split(",").map(Number);
                const position = [lat, lng]; // Leaflet uses [lat, lng]
                bounds.push(position);
                return position;
              });
              newPaths.push({ path, name, description });
            }
          }
        }

        setMarkers(newMarkers);
        setPaths(newPaths);
        
        if (bounds.length > 0) {
             // Set center to the first point found to ensure map shows something relevant
             setCenter(bounds[0]);
        }

      } catch (error) {
        console.error("Error fetching or parsing KML:", error);
      }
    };

    fetchKml();
  }, []);

  console.log("markers", markers);

  return (
    <div style={{ height: "700px", width: "100%" }}>
      <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {/* Render Trails */}
        {paths.map((trail, index) => (
          <Polyline
            key={`path-${index}`}
            positions={trail.path}
            pathOptions={{ color: '#ff2dc0fb', weight: 4 }}
          />
        ))}

        {/* Render Markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            position={marker.position}
            
          >
            <Popup>
               <div style={{ maxWidth: "300px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>{marker.name}</h3>
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
                  <strong>Lat:</strong> {marker.position[0].toFixed(5)}, <strong>Lng:</strong> {marker.position[1].toFixed(5)}
                </div>
                {marker.description && (
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>{parse(marker.description)}</div>
                )}
                 {marker.images && marker.images.length > 0 && (
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {marker.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={marker.name} 
                          style={{ width: "100%", borderRadius: "4px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                     ))}
                   </div>
                 )}
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default TestTrailMap;