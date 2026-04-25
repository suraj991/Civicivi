"use client";

import { useState, useCallback, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const COLORS = {
  default: "#0d1f2d",
  hover: "#0e5f78",
  selected: "#0891b2",
  stroke: "#0ea5e9",
  strokeHover: "#22d3ee",
  strokeSelected: "#67e8f9",
};

interface Props {
  selectedFips: string | null;
  onStateClick: (fips: string) => void;
  onStateHover: (fips: string | null, x?: number, y?: number) => void;
}

export default function MapChart({ selectedFips, onStateClick, onStateHover }: Props) {
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(
    (geo: { id: string }, evt: React.MouseEvent) => {
      setHoveredFips(geo.id);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        onStateHover(geo.id, evt.clientX - rect.left, evt.clientY - rect.top);
      }
    },
    [onStateHover]
  );

  const handleMouseMove = useCallback(
    (geo: { id: string }, evt: React.MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        onStateHover(geo.id, evt.clientX - rect.left, evt.clientY - rect.top);
      }
    },
    [onStateHover]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredFips(null);
    onStateHover(null);
  }, [onStateHover]);

  const handleClick = useCallback(
    (geo: { id: string }) => {
      onStateClick(geo.id);
    },
    [onStateClick]
  );

  const getFill = (fips: string) => {
    if (fips === selectedFips) return COLORS.selected;
    if (fips === hoveredFips) return COLORS.hover;
    return COLORS.default;
  };

  const getStroke = (fips: string) => {
    if (fips === selectedFips) return COLORS.strokeSelected;
    if (fips === hoveredFips) return COLORS.strokeHover;
    return COLORS.stroke;
  };

  const getStrokeWidth = (fips: string) => {
    if (fips === selectedFips) return 1.5;
    if (fips === hoveredFips) return 1;
    return 0.4;
  };

  return (
    <div ref={containerRef} className="w-full" style={{ lineHeight: 0 }}>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        style={{ width: "100%", height: "auto" }}
        viewBox="0 0 800 500"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = geo.id as string;
              const isSelected = fips === selectedFips;
              const isHovered = fips === hoveredFips;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getFill(fips)}
                  stroke={getStroke(fips)}
                  strokeWidth={getStrokeWidth(fips)}
                  style={{
                    default: {
                      outline: "none",
                      filter: isSelected
                        ? "drop-shadow(0 0 8px rgba(8,145,178,0.6))"
                        : isHovered
                        ? "drop-shadow(0 0 4px rgba(14,95,120,0.4))"
                        : "none",
                      transition: "fill 0.15s ease, filter 0.15s ease",
                    },
                    hover: { outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(evt) => handleMouseEnter(geo, evt as unknown as React.MouseEvent)}
                  onMouseMove={(evt) => handleMouseMove(geo, evt as unknown as React.MouseEvent)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(geo)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
