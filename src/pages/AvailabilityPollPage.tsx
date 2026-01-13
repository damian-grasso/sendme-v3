import { useEffect, useState } from "react";
import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";
import AddAvailabilityPollModal from "../components/AddAvailabilityPollCardModal";
import { getInviteesByAvailabilityPollIds } from "../services/invitee-service";
import type { Invitee } from "../models/invitee";

const AvailabilityPollPage = () => {

    const [chosenAvailabilityPoll, setChosenAvailabilityPoll] = useState({} as AvailabilityPoll | null);
    const [availabilityPolls, setAvailabilityPolls] = useState([] as AvailabilityPoll[] | null);
    const [invitees, setInvitees] = useState([] as Invitee[]);

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
            <hr/>
            {
                (showModal) &&
                    <AddAvailabilityPollModal
                        chosenAvailabilityPoll={chosenAvailabilityPoll}
                        handleClose={handleClose}
                        showModal={showModal} />
            }
            <div>
            {
                availabilityPolls?.map((poll: AvailabilityPoll) => {
                    return <AvailabilityPollCard 
                                key={poll.id}
                                invitees={invitees}
                                poll={poll || []} />
                })
            }
            </div>
        </>
    );
};

export default AvailabilityPollPage;