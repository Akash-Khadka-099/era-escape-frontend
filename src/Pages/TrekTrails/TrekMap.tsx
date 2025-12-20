import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getLocationIdFromHtml } from '@/utils/helper';
import TrailLocationDrawer from './TrailLocationDrawer';

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

const TrekMap: React.FC = () => {
  interface MarkerData {
    position: [number, number];
    name: string | null;
    description: string | null;
    images: string[];
  }

  interface PathData {
    path: [number, number][];
    name: string | null;
    description: string | null;
  }

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [center, setCenter] = useState<[number, number]>([28.6, 83.7]); // Default center
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarkerName, setSelectedMarkerName] = useState<string>("");

  const kmlUrl = "/kmlFiles/demo-abc-I.kml";

  useEffect(() => {
    const fetchKml = async () => {
      try {
        const response = await fetch(kmlUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, "text/xml");
        
        // First, extract all styles with BalloonStyle descriptions
        const styleMap: { [key: string]: string | null } = {};
        
        // Parse CascadingStyles with BalloonStyle
        const cascadingStyles = kml.getElementsByTagName("gx:CascadingStyle");
        for (let i = 0; i < cascadingStyles.length; i++) {
          const style = cascadingStyles[i];
          const styleId = style.getAttribute("kml:id");
          if (styleId) {
            const balloonStyle = style.getElementsByTagName("BalloonStyle")[0];
            if (balloonStyle) {
              const textElement = balloonStyle.getElementsByTagName("text")[0];
              if (textElement) {
                const balloonText = textElement.textContent?.trim() || null;
                styleMap[`#${styleId}`] = balloonText;
              }
            }
          }
        }
        
        // Parse StyleMaps to resolve references
        const styleMaps = kml.getElementsByTagName("StyleMap");
        for (let i = 0; i < styleMaps.length; i++) {
          const styleMapEl = styleMaps[i];
          const styleMapId = styleMapEl.getAttribute("id");
          if (styleMapId) {
            const pairs = styleMapEl.getElementsByTagName("Pair");
            for (let j = 0; j < pairs.length; j++) {
              const pair = pairs[j];
              const key = pair.getElementsByTagName("key")[0]?.textContent;
              if (key === "normal" || key === "highlight") {
                const styleUrl = pair.getElementsByTagName("styleUrl")[0]?.textContent;
                if (styleUrl && styleMap[styleUrl]) {
                  styleMap[`#${styleMapId}`] = styleMap[styleUrl];
                  break; // Use the first match
                }
              }
            }
          }
        }
        
        const placemarks = kml.getElementsByTagName("Placemark");
        const newMarkers: MarkerData[] = [];
        const newPaths: PathData[] = [];
        const bounds: [number, number][] = []; 

        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const name = placemark.getElementsByTagName("name")[0]?.textContent;
          
          // Extract description handling CDATA
          let description = null;
          const descElement = placemark.getElementsByTagName("description")[0];
          if (descElement) {
            // Get text content which includes CDATA
            description = descElement.textContent || descElement.innerHTML;
            // Clean up any extra whitespace
            description = description?.trim() || null;
          }
          
          // If no direct description, check styleUrl for BalloonStyle
          if (!description) {
            const styleUrlElement = placemark.getElementsByTagName("styleUrl")[0];
            if (styleUrlElement) {
              const styleUrl = styleUrlElement.textContent?.trim();
              if (styleUrl && styleMap[styleUrl]) {
                description = styleMap[styleUrl];
              }
            }
          }
          
          // Parse images
          const images: string[] = [];
          const findElements = (element: Element, tagName: string) => {
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
              const position: [number, number] = [lat, lng]; // Leaflet uses [lat, lng]
              newMarkers.push({ position, name, description, images });
              bounds.push(position);
            }
          }

          // Handle LineStrings (Trails)
          const lineString = placemark.getElementsByTagName("LineString")[0];
          if (lineString) {
            const coordsRaw = lineString.getElementsByTagName("coordinates")[0]?.textContent.trim();
            if (coordsRaw) {
              const path: [number, number][] = coordsRaw.split(/\s+/).map((coord) => {
                const [lng, lat] = coord.split(",").map(Number);
                const position: [number, number] = [lat, lng]; // Leaflet uses [lat, lng]
                bounds.push(position);
                return position;
              });
              newPaths.push({ path, name, description });
            }
          }
        }

        const structureMakers = newMarkers?.map((item => ({
          ...item,
          locationKey: getLocationIdFromHtml(item.description)
        })));
        
        setMarkers(structureMakers);
        setPaths(newPaths);
        
        if (bounds.length > 0) {
             // Set center to the first point found to ensure map shows something relevant
             setCenter(bounds[0] as [number, number]);
        }

      } catch (error) {
        console.error("Error fetching or parsing KML:", error);
      }
    };

    fetchKml();
  }, []);

  return (
    <div style={{ height: "85vh", width: "100%" }}>
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
            eventHandlers={{
              click: () => {
                setSelectedMarkerName(marker.name || "Unknown Location");
                setDrawerOpen(true);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div style={{ textAlign: 'center' }}>
                <strong>{marker.name || "Unknown Location"}</strong>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
        <TrailLocationDrawer 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
          title={selectedMarkerName} 
        />
      </MapContainer>
    </div>
  );
}

export default TrekMap;
