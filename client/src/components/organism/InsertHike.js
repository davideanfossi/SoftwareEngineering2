import {HikeForm} from "../moleculars/HikeForm"
import { Row } from "react-bootstrap";

function InsertHike(){
    return <>
        <Row className='justify-content-center align-items-center w-100'>
            <Row className='w-50' style={{"paddingTop": '20px', "paddingBottom": '50px', "backgroundColor": "white"}}>
                <HikeForm/>
            </Row>
        </Row>
    </>
}

export {InsertHike};