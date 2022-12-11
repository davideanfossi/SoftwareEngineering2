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
  const [selectedHut, setSelectedHut] = useState(-1);
  const [selectedParking, setSelectedParking] = useState(-1);
  // eslint-disable-next-line no-unused-vars
  const [huts, setHuts] = useState([
    { id: 1, latitude: 45.319959, longitude: 7.304834, name: "hut1" },
    { id: 2, latitude: 45.316959, longitude: 7.306834, name: "hut2" },
    { id: 3, latitude: 45.313959, longitude: 7.302834, name: "hut3" },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [parkings, setParkings] = useState([
    { id: 1, latitude: 45.319959, longitude: 7.302834, name: "parking1" },
    { id: 2, latitude: 45.316959, longitude: 7.301834, name: "parking2" },
    { id: 3, latitude: 45.313959, longitude: 7.306834, name: "parking3" },
  ]);
  let { id } = useParams();

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
    setSelectedHut((prev) => (prev !== id ? id : -1));
  };
  const onClickParking = (id) => {
    setSelectedParking((prev) => (prev !== id ? id : -1));
  };
  return (
    <div style={{ width: "100%" }}>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        style={{ height: "50vh" }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle center={center} radius={500} />
        <Polyline positions={track} />
        {huts.map((point) => (
          <MarkerPoint
            key={point.id}
            point={point}
            selected={point.id === selectedHut}
            onClickHandle={() => onClickHut(point.id)}
          />
        ))}

        {parkings.map((point) => (
          <MarkerPoint
            key={point.id}
            point={point}
            selected={point.id === selectedParking}
            onClickHandle={() => onClickParking(point.id)}
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
            {selectedHut !== -1
              ? "You selected this hut:"
              : "Click on a red marker to select an hut"}
          </Col>
        </Row>
        {selectedHut !== -1 && (
          <Row>
            <Col className="d-flex justify-content-center">
              {huts.filter((elem) => elem.id === selectedHut)[0].name}
            </Col>
          </Row>
        )}
      </Container>
      <Container className="hike-row-even">
        <Row>
          <Col className="d-flex justify-content-center fw-bold">
            {selectedParking !== -1
              ? "You selected this parking:"
              : "Click on a blue marker to select a parking"}
          </Col>
        </Row>
        {selectedParking !== -1 && (
          <Row>
            <Col className="d-flex justify-content-center">
              {parkings.filter((elem) => elem.id === selectedParking)[0].name}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};
