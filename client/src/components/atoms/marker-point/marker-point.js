import { Marker } from "react-leaflet";
import Leaflet from "leaflet";
import ParkingIconUrl from "./marker-parking-icon.svg";
import ParkingIconSelectedUrl from "./marker-parking-icon-selected.svg";
import HutIconUrl from "./marker-hut-icon.svg";
import HutIconSelectedUrl from "./marker-hut-icon-selected.svg";

const hutIcon = Leaflet.icon({
  iconUrl: HutIconUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});
const selectedHutIcon = Leaflet.icon({
  iconUrl: HutIconSelectedUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});

const parkingIcon = Leaflet.icon({
  iconUrl: ParkingIconUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});
const selectedParkingIcon = Leaflet.icon({
  iconUrl: ParkingIconSelectedUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});

export const MarkerPoint = ({
  point,
  selected,
  onClickHandle,
  isParking = false,
}) => {
  const icon = isParking ? parkingIcon : hutIcon;
  const selectedIcon = isParking ? selectedParkingIcon : selectedHutIcon;
  return (
    <Marker
      position={[point.latitude, point.longitude]}
      icon={selected ? selectedIcon : icon}
      eventHandlers={{ click: () => onClickHandle() }}
    ></Marker>
  );
};
