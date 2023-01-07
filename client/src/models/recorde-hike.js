function RecordedHike(id, hike, userId, startDateTime, endDateTime) {
  this.id = id;
  this.userId = userId;
  this.startDateTime = startDateTime;
  this.endDateTime = endDateTime;
  this.hike = hike;
}

export default RecordedHike;
