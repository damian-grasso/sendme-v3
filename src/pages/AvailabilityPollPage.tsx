import { useEffect, useState } from "react";
import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";

const AvailabilityPollPage = () => {

    const [availabilityPolls, setAvailabilityPolls] = useState(null as AvailabilityPoll[] | null);

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