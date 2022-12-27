import { polyline } from "leaflet";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Leaflet from "leaflet";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { useParams } from "react-router";
import API from "../../API";
import HutIconUrl from "./../atoms/marker-point/marker-hut-icon.svg";
import { InsertReferencePointTable } from "../moleculars/insert-reference-point-table";
import { MarkerReferencePoint } from "./marker-reference-point";

export const AddReferencePointMap = ({
  changed,
  setChanged,
  setAlreadySelected,
  alreadySelected,
}) => {
  const updateList = (rp) => {
    const oldList = [...alreadySelected];
    const newList = oldList.filter((p) => p.pos !== rp.pos);
    setAlreadySelected(newList);
  };

  const hutIcon = Leaflet.icon({
    iconUrl: HutIconUrl,
    iconAnchor: [25, 50],
    iconSize: [50, 50],
  });

  const [track, setTrack] = useState([]);
  const [center, setCenter] = useState([45.0702899, 7.6348208]);
  // eslint-disable-next-line no-unused-vars
  const [startPoint, setStartPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  // eslint-disable-next-line no-unused-vars
  const [endPoint, setEndPoint] = useState({
    latitude: 45.0702899,
    longitude: 7.6348208,
  });
  const [map, setMap] = useState(undefined);

  // eslint-disable-next-line no-unused-vars
  const [huts, setHuts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [parkings, setParkings] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    if (changed)
      API.getHikeDetails({ id }).then((elem) => {
        setStartPoint(elem.startPoint);
        setEndPoint(elem.endPoint);
        let polyCenter = polyline(elem.track, { color: "red" })
          .getBounds()
          .getCenter();
        setCenter([polyCenter.lat, polyCenter.lng]);
        setTrack(elem.track);
      });
  }, [id, changed]);

  useEffect(() => {
    API.getParkingHutStartPoint(id).then((res) => {
      setHuts(res.huts);
      setParkings(res.parkings);
      if (res.selected.length !== 0) {
        setAlreadySelected(res.selected);
      }
    });
    // eslint-disable-next-line
  }, [id]);

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
            click: (e) => {
              setAlreadySelected([
                ...alreadySelected,
                {
                  id: alreadySelected.length,
                  pos: e.latlng,
                  name: "",
                  description: "",
                },
              ]);
            },
          }}
        />
        {alreadySelected.map((refPoint, idx) => (
          <>
            <Marker
              key={"refPointMap" + refPoint.id}
              position={[refPoint.pos.lat, refPoint.pos.lng]}
              icon={hutIcon}
            >
              <Popup key={"refPointPopUp" + refPoint.id} style={{ borderRadius: 0 }}>
                <Container>
                  <Row>
                    <Col className="text-center fw-bold">Reference point</Col>
                  </Row>
                  <Row>
                    <Col className="text-center"># {idx}</Col>
                  </Row>
                  {/* <Row>
                  <Col className="text-center fw-bold">Name:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{refPoint.name}</Col>
                </Row>
                <Row>
                  <Col className="text-center fw-bold">description:</Col>
                </Row>
                <Row>
                  <Col className="text-center">{refPoint.description}</Col>
                </Row> */}
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
        <MarkerReferencePoint point={startPoint} isReference={false} />
        <MarkerReferencePoint point={endPoint} isReference={false} />
      </MapContainer>
      <Container className="hike-row">
        <Row>
          <Col className="d-flex justify-content-center fw-bold">
            Click anywhere on the track to add a reference point
          </Col>
        </Row>
      </Container>
      {alreadySelected.map((rp, idx) => (
        <Row>
          <InsertReferencePointTable
            key={"table" + rp.id}
            rp={rp}
            idx={idx}
            updateList={updateList}
          />
        </Row>
      ))}
    </div>
  );
};
//huts.filter((elem) => elem.id === selectedHut)[0].name
