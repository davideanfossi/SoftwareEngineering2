import { Card } from 'react-bootstrap';

function CardMessage({ className, style, title, subtitle }) {
    return (
        <Card className={className} style={style}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
}
export { CardMessage };