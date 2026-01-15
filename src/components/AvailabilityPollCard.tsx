import { Badge, Button, Card } from "react-bootstrap";
import type { AvailabilityPoll, UpdateAvailabilityPoll } from "../models/availability-poll";
import type { Invitee } from "../models/invitee";
import { FaBullhorn, FaEdit, FaShareAlt, FaTrash } from "react-icons/fa";
import { updateAvailabilityPoll } from "../services/availability-poll-service";

type AvailabilityPollCardProps = {
    poll: AvailabilityPoll,
    invitees: Invitee[],
    setChosenAvailabilityPoll: any,
    setAvailabilityPolls: any,
    setShowModal: any
}

const AvailabilityPollCard = ({ poll, invitees, setChosenAvailabilityPoll, setAvailabilityPolls, setShowModal }: AvailabilityPollCardProps) => {  

    const inviteesResponded = invitees?.filter((invitee: Invitee) => invitee.dateResponded != undefined).length;

    function getBadgeColour(status: string): string {
        if (status == "published")
            return "success";
        else
            return "secondary";
    }

    const copyLink = async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/${poll.id}/respond/${poll.link}`);
        } catch (err) {
          console.error("Failed to copy", err);
        }
    }

    const publishPoll = async () => {
        try {
            const payload: UpdateAvailabilityPoll = {
                id: poll.id,
                title: poll.title,
                startDate: poll.startDate,
                endDate: poll.endDate,
                status: "published"
            };

            await updateAvailabilityPoll(payload);

            setAvailabilityPolls((prev: any) =>
                prev.map((p: any) =>
                    p.id === poll.id
                    ? {
                        ...p,
                        title: payload.title,
                        startDate: payload.startDate,
                        endDate: payload.endDate,
                        status: payload.status
                    } : 
                    p
                )
            );

            await navigator.clipboard.writeText(`${window.location.origin}/${poll.id}/respond/${poll.link}`);
        } catch (err) {
          console.error("Failed to copy", err);
        }
    };

    return (
        <Card style={{ marginBottom: "20px" }}>
            <Card.Body>
            <Card.Title>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                    <h4 className="mb-0">
                        {poll.title}{" "}
                        <Badge bg={getBadgeColour(poll.status)}>{poll.status}</Badge>
                    </h4>
                    </div>

                    {poll.status === "draft" && (
                        <Button
                            variant="danger"
                            size="sm"
                            //onClick={() => onDeleteDraft(poll)}
                        >
                            <FaTrash className="me-1" />
                        </Button>
                    )}
                </div>
                </Card.Title>
                <Card.Text>
                    <b>Poll Dates</b>
                    <p>{poll.startDate.toDate().toLocaleDateString()} to {poll.endDate.toDate().toLocaleDateString()}</p>
                    {
                        (poll.status == "published" && invitees && invitees?.length > 0) && 
                            `Response Rate: ${ Number(inviteesResponded / invitees.length * 100).toFixed(1) }% responded (${inviteesResponded}/${invitees.length})`
                    }

                <hr/>
                {
                    (poll.status == "draft") &&
                        <>
                            <Button variant="success" onClick={ () => publishPoll() } className="me-2">
                                <FaBullhorn className="me-2" />
                                Publish Link
                            </Button>
                            <Button variant="primary" onClick={ () => { 
                                setShowModal(true)
                                setChosenAvailabilityPoll(poll) 
                            }}>
                                <FaEdit className="me-2" />
                                Edit
                            </Button>
                        </>
                }
                {
                    (poll.status == "published") &&
                        <>
                            <Button variant="success" className="me-2" onClick={copyLink}>
                                <FaShareAlt className="me-2" />
                                Copy Link
                            </Button>
                            <Button variant="primary">
                                View Responses
                            </Button>
                        </>
                }
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default AvailabilityPollCard;