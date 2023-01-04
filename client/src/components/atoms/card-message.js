import { Card } from 'react-bootstrap';

function CardMessage({ className, style, title, subtitle, bgVariant, textVariant, border, link }) {
    return (
        <Card bg={bgVariant} text={textVariant} border={border} className={className} style={style}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2">{subtitle}</Card.Subtitle>
                {
                    link !== undefined ?
                        <Card.Link href={link}>Click here</Card.Link>
                    :
                        <></>
                }
            </Card.Body>
        </Card>
    );
}
export { CardMessage };