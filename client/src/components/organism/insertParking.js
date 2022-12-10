import {ParkingForm} from "../moleculars/parking-form"
import { Row } from "react-bootstrap";

function InsertParking(){
    return <>
        <Row className='justify-content-center align-items-center w-100' style={{"margin": "0px"}}>
            <Row className="justify-content-center align-items-center" 
            style={{"paddingTop": '20px', "paddingBottom": '50px', "paddingRight": "0px", "paddingLeft": "0px",
            "backgroundColor": "white", "width": "800px"}}>
                <ParkingForm/>
            </Row>
        </Row>
    </>
}

export {InsertParking};