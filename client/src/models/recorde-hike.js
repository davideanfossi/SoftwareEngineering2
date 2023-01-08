import dayjs from "dayjs";

function RecordedHike(id, userId, startDateTime, endDateTime, hike) {
  this.id = id;
  this.userId = userId;
  this.startDateTime = dayjs(startDateTime);
  this.endDateTime = dayjs(endDateTime);
  this.hike = hike;
  this.duration = dayjs
    .duration(
      this.endDateTime.diff(
        this.startDateTime
      )
    )
    .asMinutes()
    .toFixed(0);
}

export default RecordedHike;
