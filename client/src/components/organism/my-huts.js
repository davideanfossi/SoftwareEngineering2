import { HutTable } from "../moleculars/hut-table";
import { useState } from "react";
import { HutFilter } from "../moleculars/hut-filter";
import { Paging } from "../atoms/paging";
import API from "../../API";
import { Hut, Point } from "../../models/hut";
import { useLocation } from "react-router";
import { Alert } from "react-bootstrap";

export const MyHuts = () => {
  const [hutList, setHutList] = useState([]);
  const [pageNumber, setPageNumer] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(true);
  const handleServerResponse = (huts) => {
    setPageNumer(1);
    setPageSize(huts.pageSize);
    setTotalPages(huts.totalPages);
    console.log(huts);
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
            hut.imageName,
            new Point(
              hut.point.id,
              hut.point.latitude,
              hut.point.longitude,
              hut.point.altitude,
              hut.point.name,
              hut.point.address
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
            hut.imageName,
            new Point(
              hut.point.id,
              hut.point.latitude,
              hut.point.longitude,
              hut.point.altitude,
              hut.point.name,
              hut.point.address
            )
          )
      )
    );
  };
  const onPageChange = (newPageNumber) => {
    setPageNumer(newPageNumber);
  };

  const location = useLocation();

  return (
    <>
      {location.state &&
        location.state.message === "Hut inserted succefully" &&
        show && (
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Hut inserted succefully</Alert.Heading>
          </Alert>
        )}
      <HutFilter
        handleServerResponse={handleServerResponse}
        handleServerResponseChangePage={handleServerResponseChangePage}
        pageSize={pageSize}
        pageNumber={pageNumber}
        apiCall={API.getFilteredUserHuts}
        getLimits={API.getUserHutsLimits}
      />
      <h1 className="w-100 text-center">My huts</h1>
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
