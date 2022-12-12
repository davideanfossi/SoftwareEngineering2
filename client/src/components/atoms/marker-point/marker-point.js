import { Marker } from "react-leaflet";
import Leaflet from "leaflet";
import ParkingIconUrl from "./marker-parking-icon.svg";
import ParkingIconSelectedUrl from "./marker-parking-icon-selected.svg";
import HutIconUrl from "./marker-hut-icon.svg";
import HutIconSelectedUrl from "./marker-hut-icon-selected.svg";
import LockedIconSelectedUrl from "./marker-icon-locked.svg";

const lockedIcon = Leaflet.icon({
  iconUrl: LockedIconSelectedUrl,
  iconAnchor: [25, 50],
  iconSize: [50, 50],
});

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
  alreadySelected,
  onClickHandle,
  isParking = false,
}) => {
  const icon = alreadySelected ? lockedIcon : (isParking ? parkingIcon : hutIcon);
  const selectedIcon = alreadySelected ? lockedIcon : (isParking ? selectedParkingIcon : selectedHutIcon);
  return (
    <Marker
      position={[point.latitude, point.longitude]}
      icon={selected ? selectedIcon : icon}
      eventHandlers={{
        click: () => {
          if (!alreadySelected) {
            onClickHandle();
          }
        },
      }}
    ></Marker>
  );
};
