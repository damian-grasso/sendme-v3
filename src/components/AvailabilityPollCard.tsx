import { Badge, Button, Card } from "react-bootstrap";
import type { AvailabilityPoll } from "../models/availability-poll";
import { addDays } from "date-fns"

type AvailabilityPollCardProps = {
    poll: AvailabilityPoll
}

const AvailabilityPollCard = ({ poll }: AvailabilityPollCardProps) => {  

    function getFormattedDate(date: string): string {
        const dateObject = new Date(date);

        return dateObject.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function pollClosed(endDate: string): boolean {
        const endDateObject = addDays(new Date(), 1);

        return Date.now() > endDateObject.getTime();
    }

    function getBadgeColour(status: string): string {
        if (status == "published")
            return "success";
        else
            return "secondary";
    }

    return (
        <Card style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Card.Title>
                    <h4>
                        {poll.title} <Badge bg={getBadgeColour(poll.status)}>{poll.status}</Badge> 
                    </h4>
                </Card.Title>
                <Card.Text>
                {
                    (poll.collectionType === "date_range") &&
                        <p>{getFormattedDate(poll.startDate)} to {getFormattedDate(poll.endDate)}</p>
                }
                <hr/>
                {
                    (poll.status == "draft") &&
                        <>
                            <Button variant="primary">Edit</Button>&nbsp;&nbsp;
                            <Button variant="success">Publish</Button>
                        </>
                }
                {
                    (poll.status == "published" && pollClosed(poll.endDate)) &&
                        <Button variant="primary">View Responses</Button>
                }
                {
                    (poll.status == "published" && !pollClosed(poll.endDate)) &&
                        <>
                            <Button variant="primary">View Responses</Button>&nbsp;&nbsp;
                            <Button variant="primary">Remind</Button>
                        </>
                }
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default AvailabilityPollCard;