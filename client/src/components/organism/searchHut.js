import {Hut, Point} from "../../models/hut";
import { HutTable } from "../moleculars/hut-table";
import { useState } from "react";
import { HutFilter } from "../moleculars/hut-filter";
import { Paging } from "../atoms/paging";
import API from "../../API";

export const SearchHut = () => {
  const [hutList, setHutList] = useState([]);
  const [pageNumber, setPageNumer] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [nameSearch, setNameSearch] = useState('');
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
            hut.description,
            hut.numOfBeds,
            hut.phoneNumber,
            hut.email,
            hut.website,
            new Point(
                hut.point.id,
                hut.point.latitude,
                hut.point.longitude,
                hut.point.altitude,
                hut.point.name,
                hut.point.address,
            )
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
            hut.description,
            hut.numOfBeds,
            hut.phoneNumber,
            hut.email,
            hut.website,
            new Point(
                hut.point.id,
                hut.point.latitude,
                hut.point.longitude,
                hut.point.altitude,
                hut.point.name,
                hut.point.address,
            )
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
        setNameSearch={setNameSearch}
        apiCall={API.getFilteredHut}
        getLimits={API.getHutsLimits}
      />
      <div className="hut-table-container">
        <HutTable
          hutList={
            nameSearch === ""
              ? hutList
              : hutList.filter((hut) => hut.name.toLowerCase().includes(nameSearch.toLowerCase()))
          }      
        />
      </div>
      <Paging
        totalPages={totalPages}
        page={pageNumber}
        onPageChange={onPageChange}
      />
    </>
  );
};
