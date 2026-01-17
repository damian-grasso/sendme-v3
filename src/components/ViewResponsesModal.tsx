import { Button, Modal, Row } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import type { Invitee } from "../models/invitee";

type ViewResponsesModalProps = {
  showModal: boolean;
  chosenPoll: AvailabilityPoll | null;
  chosenInvitees: Invitee[] | null;
  setChosenPoll: any;
  setShowModal: any;
};

const ViewResponsesModal = ({ showModal, chosenPoll, chosenInvitees, setChosenPoll, setShowModal }: ViewResponsesModalProps) => {
  
  function closeModal() {
    setShowModal(false);
    setChosenPoll(null);
  }

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Poll Responses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {
        chosenInvitees && chosenInvitees.length > 0 &&
        chosenInvitees.map((invitee: Invitee) => (
          <div key={invitee.id}>
            <p>{invitee.name}</p>

            {invitee.availabilityBlocks.map((block, blockIndex) => (
              <div key={`${invitee.id}-${blockIndex}`}>
                <p>{block.day}</p>
                <p>{block.startTime} - {block.endTime}</p>
                <p>{block.note}</p>
              </div>
            ))}
          </div>
        ))
      }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewResponsesModal;
