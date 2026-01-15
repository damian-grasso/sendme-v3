import { useEffect, useState } from "react";
import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";
import AddAvailabilityPollModal from "../components/AddAvailabilityPollCardModal";
import { getInviteesByAvailabilityPollIds } from "../services/invitee-service";
import type { Invitee } from "../models/invitee";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const AvailabilityPollPage = () => {

    const [chosenAvailabilityPoll, setChosenAvailabilityPoll] = useState({} as AvailabilityPoll | null);
    const [availabilityPolls, setAvailabilityPolls] = useState([] as AvailabilityPoll[] | null);
    const [invitees, setInvitees] = useState([] as Invitee[]);

    const [showToast, setShowToast] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const [showModal, setShowModal] = useState(false);

    const handleClose = async () => {
        setShowModal(false);
    }

    const fetchAvailabilityPolls = async () => {
        const availabilityPolls = await getAvailabilityPollsByAccount();
        
        console.log(availabilityPolls)

        if (availabilityPolls.length > 0)
            setAvailabilityPolls(availabilityPolls);
    }

    const fetchAvailabilityPollInvitees = async (availabilityPollIds: string[]) => {
        const invitees = await getInviteesByAvailabilityPollIds(availabilityPollIds);
        
        console.log("INVITEES")
        console.log(invitees)

        if (invitees.length > 0)
            setInvitees(invitees);
    }    

    useEffect(() => {
        fetchAvailabilityPolls();
    }, []);

    useEffect(() => {
        if (availabilityPolls != null && availabilityPolls?.length > 0) {
            const pollIds = availabilityPolls?.map((poll: AvailabilityPoll) => { return poll.id });

            if (pollIds)
                fetchAvailabilityPollInvitees(pollIds)
        }
    }, [availabilityPolls]);

    return (
        <>

            <h1>Availability Polls</h1>
            <Button variant="success" onClick={ () => setShowModal(true) }>
                <FaPlus className="me-2" />
                Add Availability Poll
            </Button>
            <hr/>
            {
                (showModal) &&
                    <AddAvailabilityPollModal
                        chosenAvailabilityPoll={chosenAvailabilityPoll}
                        handleClose={handleClose}
                        showModal={showModal}
                        setChosenAvailabilityPoll={setChosenAvailabilityPoll}
                        setAvailabilityPolls={setAvailabilityPolls} />
            }
        
            {
                availabilityPolls?.map((poll: AvailabilityPoll) => {
                    return <AvailabilityPollCard 
                                key={poll.id}
                                invitees={invitees}
                                poll={poll || []}
                                setShowModal={setShowModal}
                                setChosenAvailabilityPoll={setChosenAvailabilityPoll}
                                setAvailabilityPolls={setAvailabilityPolls}
                                setShowToast={setShowToast}
                                setNotificationMessage={setNotificationMessage} />
                })
            }
            <ToastContainer
                position="bottom-end"
                className="p-3"
                style={{ zIndex: 1055 }}>
                <Toast show={showToast} bg="success" delay={2000} onClose={ () => setShowToast(false) } autohide>
                    <Toast.Body className="text-white d-flex align-items-center">
                        <i className="bi bi-check-circle me-2" />
                        {notificationMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default AvailabilityPollPage;