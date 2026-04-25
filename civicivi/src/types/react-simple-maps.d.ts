declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGProps, MouseEventHandler } from "react";

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
    precision?: number;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    viewBox?: string;
    children?: ReactNode;
  }

  export interface GeographyStyle {
    default?: React.CSSProperties;
    hover?: React.CSSProperties;
    pressed?: React.CSSProperties;
  }

  export interface GeoObject {
    id: string;
    rsmKey: string;
    type: string;
    properties: Record<string, unknown>;
    geometry: unknown;
    arcs: unknown;
  }

  export interface GeographiesChildrenProps {
    geographies: GeoObject[];
  }

  export interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (props: GeographiesChildrenProps) => ReactNode;
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoObject;
    style?: GeographyStyle;
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: React.MouseEvent<SVGPathElement>) => void;
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Marker: ComponentType<{
    coordinates: [number, number];
    children?: ReactNode;
  }>;
}
