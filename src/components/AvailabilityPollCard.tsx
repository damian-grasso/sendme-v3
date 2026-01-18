import { Badge, Button, Card } from "react-bootstrap";
import type { AvailabilityPoll, UpdateAvailabilityPoll } from "../models/availability-poll";
import type { Invitee } from "../models/invitee";
import { FaBullhorn, FaEdit, FaShareAlt, FaTrash } from "react-icons/fa";
import { deleteAvailabilityPoll, updateAvailabilityPoll } from "../services/availability-poll-service";

type AvailabilityPollCardProps = {
    poll: AvailabilityPoll,
    invitees: Invitee[],
    //chosenPoll: AvailabilityPoll | null,
    setChosenPoll: any,
    setAvailabilityPolls: any,
    setShowModal: any,
    setViewResponsesModal: any
}

const AvailabilityPollCard = ({ poll, invitees, setChosenPoll, setAvailabilityPolls, setShowModal, setViewResponsesModal }: AvailabilityPollCardProps) => {  

    const inviteesResponded = invitees?.filter((invitee: Invitee) => invitee.dateResponded != undefined).length;

    function formatLocalDate(dateStr: string): string {
        const [year, month, day] = dateStr.split("-").map(Number);
      
        // month is 0-based in JS Date
        const date = new Date(year, month - 1, day);
      
        return date.toLocaleDateString("en-AU", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
    }

    function getBadgeColour(status: string): string {
        if (status == "published")
            return "success";
        else
            return "secondary";
    }

    const onDeleteDraft = async () => {
        try {
            await deleteAvailabilityPoll(poll.id);

            setAvailabilityPolls((prev: AvailabilityPoll[]) =>
                prev.filter((p) => p.id !== poll?.id)
            );
            
            //setNotificationMessage("Poll has been deleted");
            //setShowToast(true);
        } catch (err) {
          console.error("Failed to copy", err);
        }
    }

    const copyLink = async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/respond/${poll.id}/`);
          //setNotificationMessage("Link has been copied!");
          //setShowToast(true);
        } catch (err) {
          console.error("Failed to copy", err);
        }
    }

    const publishPoll = async () => {
        try {
            const payload: UpdateAvailabilityPoll = {
                id: poll.id,
                title: poll.title,
                dates: poll.dates,
                status: "published"
            };

            await updateAvailabilityPoll(payload);

            setAvailabilityPolls((prev: any) =>
                prev.map((p: any) =>
                    p.id === poll.id
                    ? {
                        ...p,
                        title: payload.title,
                        dates: payload.dates,
                        status: payload.status
                    } : 
                    p
                )
            );

            await navigator.clipboard.writeText(`${window.location.origin}/${poll.id}/respond/`);

            //setNotificationMessage("Poll has been published, and the link has been copied!");
            //setShowToast(true);
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
                        <Badge
                            bg={getBadgeColour(poll.status)}
                            pill
                            className="ms-2 align-middle fw-normal"
                            style={{ fontSize: "0.75rem" }}>
                            {poll.status}
                        </Badge>
                    </h4>
                    </div>

                    {poll.status === "draft" && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDeleteDraft()} >
                            <FaTrash className="me-1" />
                        </Button>
                    )}
                </div>
                </Card.Title>
                <Card.Text>
                    <b>Poll Dates</b>
                    <p className="mb-0">{poll.dates.map((date: string) => formatLocalDate(date))?.join(", ")}</p>
                    {
                        (poll.status == "published") && 
                        <>
                            <b>Response Rate</b>
                            {
                                (invitees?.length > 0) ?
                                    <p>{ Number(inviteesResponded / invitees.length * 100).toFixed(1) }% responded ({inviteesResponded}/{invitees.length})</p> : 
                                    <p>No invitees have responded yet</p>
                            }                     
                        </>
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
                                setChosenPoll(poll) 
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
                            <Button variant="primary" onClick={ () => { 
                                setViewResponsesModal(true)
                                setChosenPoll(poll) 
                            }}>
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