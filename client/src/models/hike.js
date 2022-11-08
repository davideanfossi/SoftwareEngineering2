function Hike(
  id,
  title,
  lenght,
  expectedTime,
  ascent,
  difficult,
  description,
  startPoint = undefined,
  endPoint = undefined,
  referencePoints = []
) {
  this.id = id;
  this.title = title;
  this.lenght = lenght;
  this.expectedTime = expectedTime;
  this.ascent = ascent;
  this.difficult = difficult;
  this.description = description;
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.referencePoints = referencePoints;
}

export default Hike;
