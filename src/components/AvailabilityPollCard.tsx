import { Badge, Button, Card } from "react-bootstrap";
import type { AvailabilityPoll } from "../models/availability-poll";
import { addDays } from "date-fns"

type AvailabilityPollCardProps = {
    poll: AvailabilityPoll
}

const AvailabilityPollCard = ({ poll }: AvailabilityPollCardProps) => {  

    function getFormattedDate(date: Date): string {
        return date.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function pollClosed(endDate: Date): boolean {
        const endDateObject = addDays(endDate, 1);
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
                <p>
                    { 
                        (poll.status == "published") ? `${getFormattedDate(poll.pollStartDate.toDate())} to ` : `Ends `
                    }
                    {
                        getFormattedDate(poll.pollEndDate.toDate())
                    }
                </p>
                <hr/>
                {
                    (poll.status == "draft") &&
                        <>
                            <Button variant="primary">Edit</Button>&nbsp;&nbsp;
                            <Button variant="success">Publish</Button>
                        </>
                }
                {
                    (poll.status == "published" && pollClosed(poll.pollEndDate.toDate())) &&
                        <Button variant="primary">View Responses</Button>
                }
                {
                    (poll.status == "published" && !pollClosed(poll.pollEndDate.toDate())) &&
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