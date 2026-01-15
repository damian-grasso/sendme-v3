import { Button, Modal } from "react-bootstrap";
import { FaCross } from "react-icons/fa";

type DeleteAvailabilityPollCardProps = {
  pollId: string;
  showModal: boolean;
  handleClose: any;
};

const DeleteAvailabilityPollModal = ({
  pollId,
  showModal,
  handleClose
}: DeleteAvailabilityPollCardProps) => {

  const onDelete = async (pollId: string) => {
    
  }

  const closeWithoutSave = () => {
    handleClose(false);
  };

  return (
    <Modal show={showModal} onHide={closeWithoutSave} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Poll</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the poll ""? 
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit">
          <FaCross className="me-2" onClick={ () => onDelete(pollId) } />
          Delete
        </Button>
        <Button variant="secondary" type="button" onClick={closeWithoutSave}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAvailabilityPollModal;
