import Hike from "../../models/hike";
import { HikeTable } from "../moleculars/hike-table";
import { useState } from "react";
import { HikeFilter } from "../moleculars/hike-filter";
import { Paging } from "../atoms/paging";
import API from "../../API";

export const MyHikes = () => {
  const [hikeList, setHikeList] = useState([]);
  const [pageNumber, setPageNumer] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const handleServerResponse = (hikes) => {
    setPageNumer(1);
    setPageSize(hikes.pageSize);
    setTotalPages(hikes.totalPages);
    setHikeList(
      hikes.pageItems.map(
        (hike) =>
          new Hike(
            hike.id,
            hike.title,
            hike.length,
            hike.expectedTime,
            hike.ascent,
            hike.difficulty,
            hike.description,
            hike.startPoint,
            hike.endPoint,
            hike.referencePoints
          )
      )
    );
  };

  const handleServerResponseChangePage = (hikes) => {
    setPageSize(hikes.pageSize);
    setTotalPages(hikes.totalPages);
    setHikeList(
      hikes.pageItems.map(
        (hike) =>
          new Hike(
            hike.id,
            hike.title,
            hike.length,
            hike.expectedTime,
            hike.ascent,
            hike.difficulty,
            hike.description,
            hike.startPoint,
            hike.endPoint,
            hike.referencePoints
          )
      )
    );
  };
  const onPageChange = (newPageNumber) => {
    setPageNumer(newPageNumber);
  };

  return (
    <>
      <HikeFilter
        handleServerResponse={handleServerResponse}
        handleServerResponseChangePage={handleServerResponseChangePage}
        pageSize={pageSize}
        pageNumber={pageNumber}
        apiCall={API.getFilteredUserHikes}
        getLimits={API.getUserHikesLimits}
      />
      <div className="hike-table-container">
        <HikeTable hikeList={hikeList} isUserHike={true} />
      </div>
      <Paging
        totalPages={totalPages}
        page={pageNumber}
        onPageChange={onPageChange}
      />
    </>
  );
};
