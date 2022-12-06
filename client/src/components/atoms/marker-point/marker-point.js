import { Marker } from "react-leaflet";
import Leaflet from "leaflet";
import IconUrl from "./marker-icon.svg";
import IconSelectedUrl from "./marker-icon-selected.svg";
const icon = Leaflet.icon({
  iconUrl: IconUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});
const selectedIcon = Leaflet.icon({
  iconUrl: IconSelectedUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});

export const MarkerPoint = ({ point, selected, onClickHandle }) => {
  return (
    <Marker
      position={[point.latitude, point.longitude]}
      icon={selected ? selectedIcon : icon}
      eventHandlers={{ click: () => onClickHandle() }}
    >
    </Marker>
  );
};
