import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer, Circle } from "react-leaflet";
import { useParams } from "react-router";
import API from "../../API";
import { MarkerPoint } from "./marker-point/marker-point";
import { MarkerReferencePoint } from "./marker-reference-point";

export const LinkPointMap = ({
  start = false,
  end = false,
  changed,
  setChanged,
  selected,
  setSelected,
  markerUpdate
}) => {
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
  const [huts, setHuts] = useState([
    {
      id: 1,
      point: { latitude: 45.319959, longitude: 7.304834 },
      name: "hut1",
    },
    {
      id: 2,
      point: { latitude: 45.316959, longitude: 7.306834 },
      name: "hut2",
    },
    {
      id: 3,
      point: { latitude: 45.313959, longitude: 7.302834 },
      name: "hut3",
    },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [parkings, setParkings] = useState([
    {
      id: 1,
      point: { latitude: 45.319959, longitude: 7.302834 },
      name: "parking1",
    },
    {
      id: 2,
      point: { latitude: 45.316959, longitude: 7.301834 },
      name: "parking2",
    },
    {
      id: 3,
      point: { latitude: 45.313959, longitude: 7.306834 },
      name: "parking3",
    },
  ]);
  const { id } = useParams();

  useEffect(() => {
    if (changed)
      API.getHikeDetails({ id }).then((elem) => {
        if (start)
          setCenter([elem.startPoint.latitude, elem.startPoint.longitude]);
        if (end) setCenter([elem.endPoint.latitude, elem.endPoint.longitude]);
        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
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
  return (
    <div style={{ width: "100%" }}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{ height: "50vh" }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle center={center} radius={1000} />
        <Polyline positions={track} />
        {huts.map((hut) => (
          <MarkerPoint
            key={hut.id}
            point={hut.point}
            alreadySelected={
              alreadySelected.filter(
                (elem) => elem.type === "hut" && elem.id === hut.id
              ).length > 0
            }
            selected={selected.type === "hut" && hut.id === selected.id}
            onClickHandle={() => onClickHut(hut.id)}
          />
        ))}

        {parkings.map((parking) => (
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
        ))}

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
              : "Click on a red marker to select an hut or on a blue marker to select a parking"}
          </Col>
        </Row>
        {selected.type !== undefined && (
          <Row>
            <Col className="d-flex justify-content-center">
              {selected.type === "hut" &&
                huts.filter((elem) => elem.id === selected.id)[0].name}
              {selected.type === "parking" &&
                parkings.filter((elem) => elem.id === selected.id)[0].name}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};
//huts.filter((elem) => elem.id === selectedHut)[0].name
