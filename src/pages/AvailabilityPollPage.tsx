import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";

import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import AddAvailabilityPollModal from "../components/AddAvailabilityPollCardModal";
import ViewResponsesModal from "../components/ViewResponsesModal";
import { getInviteesByAvailabilityPollIds } from "../services/invitee-service";
import type { Invitee } from "../models/invitee";

const AvailabilityPollPage = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [viewResponsesModal, setViewResponsesModal] = useState(false);

  const [polls, setPolls] = useState([] as AvailabilityPoll[]);
  const [invitees, setInvitees] = useState([] as Invitee[]);

  const [chosenPoll, setChosenPoll] = useState<AvailabilityPoll | null>(null);
  const chosenInvitees = (chosenPoll && invitees.length > 0) ? invitees.filter((invitee: Invitee) => invitee.availabilityPollId == chosenPoll.id) : [];

  const fetchPolls = async () => {

    try {
      const polls = await getAvailabilityPollsByAccount();

      console.log("Polls")
      console.log(polls);

      if (polls.length > 0)
        setPolls(polls);
    }

    catch (error) {
      setPolls([]);
      console.error(error);
    }
  }

  const fetchInvitees = async () => {

    try {

      const availabilityPollIds = polls.map(
        (poll: AvailabilityPoll) => poll.id
      );

      console.log(availabilityPollIds)

      const invitees = await getInviteesByAvailabilityPollIds(availabilityPollIds);

      console.log("Invitees")
      console.log(invitees);

      if (invitees.length > 0)
        setInvitees(invitees);
    }

    catch (error) {
      setPolls([]);
      console.error(error);
    }
  }

  useEffect(() => {
    
    fetchPolls();
  }, []);

  useEffect(() => {
    
    fetchInvitees();
  }, [polls.length > 0]);

  return (
    <Container>
      <Row>
        {
          (showModal) &&
            <AddAvailabilityPollModal 
              chosenPoll={chosenPoll}
              showModal={showModal}
              setShowModal={setShowModal}
              setChosenPoll={setChosenPoll} 
              setPolls={setPolls} />
        }
        {
          (viewResponsesModal) &&
            <ViewResponsesModal 
              showModal={viewResponsesModal}  
              chosenPoll={chosenPoll}
              chosenInvitees={chosenInvitees}
              setChosenPoll={setChosenPoll}
              setShowModal={setViewResponsesModal} />
        }
        <Col md={{ span: 8, offset: 2 }} className="mt-5">
          <h1>Availability Polls</h1>
          <hr/>
          <div className="d-flex justify-content-end mb-4">
            <Button 
              variant="success btn-md" 
              className="align-end" 
              onClick={ () => { 
                setShowModal(true)
                setChosenPoll(null)
              }}>
              <FaPlus />&nbsp;&nbsp;Add Poll
            </Button>
          </div>
          {
            (polls && polls.length > 0) ?
              polls.map((poll: AvailabilityPoll) => 
                <AvailabilityPollCard 
                  key={poll.id}
                  poll={poll}
                  invitees={[]}
                  chosenPoll={chosenPoll}
                  setChosenPoll={setChosenPoll} 
                  setAvailabilityPolls={setPolls} 
                  setShowModal={setShowModal}
                  setViewResponsesModal={setViewResponsesModal} />
              ) : 
              <h5>No polls created. Click "Add Poll" to create your first poll.</h5>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default AvailabilityPollPage;
