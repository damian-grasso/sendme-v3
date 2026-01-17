import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import type { AvailabilityPoll } from "../models/availability-poll";
import AvailabilityPollCard from "../components/AvailabilityPollCard";

import { getAvailabilityPollsByAccount } from "../services/availability-poll-service";
import AddAvailabilityPollModal from "../components/AddAvailabilityPollCardModal";

const AvailabilityPollPage = () => {
  
  const [showModal, setShowModal] = useState(false);

  const [chosenPoll, setChosenPoll] = useState(null);
  const [polls, setPolls] = useState([] as AvailabilityPoll[])

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

  useEffect(() => {
    
    fetchPolls();
  }, []);

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
                  poll={poll}
                  invitees={[]}
                  chosenPoll={chosenPoll}
                  setChosenPoll={setChosenPoll} 
                  setAvailabilityPolls={setPolls} 
                  setShowModal={setShowModal} />
              ) : 
              <h5>No polls created. Click "Add Poll" to create your first poll.</h5>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default AvailabilityPollPage;
