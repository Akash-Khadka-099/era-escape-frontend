import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Viewer,
  Entity,
  PolylineGraphics,
  BillboardGraphics,
  LabelGraphics,
  Scene,
} from "resium";
import {
  Cartesian3,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  JulianDate,
  VerticalOrigin,
  Cartographic,
  Math as CesiumMath,
  SceneMode,
  createWorldTerrainAsync,
  HeightReference,
} from "cesium";
import { Tooltip, Button, Space } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { getLocationIdFromHtml } from "@/utils/helper";
import TrailLocationDrawer from "../TrailLocationDrawer";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { useGetTrekBlogDetail } from "@/services/trekServices/trekServices";
import { useParams } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";

// Premium Marker Icon
const markerIcon =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";

interface MarkerData {
  position: [number, number];
  name: string | null;
  description: string | null;
  images: string[];
  locationKey?: string | null;
  travelTimeToNext?: string;
}

interface PathData {
  path: [number, number][];
  name: string | null;
  description: string | null;
  distance?: string;
  time?: string;
  midpoint?: [number, number];
}

type TooltipState = {
  show: boolean;
  x: number;
  y: number;
  content: { name: string; pos: [number, number] };
};

const TrekTrailMap: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarkerName, setSelectedMarkerName] = useState<string>("");
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    content: { name: "", pos: [0, 0] },
  });
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null
  );
  const [sceneMode] = useState<SceneMode>(SceneMode.SCENE3D);
  const [terrainProvider, setTerrainProvider] = useState<any>(null);
  const { slug } = useParams();

  const { data: trekDetailResponse } = useGetTrekBlogDetail(slug || "");

  // const kmlUrl = "/kmlFiles/demo-abc-I.kml";

  const kmlUrl = useMemo(() => {
    const path = trekDetailResponse?.data?.kmlFile?.path;
    if (!path) return null;
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/${cleanPath}`;
  }, [trekDetailResponse]);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const destinations = trekDetailResponse?.data?.destinations;
    if (destinations && destinations.length > 0) {
      const newMarkers: MarkerData[] = destinations.map((dest: any) => {
        // Defensive parsing of latLong to handle various data formats from the API
        let lat = 0,
          lng = 0;
        console.log(
          "Processing destination:",
          dest.name,
          "latLong:",
          dest.latLong,
          "type:",
          typeof dest.latLong
        );
        if (typeof dest.latLong === "string" && dest.latLong.includes(",")) {
          const parts = dest.latLong.split(",");
          lat = parseFloat(parts[0] || "0");
          lng = parseFloat(parts[1] || "0");
        } else if (Array.isArray(dest.latLong) && dest.latLong.length >= 2) {
          lat = parseFloat(dest.latLong[0] || "0");
          lng = parseFloat(dest.latLong[1] || "0");
        } else if (dest.latLong && typeof dest.latLong === "object") {
          lat = parseFloat(dest.latLong.lat || dest.latLong.latitude || 0);
          lng = parseFloat(
            dest.latLong.lng || dest.latLong.long || dest.latLong.longitude || 0
          );
        }
        return {
          position: [lat, lng],
          name: dest.name,
          description: dest.description,
          images: dest.images || [],
          locationKey: dest.id || dest._id,
          travelTimeToNext: dest.travelTimeToNext
            ? `${dest.travelTimeToNext} hr`
            : undefined,
        };
      });

      const pathCoords: [number, number][] = newMarkers.map((m) => m.position);
      const newPaths: PathData[] = [
        {
          path: pathCoords,
          name: "Main Trail",
          description: "Trail generated from destinations",
        },
      ];

      setMarkers(newMarkers);
      setPaths(newPaths);
    }
  }, [trekDetailResponse]);

  useEffect(() => {
    const fetchKml = async () => {
      // Skip KML fetch if we already have destinations in the response
      if (trekDetailResponse?.data?.destinations?.length > 0 || !kmlUrl) return;

      console.log("Fetching KML from:", kmlUrl);
      try {
        const response = await axiosInstance.get(kmlUrl, {
          responseType: "text",
        });
        const text = response.data;
        console.log("KML content preview:", text.substring(0, 200));
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, "text/xml");

        const styleMap: { [key: string]: string | null } = {};
        const cascadingStyles = kml.getElementsByTagName("gx:CascadingStyle");
        for (let i = 0; i < cascadingStyles.length; i++) {
          const style = cascadingStyles[i];
          const styleId = style.getAttribute("kml:id");
          if (styleId) {
            const balloonStyle = style.getElementsByTagName("BalloonStyle")[0];
            if (balloonStyle) {
              const textElement = balloonStyle.getElementsByTagName("text")[0];
              if (textElement) {
                styleMap[`#${styleId}`] =
                  textElement.textContent?.trim() || null;
              }
            }
          }
        }

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
                const styleUrl =
                  pair.getElementsByTagName("styleUrl")[0]?.textContent;
                if (styleUrl && styleMap[styleUrl]) {
                  styleMap[`#${styleMapId}`] = styleMap[styleUrl];
                  break;
                }
              }
            }
          }
        }

        const placemarks = kml.getElementsByTagName("Placemark");
        const newMarkers: MarkerData[] = [];
        const newPaths: PathData[] = [];

        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const name =
            placemark.getElementsByTagName("name")[0]?.textContent || "";

          let description = null;
          const descElement = placemark.getElementsByTagName("description")[0];
          if (descElement) {
            description = descElement.textContent || descElement.innerHTML;
            description = description?.trim() || null;
          }

          if (!description) {
            const styleUrlElement =
              placemark.getElementsByTagName("styleUrl")[0];
            if (styleUrlElement) {
              const styleUrl = styleUrlElement.textContent?.trim();
              if (styleUrl && styleMap[styleUrl]) {
                description = styleMap[styleUrl];
              }
            }
          }

          const images: string[] = [];
          const imageTags = placemark.getElementsByTagName("gx:imageUrl");
          for (let j = 0; j < imageTags.length; j++) {
            let url = imageTags[j].textContent?.trim() || "";
            url = url.replace("{size}", "800");
            images.push(url);
          }

          const point = placemark.getElementsByTagName("Point")[0];
          if (point) {
            const coords = point
              .getElementsByTagName("coordinates")[0]
              ?.textContent?.trim();
            if (coords) {
              const [lng, lat] = coords.split(",").map(Number);
              newMarkers.push({
                position: [lat, lng],
                name,
                description,
                images,
              });
            }
          }

          const lineString = placemark.getElementsByTagName("LineString")[0];
          if (lineString) {
            const coordsRaw = lineString
              .getElementsByTagName("coordinates")[0]
              ?.textContent?.trim();
            if (coordsRaw) {
              const path: [number, number][] = coordsRaw
                .split(/\s+/)
                .map((coord) => {
                  const [lng, lat] = coord.split(",").map(Number);
                  return [lat, lng];
                });

              // Calculate total distance
              let totalDistance = 0;
              for (let j = 0; j < path.length - 1; j++) {
                const p1 = Cartesian3.fromDegrees(path[j][1], path[j][0]);
                const p2 = Cartesian3.fromDegrees(
                  path[j + 1][1],
                  path[j + 1][0]
                );
                totalDistance += Cartesian3.distance(p1, p2);
              }

              const distanceKm = (totalDistance / 1000).toFixed(2);
              // Estimate time (average trekking speed ~3km/h considering terrain)
              const hours = totalDistance / 3000;
              const timeStr =
                hours < 1
                  ? `${Math.round(hours * 60)} mins`
                  : `${hours.toFixed(1)} hrs`;

              // Find midpoint (point at half the distance)
              let currentDist = 0;
              let midpoint: [number, number] = path[0];
              for (let j = 0; j < path.length - 1; j++) {
                const p1 = Cartesian3.fromDegrees(path[j][1], path[j][0]);
                const p2 = Cartesian3.fromDegrees(
                  path[j + 1][1],
                  path[j + 1][0]
                );
                const d = Cartesian3.distance(p1, p2);
                if (currentDist + d >= totalDistance / 2) {
                  midpoint = path[j];
                  break;
                }
                currentDist += d;
              }

              newPaths.push({
                path,
                name,
                description,
                distance: `${distanceKm} km`,
                time: timeStr,
                midpoint,
              });
            }
          }
        }

        setMarkers(
          newMarkers.map((m, idx) => ({
            ...m,
            locationKey: getLocationIdFromHtml(m.description),
            // Add dummy travel time to next marker (except for the last one)
            travelTimeToNext:
              idx < newMarkers.length - 1
                ? `${(Math.random() * 4 + 1).toFixed(1)} hr`
                : undefined,
          }))
        );
        setPaths(newPaths);
      } catch (error) {
        console.error("Error fetching or parsing KML:", error);
      }
    };

    if (
      kmlUrl &&
      (!trekDetailResponse?.data?.destinations ||
        trekDetailResponse.data.destinations.length === 0)
    ) {
      fetchKml();
    }
  }, [kmlUrl, trekDetailResponse]);

  useEffect(() => {
    const initTerrain = async () => {
      try {
        const provider = await createWorldTerrainAsync();
        setTerrainProvider(provider);
      } catch (error) {
        console.error("Failed to load terrain:", error);
      }
    };
    initTerrain();
  }, []);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;

      // Zoom to the FIRST marker if available, otherwise zoom to all
      if (markers.length > 0) {
        const firstMarker = markers[0];
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            firstMarker.position[1],
            firstMarker.position[0],
            5000
          ),
          duration: 3,
        });
      } else if (paths.length > 0) {
        viewer.zoomTo(viewer.entities);
      }

      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

      // Left click to open drawer
      handler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (defined(pickedObject) && pickedObject.id instanceof Entity) {
          const entity = pickedObject.id;
          if (entity.properties && entity.properties.hasProperty("isMarker")) {
            setSelectedMarkerName(entity.name || "Unknown Location");
            setDrawerOpen(true);
          }
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      // Mouse move for tooltip
      handler.setInputAction((movement: any) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (defined(pickedObject) && pickedObject.id instanceof Entity) {
          const entity = pickedObject.id;
          if (entity.properties && entity.properties.hasProperty("isMarker")) {
            const cartesian = entity.position?.getValue(JulianDate.now());
            let displayPos: [number, number] = [0, 0];

            if (cartesian) {
              const cartographic = Cartographic.fromCartesian(cartesian);
              displayPos = [
                CesiumMath.toDegrees(cartographic.latitude),
                CesiumMath.toDegrees(cartographic.longitude),
              ];
            }

            setTooltip({
              show: true,
              x: movement.endPosition.x,
              y: movement.endPosition.y - 20,
              content: {
                name: entity.name || "",
                pos: displayPos,
              },
            });
            return;
          }
        }
        setTooltip((prev) => ({ ...prev, show: false }));
      }, ScreenSpaceEventType.MOUSE_MOVE);

      return () => {
        handler.destroy();
      };
    }
  }, [markers, paths]);

  return (
    <MiddleContentWrapper>
      <div style={{ height: "85vh", width: "100%", position: "relative" }}>
        <style>
          {`
          .cesium-viewer-bottom {
            display: none !important;
          }
        `}
        </style>
        <Viewer
          ref={viewerRef}
          full
          timeline={false}
          animation={false}
          baseLayerPicker={true}
          geocoder={false}
          navigationHelpButton={false}
          homeButton={false}
          sceneModePicker={true}
          infoBox={false}
          selectionIndicator={false}
          requestRenderMode={false}
          terrainProvider={terrainProvider}
          sceneMode={sceneMode}
        >
          <Scene requestRenderMode={false} logarithmicDepthBuffer={true} />
          {/* Render Trails */}
          {paths.map((trail, index) => (
            <Entity
              key={`path-${index}`}
              name={trail.name || ""}
              description={trail.description || ""}
            >
              <PolylineGraphics
                positions={trail.path.map(([lat, lng]) =>
                  Cartesian3.fromDegrees(lng, lat)
                )}
                width={4}
                material={Color.fromCssColorString("#ff2dc0fb")}
                clampToGround={true}
              />
              {trail.midpoint && (
                <Entity
                  position={Cartesian3.fromDegrees(
                    trail.midpoint[1],
                    trail.midpoint[0]
                  )}
                >
                  <LabelGraphics
                    text={`Total Trail: ${trail.distance} | Est. Time: ${trail.time}`}
                    font="bold 12px sans-serif"
                    fillColor={Color.WHITE}
                    outlineColor={Color.BLACK}
                    outlineWidth={2}
                    style={2}
                    verticalOrigin={VerticalOrigin.BOTTOM}
                    pixelOffset={{ x: 0, y: -10 } as any}
                    showBackground={true}
                    backgroundColor={new Color(0, 0, 0, 0.7)}
                    distanceDisplayCondition={{ near: 0, far: 100000 } as any}
                    disableDepthTestDistance={Number.POSITIVE_INFINITY}
                    eyeOffset={new Cartesian3(0, 0, -50)}
                  />
                </Entity>
              )}
            </Entity>
          ))}

          {/* Render Markers */}
          {markers.map((marker, index) => (
            <React.Fragment key={`marker-fragment-${index}`}>
              <Entity
                onClick={() => {
                  setSelectedMarkerName(marker.name || "Unknown Location");
                  setDrawerOpen(true);
                }}
                onMouseEnter={() => {
                  setHoveredMarkerIndex(index);
                  if (viewerRef.current?.cesiumElement) {
                    viewerRef.current.cesiumElement.scene.canvas.style.cursor =
                      "pointer";
                  }
                }}
                onMouseLeave={() => {
                  setHoveredMarkerIndex(null);
                  if (viewerRef.current?.cesiumElement) {
                    viewerRef.current.cesiumElement.scene.canvas.style.cursor =
                      "default";
                  }
                }}
                name={marker.name || "Unknown Location"}
                position={Cartesian3.fromDegrees(
                  marker.position[1],
                  marker.position[0]
                )}
                properties={{
                  isMarker: true,
                  position: marker.position,
                  images: marker.images,
                }}
              >
                <BillboardGraphics
                  image={markerIcon}
                  width={32}
                  height={42}
                  verticalOrigin={VerticalOrigin.BOTTOM}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  eyeOffset={new Cartesian3(0, 0, -10)}
                  heightReference={HeightReference.CLAMP_TO_GROUND}
                />

                <LabelGraphics
                  text={marker.name || ""}
                  font="14px sans-serif"
                  fillColor={Color.WHITE}
                  outlineColor={Color.BLACK}
                  outlineWidth={2}
                  style={2}
                  verticalOrigin={VerticalOrigin.BOTTOM}
                  pixelOffset={{ x: 0, y: -45 } as any}
                  showBackground={true}
                  backgroundColor={new Color(0, 0, 0, 0.5)}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  eyeOffset={new Cartesian3(0, 0, -20)}
                  heightReference={HeightReference.CLAMP_TO_GROUND}
                />
              </Entity>

              {/* Draw straight line to next marker with distance/time ONLY when hovered */}
              {index < markers.length - 1 && hoveredMarkerIndex === index && (
                <>
                  <Entity>
                    <PolylineGraphics
                      positions={[
                        Cartesian3.fromDegrees(
                          marker.position[1],
                          marker.position[0]
                        ),
                        Cartesian3.fromDegrees(
                          markers[index + 1].position[1],
                          markers[index + 1].position[0]
                        ),
                      ]}
                      width={3}
                      material={Color.YELLOW}
                    />
                  </Entity>

                  {/* Midpoint Label for the straight line */}
                  <Entity
                    position={Cartesian3.fromDegrees(
                      (marker.position[1] + markers[index + 1].position[1]) / 2,
                      (marker.position[0] + markers[index + 1].position[0]) / 2
                    )}
                  >
                    <LabelGraphics
                      text={`Next Leg: ${(
                        Cartesian3.distance(
                          Cartesian3.fromDegrees(
                            marker.position[1],
                            marker.position[0]
                          ),
                          Cartesian3.fromDegrees(
                            markers[index + 1].position[1],
                            markers[index + 1].position[0]
                          )
                        ) / 1000
                      ).toFixed(1)} km (${marker.travelTimeToNext})`}
                      font="bold 12px sans-serif"
                      fillColor={Color.YELLOW}
                      outlineColor={Color.BLACK}
                      outlineWidth={2}
                      style={2}
                      verticalOrigin={VerticalOrigin.CENTER}
                      showBackground={true}
                      backgroundColor={new Color(0, 0, 0, 0.8)}
                      disableDepthTestDistance={Number.POSITIVE_INFINITY}
                      eyeOffset={new Cartesian3(0, 0, -30)}
                    />
                  </Entity>
                </>
              )}
            </React.Fragment>
          ))}
        </Viewer>

        {/* Ant Design Tooltip */}
        <Tooltip
          title={
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>{tooltip.content.name} </div>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>
                {tooltip.content.pos[0].toFixed(4)}°N,{" "}
                {tooltip.content.pos[1].toFixed(4)}°E
              </div>
            </div>
          }
          open={tooltip.show}
          placement="top"
          overlayStyle={{ pointerEvents: "none" }}
        >
          <div
            style={{
              position: "absolute",
              top: tooltip.y,
              left: tooltip.x,
              width: "1px",
              height: "1px",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        </Tooltip>

        {/* Map Title Overlay */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            padding: "12px 20px",
            borderRadius: "12px",
            color: "white",
            zIndex: 100,
            pointerEvents: "none",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            3D Trek Trail
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>
            Powered by Package Nepal
          </p>
        </div>

        <TrailLocationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedMarkerName}
        />

        {/* Zoom Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Space direction="vertical">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                if (viewerRef.current?.cesiumElement) {
                  viewerRef.current.cesiumElement.camera.zoomIn(
                    viewerRef.current.cesiumElement.camera.positionCartographic
                      .height * 0.5
                  );
                }
              }}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            />
            <Button
              type="primary"
              icon={<MinusOutlined />}
              onClick={() => {
                if (viewerRef.current?.cesiumElement) {
                  viewerRef.current.cesiumElement.camera.zoomOut(
                    viewerRef.current.cesiumElement.camera.positionCartographic
                      .height * 0.5
                  );
                }
              }}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            />
          </Space>
        </div>
      </div>
    </MiddleContentWrapper>
  );
};

export default TrekTrailMap;
