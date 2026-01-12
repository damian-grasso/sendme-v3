import { Card } from "react-bootstrap";
import type { AvailabilityPoll } from "../models/availability-poll";

type AvailabilityPollCardProps = {
    poll: AvailabilityPoll
}

const AvailabilityPollCard = ({ poll }: AvailabilityPollCardProps) => {  

    return (
        <Card style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Card.Title>
                    <h3>{poll.title}</h3>
                    <span>{poll.status}</span>
                </Card.Title>
                <Card.Text>
                    YOOO
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default AvailabilityPollCard;