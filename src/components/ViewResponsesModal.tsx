import { Button, Modal, Row } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import type { Invitee } from "../models/invitee";

type ViewResponsesModalProps = {
  showModal: boolean;
  chosenPoll: AvailabilityPoll | null;
  chosenInvitees: Invitee[] | null;
  setChosenPoll: any;
  setChosenInvitees: any;
  setShowModal: any;
};

const ViewResponsesModal = ({ showModal, chosenPoll, chosenInvitees, setChosenPoll, setChosenInvitees, setShowModal }: ViewResponsesModalProps) => {
  
  function closeModal() {
    setShowModal(false);
    setChosenPoll(null);
    setChosenInvitees(null);
  }

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Poll Responses</Modal.Title>
      </Modal.Header>
      <Modal.Body>

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
