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
import { useSearchParams } from "react-router-dom";

const AvailabilityPollPage = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [viewResponsesModal, setViewResponsesModal] = useState(false);

  const [polls, setPolls] = useState([] as AvailabilityPoll[]);
  const [invitees, setInvitees] = useState([] as Invitee[]);

  const [chosenPoll, setChosenPoll] = useState<AvailabilityPoll | null>(null);
  const chosenInvitees = (chosenPoll && invitees.length > 0) ? invitees.filter((invitee: Invitee) => invitee.availabilityPollId == chosenPoll.id) : [];

  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");
  const tempAccountId = crypto.randomUUID();

  const trueAccountId = (!accountId) ? tempAccountId : accountId;

  console.log("ACCOUNT ID: ")
  console.log(accountId)
  console.log("TEMP ACCOUNT ID: ")
  console.log(tempAccountId)
  console.log("TA ID")
  console.log(trueAccountId)

  const copyAccountLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}?accountId=${trueAccountId}`);
      //setNotificationMessage("Link has been copied!");
      //setShowToast(true);
    } catch (err) {
      console.error("Failed to copy", err);
    }
}

  const fetchPolls = async (accountId: string) => {

    if (accountId == "") {
      setPolls([]);
      return;
    }

    try {
      const polls = await getAvailabilityPollsByAccount(accountId);

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
    
    fetchPolls(accountId || "");
  }, [accountId]);

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
              setPolls={setPolls}
              accountId={trueAccountId} />
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
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mt-2">
            <h5 className="mb-0">
              Like this app? Copy this{" "}
              <a href="#"
                onClick={(e) => {
                  e.preventDefault();
                  copyAccountLink();
                }}>
                link
              </a>{" "}
              to save your polls for later!
            </h5>
            <Button
              variant="success"
              className="add-poll-btn"
              onClick={() => {
                setShowModal(true);
                setChosenPoll(null);
              }}>
                <FaPlus />&nbsp;&nbsp;Add Poll
            </Button>
          </div>
          <hr className="mt-3 mb-4" />
          {
            (polls && polls.length > 0) ?
              polls.map((poll: AvailabilityPoll) => 
                <AvailabilityPollCard 
                  key={poll.id}
                  poll={poll}
                  invitees={invitees.filter((invitee: Invitee) => invitee.availabilityPollId == poll.id)}
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
