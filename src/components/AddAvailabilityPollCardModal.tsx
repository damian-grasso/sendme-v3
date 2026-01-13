import { useForm } from "react-hook-form";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import type { AvailabilityPoll } from "../models/availability-poll";

type AvailabilityPollCardProps = {
    showModal: boolean,
    handleClose: any,
    chosenAvailabilityPoll: AvailabilityPoll | null
}

const AddAvailabilityPollModal = ({ showModal, chosenAvailabilityPoll, handleClose }: AvailabilityPollCardProps) => {  

    type AvailabilityPollFormInputs = {

    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AvailabilityPollFormInputs>();

    const onSubmit = async () => {
        
    }

    return (
        <Modal show={showModal} 
            key={chosenAvailabilityPoll ? chosenAvailabilityPoll.id : "new-fixture"}
            onHide={() => {
                reset();
                handleClose(false);
            }}>
            <Modal.Header closeButton>
                <Modal.Title>{ (chosenAvailabilityPoll == null) ? "Add Fixture" : "Update Fixture" }</Modal.Title>
            </Modal.Header>
            <Form onSubmit={ handleSubmit(onSubmit) }>
                <Modal.Body>
                    <Row>
                        <Form.Group as={Col} xs={12} md={6} className="mb-4" />
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">Add / Update</Button>
                    <Button variant="primary" onClick={ () => handleClose() }>Cancel</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddAvailabilityPollModal;