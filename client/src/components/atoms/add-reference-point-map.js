import { polyline, popup } from "leaflet";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Leaflet from "leaflet";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Circle,
  Marker,
  Popup,
} from "react-leaflet";
import { useParams } from "react-router";
import API from "../../API";
import { MarkerPoint } from "./marker-point/marker-point";
import { MarkerReferencePoint } from "./marker-reference-point";
import HutIconUrl from "./../atoms/marker-point/marker-hut-icon.svg";
import { InsertReferencePointTable } from "../moleculars/insert-reference-point-table";

export const AddReferencePointMap = ({
  start = false,
  end = false,
  changed,
  setChanged,
  selected,
  setSelected,
  markerUpdate,
}) => {

  const hutIcon = Leaflet.icon({
    iconUrl: HutIconUrl,
    iconAnchor: [25, 50],
    iconSize: [50, 50],
  });

  const [track, setTrack] = useState([]);
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  const [startPoint, setStartPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  const [endPoint, setEndPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  const [map, setMap] = useState(undefined);
  const [alreadySelected, setAlreadySelected] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [huts, setHuts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [parkings, setParkings] = useState([]);
  const [referenceList, setRefenceList] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    if (changed)
      API.getHikeDetails({ id }).then((elem) => {
        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
        let polyCenter = polyline(elem.track, { color: "red" })
          .getBounds()
          .getCenter();
        console.log(polyCenter);
        setCenter([polyCenter.lat, polyCenter.lng]);
        setTrack(elem.track);
      });
  }, [end, id, start, changed]);

  useEffect(() => {
    start &&
      API.getParkingHutStartPoint(id).then((res) => {
        setHuts(res.huts);
        setParkings(res.parkings);
        if (res.selected.length !== 0) {
          setAlreadySelected(res.selected);
        }
      });
    end &&
      API.getParkingHutEndPoint(id).then((res) => {
        setHuts(res.huts);
        setParkings(res.parkings);
        if (res.selected.length !== 0) {
          setAlreadySelected(res.selected);
        }
      });
  }, [end, id, start, markerUpdate]);

  useEffect(() => {
    if (map) {
      map.setView(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map && changed) {
      map.invalidateSize(false);
      setChanged(false);
    }
  });
  const onClickHut = (id) => {
    setSelected((prev) =>
      prev.type === "hut" && prev.id === id
        ? { type: undefined, id: -1 }
        : { type: "hut", id }
    );
  };
  const onClickParking = (id) => {
    setSelected((prev) =>
      prev.type === "parking" && prev.id === id
        ? { type: undefined, id: -1 }
        : { type: "parking", id }
    );
  };

  const onClickRefPoint = (id) => {};

  return (
    <div style={{ width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{ height: "50vh" }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={track}
          eventHandlers={{
            click: (e, what) => {
              setAlreadySelected([
                ...alreadySelected,
                {
                  pos: e.latlng,
                  description: "",
                },
              ]);
              console.log(e, what);
            },
          }}
        />
        {alreadySelected.map((refPoint, idx) => (
          <>
            <Marker
              key={"refPointMap" + idx}
              position={[refPoint.pos.lat,refPoint.pos.lng]}
              icon={hutIcon}
             >
             <Popup style={{ borderRadius: 0 }}>
              <Container>
                <Row>
                  <Col className="text-center fw-bold">Name:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{idx}</Col>
                </Row>
                <Row>
                  <Col className="text-center fw-bold">description:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{refPoint.description}</Col>
                </Row>
              </Container>
            </Popup> 
            </Marker>
          </>
        ))}



          {/* {alreadySelected.map((parking, idx) => (
          <MarkerPoint
            key={parking.id}
            point={parking.point}
            alreadySelected={
              alreadySelected.filter(
                (elem) => elem.type === "parking" && elem.id === parking.id
              ).length > 0
            }
            selected={selected.type === "parking" && parking.id === selected.id}
            onClickHandle={() => onClickParking(parking.id)}
            isParking
          />
        ))} */}

        {start && (
          <MarkerReferencePoint point={startPoint} isReference={false} />
        )}
        {end && <MarkerReferencePoint point={endPoint} isReference={false} />}
      </MapContainer>
      <Container className="hike-row">
        <Row>
          <Col className="d-flex justify-content-center fw-bold">
            {selected.type !== undefined
              ? `You selected this ${selected.type}:`
              : "Click anywhere on the track to add a reference point"}
          </Col>
        </Row>
      </Container>
        
        <InsertReferencePointTable key={"ref-table"} referencePointList={alreadySelected}/>
        
    </div>
  );
};
//huts.filter((elem) => elem.id === selectedHut)[0].name
