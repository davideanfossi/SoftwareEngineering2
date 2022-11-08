import Hike from "../models/hike";
import { HikeTable } from "./hike-table";
import { useState } from "react";
import { HikeFilter } from "./hike-filter";
const mockedHikes = [
  new Hike(0, "Title0", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(1, "Title1", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(2, "Title2", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(3, "Title3", 10, 10, 10, "Medium", "Lorem ipsum"),
  new Hike(4, "Title4", 10, 10, 10, "Medium", "Lorem ipsum"),
  new Hike(5, "Title5", 10, 10, 10, "Medium", "lorem ipsum"),
  new Hike(6, "Title6", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(7, "Title7", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(8, "Title8", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(9, "Title9", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(10, "Title0", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(11, "Title1", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(12, "Title2", 10, 10, 10, "Easy", "Lorem ipsum"),
  new Hike(13, "Title3", 10, 10, 10, "Medium", "Lorem ipsum"),
  new Hike(14, "Title4", 10, 10, 10, "Medium", "Lorem ipsum"),
  new Hike(15, "Title5", 10, 10, 10, "Medium", "lorem ipsum"),
  new Hike(16, "Title6", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(17, "Title7", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(18, "Title8", 10, 10, 10, "Hard", "Lorem ipsum"),
  new Hike(19, "Title9", 10, 10, 10, "Hard", "Lorem ipsum"),
];

export const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [hikeList, setHikeList] = useState(mockedHikes); //TODO: retrieve HikeList from API

  return (
    <>
      <HikeFilter />
      <div className="hike-table-container">
        <HikeTable hikeList={hikeList} />
      </div>
    </>
  );
};
