import { Row, Button } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Placeholder(props){
    return <>
        <div style={{"backgroundColor": "grey", "height": "500px"}}>
            {props.test}
        </div>
        
    </>
}

function LinkStartEnd(){

    return <>
        <Row className='justify-content-center align-items-center' style={{"margin": "0px"}}>
            <Row className="align-items-center text-right" 
            style={{"paddingTop": '20px', "paddingBottom": '50px', "paddingRight": "0px", "paddingLeft": "0px", "margin": "0px", "width": "1000px"}}>
                <Tabs defaultActiveKey="start" 
                style={{"backgroundColor": "rgb(239, 208, 131)", "boxShadow": "none", "width": "auto", "padding": "0", "borderRadius": "10px 10px 0px 0px"}}>
                    <Tab eventKey="start" title="Link Start">
                        <Placeholder test={"start map"} />
                    </Tab>
                    <Tab eventKey="end" title="Link End">
                        <Placeholder test={"end map"} />
                    </Tab>
                </Tabs>

                {/* <Map/> */}

                <Button style={{"backgroundColor": "rgb(239, 208, 131)", "width": "auto", "border": "none", "color": "black", "marginTop": "15x"}}>
                    Link Selected
                </Button>
                
            </Row>
        </Row>
    </>
}

export {LinkStartEnd};