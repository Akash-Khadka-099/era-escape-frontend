import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  ArcType,
  BoundingSphere,
  HeadingPitchRange,
  Ion,
} from "cesium";

// Initialize Cesium Ion token only when this component is loaded
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

import { Tooltip, Button, Space, Alert, message } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  AimOutlined,
  ExpandOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "cesium/Build/Cesium/Widgets/widgets.css";
import TrailLocationDrawer from "../TrailLocationDrawer";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  fetchDestinationHotels,
  useGetTrekBlogDetail,
} from "@/services/trekServices/trekServices";
import { apiEndpoints } from "@/services/apiEndpoints";
import { useParams } from "react-router-dom";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { useQueryClient } from "@tanstack/react-query";

// Premium Marker Icon
const markerIcon =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";

interface MarkerData {
  position: [number, number];
  name: string | null;
  description: string | null;
  images: string[];
  locationKey?: string;
  destinationSlug?: string | null;
  travelTimeToNext?: string;
  hasMultipleNextDestination?: boolean;
  routeTimes?: {
    timeToTravel: number;
    toPosition: [number, number];
    toTrailDestination: any;
  }[];
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

const TrekTrailMap: React.FC<{
  hideWrapper?: boolean;
  hideItinerary?: boolean;
}> = ({ hideWrapper = false, hideItinerary = false }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDestinationSlug, setSelectedDestinationSlug] =
    useState<string>("");
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    content: { name: "", pos: [0, 0] },
  });

  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null,
  );
  const [sceneMode] = useState<SceneMode>(SceneMode.SCENE3D);
  const [terrainProvider, setTerrainProvider] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const { data: trekDetailResponse } = useGetTrekBlogDetail(slug || "");

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

    // Use relative path to utilize Vite proxy and bypass CORS
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return cleanPath;
  }, [trekDetailResponse]);

  const viewerRef = useRef<any>(null);

  const handleOpenHotelsDrawer = useCallback(
    async (destinationSlug?: string | null) => {
      const safeDestinationSlug = destinationSlug?.trim();
      if (!slug || !safeDestinationSlug) {
        return;
      }

      try {
        await queryClient.fetchQuery({
          queryKey: [
            apiEndpoints.trekBlogs.fetchDestinationHotels,
            slug,
            safeDestinationSlug,
          ],
          queryFn: () =>
            fetchDestinationHotels({
              trekBlogSlug: slug,
              destinationSlug: safeDestinationSlug,
            }),
          retry: false,
          staleTime: 60 * 1000,
        });

        setSelectedDestinationSlug(safeDestinationSlug);
        setDrawerOpen(true);
      } catch (error: any) {
        // For 401, interceptor handles auth flow; keep drawer closed.
        if (error?.response?.status !== 401) {
          message.error("Unable to load destination hotels right now.");
        }
      }
    },
    [queryClient, slug],
  );

  const getPickedMarkerEntity = useCallback((pickedObject: any) => {
    // Cesium pick may place the entity on either `id` or `primitive.id`.
    const pickedEntity = pickedObject?.id || pickedObject?.primitive?.id;
    if (!pickedEntity?.properties?.hasProperty?.("isMarker")) {
      return null;
    }
    return pickedEntity;
  }, []);

  useEffect(() => {
    const destinations = trekDetailResponse?.data?.destinations;
    if (
      destinations &&
      Array.isArray(destinations) &&
      destinations?.length > 0
    ) {
      const parseLatLong = (latLong: any): [number, number] => {
        let lat = 0,
          lng = 0;

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
            latLong.lng || latLong.long || latLong.longitude || 0,
          );
        }
        return [lat, lng];
      };

      const newMarkers: MarkerData[] = destinations.map((dest: any) => {
        const [lat, lng] = parseLatLong(dest?.latLong);

        const routeTimeSource =
          dest?.multipleDestinationRouteTime?.length > 0
            ? dest.multipleDestinationRouteTime
            : dest?.routeTimes;

        const processedRouteTimes = routeTimeSource
          ?.filter((rt: any) => rt?.toTrailDestination?.latLong)
          ?.map((rt: any) => ({
            ...rt,
            toPosition: parseLatLong(rt?.toTrailDestination?.latLong),
          }));

        return {
          position: [lat, lng],
          name: dest?.name || "Unnamed Point",
          description: dest?.description,
          images: dest?.images || [],
          locationKey: dest?.locationKey || "",
          destinationSlug: dest?.slug || "",
          travelTimeToNext: dest?.travelTimeToNext
            ? `${dest.travelTimeToNext} hr`
            : undefined,
          hasMultipleNextDestination: dest?.hasMultipleNextDestination,
          routeTimes: processedRouteTimes,
        };
      });

      setMarkers(newMarkers);
    }
  }, [trekDetailResponse]);

  useEffect(() => {
    const fetchKml = async () => {
      if (!kmlUrl) {
        setPaths([]); // Clear paths if no KML
        return;
      }

      try {
        const response = await fetch(kmlUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        const parser = new DOMParser();
        const kml = parser.parseFromString(text, "text/xml");

        const parserError = kml.getElementsByTagName("parsererror")[0];
        if (parserError) {
          const errorMsg = `XML Parse Error: ${parserError.textContent?.slice(0, 50)}...`;
          console.error(errorMsg);
        }

        const newPathsFromKml: PathData[] = [];

        const getElements = (root: Element | Document, localName: string) => {
          const lowerName = localName.toLowerCase();
          const elements = root.getElementsByTagName(localName);
          if (elements.length > 0) return Array.from(elements);
          return Array.from(root.querySelectorAll(`*`)).filter(
            (el) => el.localName?.toLowerCase() === lowerName,
          );
        };

        const parseCoordinates = (coordsRaw: string): [number, number][] => {
          const tokens = coordsRaw
            .trim()
            .split(/[\s\n\r]+/)
            .filter((t) => t.trim().length > 0);

          if (tokens.some((t) => t.includes(","))) {
            return tokens
              .map((t) => {
                const parts = t.split(",").map((s) => s.trim());
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
          } else {
            const is3D = tokens.length % 3 === 0;
            const stride = is3D ? 3 : 2;
            const result: [number, number][] = [];
            for (let i = 0; i < tokens.length; i += stride) {
              if (i + 1 < tokens.length) {
                const lng = parseFloat(tokens[i]);
                const lat = parseFloat(tokens[i + 1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  result.push([lat, lng]);
                }
              }
            }
            return result;
          }
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
          description: string | null,
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
                  metadata?.name || "KML Trail Segment",
                  metadata?.description,
                ),
              );
            }
          }
        });

        const tracks = getElements(kml, "Track");
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
                metadata.description,
              ),
            );
          }
        });

        if (newPathsFromKml?.length === 0) {
          const coordRegex =
            /<[\w:]*coordinates[^>]*>([\s\S]*?)<\/[\w:]*coordinates>/gi;
          let match;
          while ((match = coordRegex.exec(text)) !== null) {
            const coordsRaw = match[1].trim();
            const path = parseCoordinates(coordsRaw);
            if (path.length > 5) {
              newPathsFromKml?.push(
                processPath(path, `Trail Segment (Regex)`, null),
              );
            }
          }
        }

        if (newPathsFromKml.length > 0) {
          setPaths(newPathsFromKml);
        } else {
          setPaths([]);
        }
      } catch (error: any) {
        console.error("Error fetching or parsing KML:", error);
        setPaths([]);
      }
    };

    if (kmlUrl) {
      fetchKml();
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

  const handleFitToTrail = useCallback(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    const points: Cartesian3[] = [];
    markers.forEach((m) =>
      points.push(Cartesian3.fromDegrees(m.position[1], m.position[0])),
    );
    paths.forEach((p) =>
      p.path.forEach((coord) =>
        points.push(Cartesian3.fromDegrees(coord[1], coord[0])),
      ),
    );

    if (points.length > 0) {
      const sphere = BoundingSphere.fromPoints(points);
      viewer.camera.flyToBoundingSphere(sphere, {
        duration: 3, // Premium cinematic duration
        offset: new HeadingPitchRange(
          0,
          CesiumMath.toRadians(-45),
          sphere.radius * 2.5,
        ),
      });
    } else {
      viewer.flyTo(viewer.entities, { duration: 3 });
    }
  }, [markers, paths]);

  const initialZoomRef = useRef(false);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const hasMarkers = markers.length > 0;
      const hasPaths = paths.length > 0;
      const isKmlExpected = !!kmlUrl;

      // If data is ready, and we haven't zoomed yet
      if (!initialZoomRef.current) {
        // If KML is expected, wait for paths. If not, wait for markers.
        if (isKmlExpected ? hasPaths : hasMarkers) {
          // Small delay for better UX (let the map settle first)
          const timeout = setTimeout(() => {
            handleFitToTrail();
            initialZoomRef.current = true;
          }, 800);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [markers, paths, kmlUrl, handleFitToTrail]);

  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.scene.globe.depthTestAgainstTerrain = true;

      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (!defined(pickedObject)) return;

        const entity = getPickedMarkerEntity(pickedObject);
        if (entity) {
          void handleOpenHotelsDrawer(
            entity.properties?.destinationSlug?.getValue?.(JulianDate.now()) ||
              "",
          );
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction((movement: any) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (!defined(pickedObject)) {
          setTooltip((prev) => ({ ...prev, show: false }));
          return;
        }

        const entity = getPickedMarkerEntity(pickedObject);
        if (entity) {
          const cartesian = entity.position?.getValue?.(JulianDate.now());
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

        setTooltip((prev) => ({ ...prev, show: false }));
      }, ScreenSpaceEventType.MOUSE_MOVE);

      return () => {
        handler.destroy();
      };
    }
  }, [markers, paths, kmlUrl, handleOpenHotelsDrawer, getPickedMarkerEntity]);

  const handleFocusToStart = () => {
    if (viewerRef.current?.cesiumElement) {
      let targetPosition: Cartesian3 | undefined;

      if (markers.length > 0) {
        const firstMarker = markers[0];
        targetPosition = Cartesian3.fromDegrees(
          firstMarker.position[1],
          firstMarker.position[0],
          5000,
        );
      } else if (paths.length > 0 && paths[0].path.length > 0) {
        const firstPoint = paths[0].path[0];
        targetPosition = Cartesian3.fromDegrees(
          firstPoint[1],
          firstPoint[0],
          5000,
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

  const mapContent = (
    <React.Fragment>
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
        <Button
          size="small"
          type="primary"
          icon={isMinimized ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? "Maximize" : "Minimize"}
        </Button>
      </div>
      {trekDetailResponse?.data?.isWalkedTrail === false && (
        <Alert
          message="This is an imaginary trail line drawn for reference purposes. We will be providing the real trail path in the near future."
          type="warning"
          banner
          showIcon
          icon={<InfoCircleOutlined />}
          style={{
            margin: "1rem 0",
          }}
        />
      )}
      <div
        style={{
          height: isMinimized ? "300px" : "85vh",
          width: "100%",
          position: "relative",
          transition: "height 0.3s ease",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
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
                  Cartesian3.fromDegrees(lng, lat),
                )}
                width={5}
                material={Color.DEEPSKYBLUE}
                clampToGround={true}
                arcType={ArcType.GEODESIC}
              />
              {trail.midpoint && (
                <Entity
                  position={Cartesian3.fromDegrees(
                    trail.midpoint[1],
                    trail.midpoint[0],
                  )}
                >
                  <LabelGraphics
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
                  marker.position[0],
                )}
                properties={{
                  isMarker: true,
                  position: marker.position,
                  images: marker.images,
                  destinationSlug: marker.destinationSlug,
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

              {/* Draw straight line to next marker(s) with distance/time ONLY when hovered */}
              {hoveredMarkerIndex === index && (
                <React.Fragment>
                  {marker.hasMultipleNextDestination &&
                  marker.routeTimes &&
                  marker.routeTimes.length > 0
                    ? marker.routeTimes.map((rt, rtIndex) => (
                        <React.Fragment key={`route-${index}-${rtIndex}`}>
                          <Entity>
                            <PolylineGraphics
                              positions={[
                                Cartesian3.fromDegrees(
                                  marker.position[1],
                                  marker.position[0],
                                ),
                                Cartesian3.fromDegrees(
                                  rt.toPosition[1],
                                  rt.toPosition[0],
                                ),
                              ]}
                              width={3}
                              material={Color.YELLOW}
                            />
                          </Entity>
                          <Entity
                            position={Cartesian3.fromDegrees(
                              (marker.position[1] + rt.toPosition[1]) / 2,
                              (marker.position[0] + rt.toPosition[0]) / 2,
                            )}
                          >
                            <LabelGraphics
                              text={`Estimated Time to ${rt?.toTrailDestination?.name || "next destination"}: ${rt.timeToTravel} hr`}
                              font="bold 12px sans-serif"
                              fillColor={Color.YELLOW}
                              outlineColor={Color.BLACK}
                              outlineWidth={2}
                              style={2}
                              verticalOrigin={VerticalOrigin.CENTER}
                              showBackground={true}
                              backgroundColor={new Color(0, 0, 0, 0.8)}
                              disableDepthTestDistance={
                                Number.POSITIVE_INFINITY
                              }
                              eyeOffset={new Cartesian3(0, 0, -30)}
                            />
                          </Entity>
                        </React.Fragment>
                      ))
                    : index < markers.length - 1 && (
                        <React.Fragment>
                          <Entity>
                            <PolylineGraphics
                              positions={[
                                Cartesian3.fromDegrees(
                                  marker.position[1],
                                  marker.position[0],
                                ),
                                Cartesian3.fromDegrees(
                                  markers[index + 1].position[1],
                                  markers[index + 1].position[0],
                                ),
                              ]}
                              width={3}
                              material={Color.YELLOW}
                            />
                          </Entity>

                          {/* Midpoint Label for the straight line */}
                          {marker.travelTimeToNext && (
                            <Entity
                              position={Cartesian3.fromDegrees(
                                (marker.position[1] +
                                  markers[index + 1].position[1]) /
                                  2,
                                (marker.position[0] +
                                  markers[index + 1].position[0]) /
                                  2,
                              )}
                            >
                              <LabelGraphics
                                text={`Estimated. Time: ${marker.travelTimeToNext}`}
                                font="bold 12px sans-serif"
                                fillColor={Color.YELLOW}
                                outlineColor={Color.BLACK}
                                outlineWidth={2}
                                style={2}
                                verticalOrigin={VerticalOrigin.CENTER}
                                showBackground={true}
                                backgroundColor={new Color(0, 0, 0, 0.8)}
                                disableDepthTestDistance={
                                  Number.POSITIVE_INFINITY
                                }
                                eyeOffset={new Cartesian3(0, 0, -30)}
                              />
                            </Entity>
                          )}
                        </React.Fragment>
                      )}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </Viewer>

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
            3D Trek Trail of {trekDetailResponse?.data?.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>
            Powered by Era Escape
          </p>
        </div>

        <TrailLocationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          destinationSlug={selectedDestinationSlug}
        />

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
                      .height * 0.5,
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
                      .height * 0.5,
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
      {!hideItinerary && (
        <div className="my-4">
          <ItineraryTimeline
            destinations={trekDetailResponse?.data?.destinations || []}
            onViewHotels={(slug) => {
              void handleOpenHotelsDrawer(slug);
            }}
          />
        </div>
      )}
    </React.Fragment>
  );

  return hideWrapper ? (
    mapContent
  ) : (
    <MiddleContentWrapper>{mapContent}</MiddleContentWrapper>
  );
};

export default TrekTrailMap;
