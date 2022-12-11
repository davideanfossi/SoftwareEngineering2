import React, { useCallback, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import "./multi-range-slider.css";

export const MultiRangeSlider = ({
  min,
  max,
  minVal,
  setMinVal,
  maxVal,
  setMaxVal,
}) => {
  const [internalMinVal, setInternalMinVal] = useState(min);
  const [internalMaxVal, setInternalMaxVal] = useState(max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setInternalMaxVal(maxVal);
    setInternalMinVal(minVal);
  }, [maxVal, minVal]);
  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(internalMinVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [internalMinVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(internalMaxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [internalMaxVal, getPercent]);

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={internalMinVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, internalMaxVal - 1);
          setInternalMinVal(value);
          event.target.value = value.toString();
        }}
        onMouseUp={(event) => {
          const value = Math.min(+event.target.value, internalMaxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": internalMinVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={internalMaxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, internalMinVal + 1);
          setInternalMaxVal(value);
          event.target.value = value.toString();
        }}
        onMouseUp={(event) => {
          const value = Math.max(+event.target.value, internalMinVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{internalMinVal}</div>
        <div className="slider__right-value">{internalMaxVal}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
