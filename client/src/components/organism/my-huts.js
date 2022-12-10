import Hut from "../../models/hut.js";
import { HutTable } from "../moleculars/hut-table";
import { useState } from "react";
import { HutFilter } from "../moleculars/hut-filter";
import { Paging } from "../atoms/paging";
import API from "../../API";

export const MyHuts = () => {
  const [hutList, setHutList] = useState([]);
  const [pageNumber, setPageNumer] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const handleServerResponse = (huts) => {
    setPageNumer(1);
    setPageSize(huts.pageSize);
    setTotalPages(huts.totalPages);
    setHutList(
      huts.pageItems.map(
        (hut) =>
          new Hut(
            hut.id,
            hut.name,
            hut.numOfBeds,
            hut.pointId,
            hut.description,
            hut.phoneNumber,
            hut.email,
            hut.website,
            hut.userId,
            hut.image
          )
      )
    );
  };

  const handleServerResponseChangePage = (huts) => {
    setPageSize(huts.pageSize);
    setTotalPages(huts.totalPages);
    setHutList(
      huts.pageItems.map(
        (hut) =>
          new Hut(
            hut.id,
            hut.name,
            hut.numOfBeds,
            hut.pointId,
            hut.description,
            hut.phoneNumber,
            hut.email,
            hut.website,
            hut.userId,
            hut.image
          )
      )
    );
  };
  const onPageChange = (newPageNumber) => {
    setPageNumer(newPageNumber);
  };

  return (
    <>
      <HutFilter
        handleServerResponse={handleServerResponse}
        handleServerResponseChangePage={handleServerResponseChangePage}
        pageSize={pageSize}
        pageNumber={pageNumber}
        apiCall={API.getFilteredUserHuts}
        getLimits={API.getUserHutsLimits}
      />
      <div className="hut-table-container">
        <HutTable hutList={hutList} />
      </div>
      <Paging
        totalPages={totalPages}
        page={pageNumber}
        onPageChange={onPageChange}
      />
    </>
  );
};
