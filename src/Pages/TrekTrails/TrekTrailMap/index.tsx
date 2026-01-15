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
import {
  PlusOutlined,
  MinusOutlined,
  AimOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import "cesium/Build/Cesium/Widgets/widgets.css";
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
  destinationSlug?: string | null;
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
  const [slectedDestinationSlug, setSelectedDestinationSlug] = useState<string>("");
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    content: { name: "", pos: [0, 0] },
  });

  console.log("markers",markers)
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null
  );
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setDebugLogs((prev) => [...prev.slice(-4), msg]); // Keep last 5 logs
  const [sceneMode] = useState<SceneMode>(SceneMode.SCENE3D);
  const [terrainProvider, setTerrainProvider] = useState<any>(null);
  const { slug } = useParams();

  console.warn("kml fetch debugs", debugLogs);
  const { data: trekDetailResponse } = useGetTrekBlogDetail(slug || "");

  // const kmlUrl = "/kmlFiles/demo-abc-I.kml";

  const kmlUrl = useMemo(() => {
    const kmlFile = trekDetailResponse?.data?.kmlFile;
    if (!kmlFile) return null;

    let path = "";
    if (typeof kmlFile === "string") {
      path = kmlFile;
    } else if (Array.isArray(kmlFile) && kmlFile.length > 0) {
      path = kmlFile?.[0]?.path as string;
    } else if (typeof kmlFile === "object") {
      path = kmlFile?.path;
    }

    if (!path) return null;
    if (path.startsWith("http")) return path;

    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // In development, use relative path to leverage Vite proxy and avoid CORS
    if (import.meta.env.DEV) {
      return `/${cleanPath}`;
    }

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

        const latLong = dest?.latLong;

        if (typeof latLong === "string" && latLong.includes(",")) {
          const parts = latLong.split(",");
          lat = parseFloat(parts[0] || "0");
          lng = parseFloat(parts[1] || "0");
        } else if (Array.isArray(latLong) && latLong.length >= 2) {
          lat = parseFloat(latLong[0] || "0");
          lng = parseFloat(latLong[1] || "0");
        } else if (latLong && typeof latLong === "object") {
          lat = parseFloat(latLong.lat || latLong.latitude || 0);
          lng = parseFloat(
            latLong.lng || latLong.long || latLong.longitude || 0
          );
        }
        return {
          position: [lat, lng],
          name: dest?.name,
          description: dest?.description,
          images: dest?.images || [],
          locationKey: dest?.locationKey || "",
          destinationSlug: dest?.slug || "",
          travelTimeToNext: dest?.travelTimeToNext
            ? `${dest.travelTimeToNext} hr`
            : undefined,
        };
      });

      setMarkers(newMarkers);
      setPaths([]); // Clear paths to ensure we only show KML trails
    }
  }, [trekDetailResponse]);

  useEffect(() => {
    const fetchKml = async () => {
      if (!kmlUrl) {
        addLog("No KML URL found.");
        return;
      }

      addLog(`Fetching KML: ${kmlUrl.split("/").pop()}`);
      try {
        const response = await axiosInstance.get(kmlUrl, {
          responseType: "text",
        });
        const text = response.data;
        addLog(`KML Loaded: ${text.length} chars`);

        const parser = new DOMParser();
        const kml = parser.parseFromString(text, "text/xml");

        const parserError = kml.getElementsByTagName("parsererror")[0];
        if (parserError) {
          addLog(
            `XML Parse Error: ${parserError.textContent?.slice(0, 50)}...`
          );
        }

        const newPathsFromKml: PathData[] = [];

        const getElements = (root: Element | Document, localName: string) => {
          const lowerName = localName.toLowerCase();
          const elements = root.getElementsByTagName(localName);
          if (elements.length > 0) return Array.from(elements);
          return Array.from(root.querySelectorAll(`*`)).filter(
            (el) => el.localName?.toLowerCase() === lowerName
          );
        };

        const parseCoordinates = (coordsRaw: string): [number, number][] => {
          return coordsRaw
            .trim()
            .split(/[\s\n\r]+/)
            .map((coord) => {
              const parts = coord.split(",").map((s) => s.trim());
              if (parts.length >= 2) {
                const lng = parseFloat(parts[0]);
                const lat = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  return [lat, lng] as [number, number];
                }
              }
              return null;
            })
            .filter((p): p is [number, number] => p !== null);
        };

        const findParentMetadata = (el: Element) => {
          let parent = el.parentElement;
          while (
            parent &&
            parent.localName?.toLowerCase() !== "placemark" &&
            parent.localName?.toLowerCase() !== "kml"
          ) {
            parent = parent.parentElement;
          }
          const name = parent
            ? parent.getElementsByTagName("name")[0]?.textContent || ""
            : "";
          const description = parent
            ? parent.getElementsByTagName("description")[0]?.textContent || null
            : null;
          return { parent, name, description };
        };

        const processPath = (
          path: [number, number][],
          name: string,
          description: string | null
        ): PathData => {
          let totalDistance = 0;
          for (let k = 0; k < path.length - 1; k++) {
            const p1 = Cartesian3.fromDegrees(path[k][1], path[k][0]);
            const p2 = Cartesian3.fromDegrees(path[k + 1][1], path[k + 1][0]);
            totalDistance += Cartesian3.distance(p1, p2);
          }

          const distanceKm = (totalDistance / 1000).toFixed(2);
          const hours = totalDistance / 3000;
          const timeStr =
            hours < 1
              ? `${Math.round(hours * 60)} mins`
              : `${hours.toFixed(1)} hrs`;

          let currentDist = 0;
          let midpoint: [number, number] = path[0];
          for (let k = 0; k < path.length - 1; k++) {
            const p1 = Cartesian3.fromDegrees(path[k][1], path[k][0]);
            const p2 = Cartesian3.fromDegrees(path[k + 1][1], path[k + 1][0]);
            const d = Cartesian3.distance(p1, p2);
            if (currentDist + d >= totalDistance / 2) {
              midpoint = path[k];
              break;
            }
            currentDist += d;
          }

          return {
            path,
            name: name || "KML Trail Segment",
            description,
            distance: `${distanceKm} km`,
            time: timeStr,
            midpoint,
          };
        };

        const lineStrings = getElements(kml, "LineString");
        addLog(`Found ${lineStrings.length} LineStrings`);
        lineStrings.forEach((ls) => {
          const coordsElement = getElements(ls, "coordinates")[0];
          const coordsRaw = coordsElement?.textContent?.trim();
          if (coordsRaw) {
            const path = parseCoordinates(coordsRaw);
            if (path.length > 1) {
              const metadata = findParentMetadata(ls);
              newPathsFromKml.push(
                processPath(
                  path,
                  metadata.name || "KML Trail Segment",
                  metadata.description
                )
              );
            }
          }
        });

        const tracks = getElements(kml, "Track");
        addLog(`Found ${tracks.length} Tracks`);
        tracks.forEach((track) => {
          const coordElements = getElements(track, "coord");
          const path: [number, number][] = coordElements
            .map((el) => {
              const coordStr = el.textContent?.trim();
              if (coordStr) {
                const parts = coordStr.split(/[\s,]+/).map((s) => s.trim());
                if (parts.length >= 2) {
                  const lng = parseFloat(parts[0]);
                  const lat = parseFloat(parts[1]);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    return [lat, lng] as [number, number];
                  }
                }
              }
              return null;
            })
            .filter((p): p is [number, number] => p !== null);

          if (path.length > 1) {
            const metadata = findParentMetadata(track);
            newPathsFromKml.push(
              processPath(
                path,
                metadata.name || "KML Track Segment",
                metadata.description
              )
            );
          }
        });

        if (newPathsFromKml.length === 0) {
          addLog("No XML paths. Trying Regex...");
          const coordRegex =
            /<[\w:]*coordinates[^>]*>([\s\S]*?)<\/[\w:]*coordinates>/gi;
          let match;
          while ((match = coordRegex.exec(text)) !== null) {
            const coordsRaw = match[1].trim();
            const path = parseCoordinates(coordsRaw);
            if (path.length > 5) {
              newPathsFromKml.push(
                processPath(path, `Trail Segment (Regex)`, null)
              );
            }
          }
        }

        addLog(`Total Paths: ${newPathsFromKml.length}`);
        if (newPathsFromKml.length > 0) {
          setPaths(newPathsFromKml);
        } else {
          addLog("No valid paths found.");
        }
      } catch (error: any) {
        console.error("Error fetching or parsing KML:", error);
        addLog(`Error: ${error.message}`);
      }
    };

    if (kmlUrl) {
      fetchKml();
    } else {
      addLog("Waiting for KML URL...");
    }
  }, [kmlUrl]);

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
      if (paths.length > 0) {
        viewer.flyTo(viewer.entities, { duration: 3 });
      } else if (markers.length > 0) {
        const firstMarker = markers[0];
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            firstMarker.position[1],
            firstMarker.position[0],
            5000
          ),
          duration: 3,
        });
      }

      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

      // Left click to open drawer
      handler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (defined(pickedObject) && pickedObject.id instanceof Entity) {
          const entity = pickedObject.id;
          if (entity.properties && entity.properties.hasProperty("isMarker")) {
            setSelectedDestinationSlug(entity?.slug);
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

  const handleFocusToStart = () => {
    if (viewerRef.current?.cesiumElement) {
      let targetPosition: Cartesian3 | undefined;

      if (markers.length > 0) {
        const firstMarker = markers[0];
        targetPosition = Cartesian3.fromDegrees(
          firstMarker.position[1],
          firstMarker.position[0],
          5000
        );
      } else if (paths.length > 0 && paths[0].path.length > 0) {
        // Fallback to first point of the first path if no markers
        const firstPoint = paths[0].path[0];
        targetPosition = Cartesian3.fromDegrees(
          firstPoint[1],
          firstPoint[0],
          5000
        );
      }

      if (targetPosition) {
        viewerRef.current.cesiumElement.camera.flyTo({
          destination: targetPosition,
          duration: 2,
        });
      }
    }
  };

  const handleFitToTrail = () => {
    if (viewerRef.current?.cesiumElement) {
      viewerRef.current.cesiumElement.flyTo(
        viewerRef.current.cesiumElement.entities,
        {
          duration: 2,
        }
      );
    }
  };

  return (
    <MiddleContentWrapper>
      {/* Navigation Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <Button
          type="primary"
          size="small"
          icon={<AimOutlined />}
          onClick={handleFocusToStart}
        >
          Focus to Start
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<ExpandOutlined />}
          onClick={handleFitToTrail}
        >
          Fit to Trail
        </Button>
      </div>
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
                width={5}
                material={Color.DEEPSKYBLUE}
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
                  setSelectedDestinationSlug(marker?.destinationSlug || "Unknown Location");
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
          destinationSlug={slectedDestinationSlug}
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
