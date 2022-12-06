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
  const [selected, setSelected] = useState(-1);
  // eslint-disable-next-line no-unused-vars
  const [referencePointList, setReferencePointsList] = useState([
    { id: 1, latitude: 45.319959, longitude: 7.304834, name: "test1" },
    { id: 2, latitude: 45.316959, longitude: 7.306834, name: "test2" },
    { id: 3, latitude: 45.313959, longitude: 7.302834, name: "test3" },
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
  const onClickHandle = (id) => {
    setSelected((prev) => (prev !== id ? id : -1));
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
        {referencePointList.map((point) => (
          <MarkerPoint
            key={point.id}
            point={point}
            selected={point.id === selected}
            onClickHandle={() => onClickHandle(point.id)}
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
            {selected !== -1
              ? "You selected:"
              : "Click on a marker to select it"}
          </Col>
        </Row>
        {selected !== -1 && (
          <Row>
            <Col className="d-flex justify-content-center">
              {
                referencePointList.filter((elem) => elem.id === selected)[0]
                  .name
              }
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};
