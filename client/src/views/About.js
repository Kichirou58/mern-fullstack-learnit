import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const About = () => {
    return (
        <Row className="mt-5">
            <Col className="text-center">
                <Button variant="primary" href="https://google.com" size="lg">
                    Visit my channel for more!
                </Button>
            </Col>
        </Row>
    );
};

export default About;
