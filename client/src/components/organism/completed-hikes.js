import { useEffect, useState } from "react";
import { Paging } from "../atoms/paging";
import { CompletedHikeTable } from "../moleculars/completed-hike-table";
import RecordedHike from "../../models/recorde-hike";
import API from "../../API";

export const CompletedHikes = () => {
  const [completedHikeList, setCompletedHikeList] = useState([]);
  const [pageNumber, setPageNumer] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const handleServerResponse = (recordedHikes) => {
    setPageSize(recordedHikes.pageSize);
    setTotalPages(recordedHikes.totalPages);
    setCompletedHikeList(
      recordedHikes.pageItems.map(
        (recordedHike) =>
          new RecordedHike(
            recordedHike.id,
            recordedHike.userId,
            recordedHike.startDateTime,
            recordedHike.endDateTime,
            recordedHike.hike
          )
      )
    );
  };

  useEffect(() => {
    API.getCompletedHikes(pageNumber, pageSize)
      .then((recordedHikes) => handleServerResponse(recordedHikes))
      .catch((err) => console.log(err));
  }, [pageSize, pageNumber]);

  const onPageChange = (newPageNumber) => {
    setPageNumer(newPageNumber);
  };

  return (
    <>
      <div className="hike-table-container">
        <CompletedHikeTable completedHikeList={completedHikeList} />
      </div>
      <Paging
        totalPages={totalPages}
        page={pageNumber}
        onPageChange={onPageChange}
      />
    </>
  );
};
