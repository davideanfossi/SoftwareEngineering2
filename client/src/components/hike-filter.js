import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import API from "../API";
import { FilterMap } from "./filter-map/filter-map";
import { MultiRangeSlider } from "./multi-range-slider/multi-range-slider";

export const HikeFilter = () => {
  const [radius, setRadius] = useState(1000);
  const [lat, setLat] = useState(45.0702899); //it is Turin!
  const [lon, setLon] = useState(7.6348208);
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(100);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(100);
  const [minExpectedTime, setMinExpectedTime] = useState(0);
  const [maxExpectedTime, setMaxExpectedTime] = useState(100);
  const [difficulty, setDifficulty] = useState(-1);

  const [absoluteMaxLength, setAbsoluteMaxLength] = useState(100);
  const [absoluteMaxHeight, setAbsoluteMaxHeight] = useState(100);
  const [absoluteMaxExpectedTime, setAbsoluteExpectedTime] = useState(100);
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);

  useEffect(() => {
    API.getHikesLimits()
      .then((limits) => {
        setMaxLength(limits.maxLength);
        setMaxHeight(limits.maxAscent);
        setMaxExpectedTime(limits.maxExpectedTime);
        setAbsoluteMaxLength(limits.maxLength);
        setAbsoluteMaxHeight(limits.maxAscent);
        setAbsoluteExpectedTime(limits.maxExpectedTime);
        setDifficulties(limits.difficultyType);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="hike-filter-container">
      <Container fluid>
        <Row>
          <Col xs={12} md={4}>
            <div>Length</div>
            <MultiRangeSlider
              min={0}
              max={absoluteMaxLength}
              minVal={minLength}
              maxVal={maxLength}
              setMinVal={setMinLength}
              setMaxVal={setMaxLength}
            />
          </Col>
          <Col xs={12} md={4}>
            <div>Expected Time</div>
            <MultiRangeSlider
              min={0}
              max={absoluteMaxExpectedTime}
              minVal={minExpectedTime}
              maxVal={maxExpectedTime}
              setMinVal={setMinExpectedTime}
              setMaxVal={setMaxExpectedTime}
            />
          </Col>
          <Col xs={12} md={4}>
            <div>Ascend</div>
            <MultiRangeSlider
              min={0}
              max={absoluteMaxHeight}
              minVal={minHeight}
              maxVal={maxHeight}
              setMinVal={setMinHeight}
              setMaxVal={setMaxHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Container>
              <Row>
                <Col>
                  <div>Difficulty</div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Select
                    aria-label="Default select example"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                  >
                    <option value={-1}>Select difficulty</option>
                    {difficulties.map((difficulty, count) => (
                      <option key={count} value={count}>
                        {difficulty}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>Radius</div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control value={`${radius / 1000}km`} disabled />
                </Col>
                <Col>
                  <Form.Range
                    value={radius}
                    onChange={(event) => setRadius(event.target.value)}
                    min={0}
                    max={100000}
                    step={1000}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
          <Col xs={12} md={8}>
            <div className="d-flex justify-content-center align-items-center">
              <FilterMap
                radius={radius}
                lat={lat}
                lon={lon}
                setLat={setLat}
                setLon={setLon}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
