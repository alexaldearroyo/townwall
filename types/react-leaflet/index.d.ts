declare module 'react-leaflet' {
  import * as react from 'react';
  import * as leaflet from 'leaflet';

  export class MapContainer extends react.Component<
    leaflet.MapOptions & { children: react.ReactNode }
  > {}
  export class TileLayer extends react.Component<leaflet.TileLayerOptions> {}
  export class Marker extends react.Component<leaflet.MarkerOptions> {}
  export class Popup extends react.Component<leaflet.PopupOptions> {}
}
