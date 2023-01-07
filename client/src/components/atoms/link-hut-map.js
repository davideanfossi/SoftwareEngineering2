import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer} from "react-leaflet";
import { useParams } from "react-router";
import API from "../../API";
import { MarkerPoint } from "./marker-point/marker-point";
import { MarkerReferencePoint } from "./marker-reference-point";

export const LinkHutMap = ({
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

  const { id } = useParams();

  useEffect(() => {
    if (changed)
      API.getHikeDetails({ id }).then((elem) => {
        setCenter([
            (elem.startPoint.latitude + elem.endPoint.latitude) / 2,
            (elem.startPoint.longitude + elem.endPoint.longitude) / 2,
          ]);

        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
        setTrack(elem.track);
      });
  }, [id, changed]);

  useEffect(() => {
    API.getNearHuts(id).then((res) => {
    setHuts(res.huts);
    if (res.selected.length !== 0) {
        setAlreadySelected(res.selected);
    }
    });
  }, [id, markerUpdate]);

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

        <Polyline positions={track} />
        {huts.map((hut) => (
          <MarkerPoint
            key={hut.id}
            point={hut.point}
            alreadySelected={
              alreadySelected.filter(
                (elem) => elem.id === hut.id
              ).length > 0
            }
            selected={hut.id === selected.id}
            onClickHandle={() => onClickHut(hut.id)}
          />
        ))}


        <MarkerReferencePoint point={startPoint} isReference={false} />
        <MarkerReferencePoint point={endPoint} isReference={false} />
      </MapContainer>
      <Container className="hike-row">
        <Row>
          <Col className="d-flex justify-content-center fw-bold">
            {selected.type !== undefined
              ? `You selected this ${selected.type}:`
              : "Click on a red marker to select an hut"}
          </Col>
        </Row>
        {selected.type !== undefined && (
          <Row>
            <Col className="d-flex justify-content-center">
              {selected.type === "hut" &&
                huts.filter((elem) => elem.id === selected.id)[0].name}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};
