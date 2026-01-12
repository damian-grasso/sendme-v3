import { useEffect, useState } from "react";
import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";
import AddAvailabilityPollModal from "../components/AddAvailabilityPollCardModal";

const AvailabilityPollPage = () => {

    const [chosenAvailabilityPoll, setChosenAvailabilityPoll] = useState({} as AvailabilityPoll | null);
    const [availabilityPolls, setAvailabilityPolls] = useState(null as AvailabilityPoll[] | null);

    const [showModal, setShowModal] = useState(true);

    const handleClose = async () => {
        setShowModal(false);
    }

    const fetchAvailabilityPolls = async () => {
        const availabilityPolls = await getAvailabilityPollsByAccount();
        
        console.log(availabilityPolls)

        if (availabilityPolls.length > 0)
            setAvailabilityPolls(availabilityPolls);
    }

    useEffect(() => {
        fetchAvailabilityPolls();
    }, []);

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
                                poll={poll || []} />
                })
            }
            </div>
        </>
    );
};

export default AvailabilityPollPage;