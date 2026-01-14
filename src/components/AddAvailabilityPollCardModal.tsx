import { useForm } from "react-hook-form";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import type { AvailabilityPoll } from "../models/availability-poll";

type AvailabilityPollCardProps = {
    showModal: boolean,
    handleClose: any,
    chosenAvailabilityPoll: AvailabilityPoll | null,
    setChosenAvailabilityPoll: any
}

const AddAvailabilityPollModal = ({ showModal, chosenAvailabilityPoll, setChosenAvailabilityPoll, handleClose }: AvailabilityPollCardProps) => {  

    type AvailabilityPollFormInputs = {
        title: string,
        startDate: Date,
        endDate: Date,
        pollEndDate: Date
    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AvailabilityPollFormInputs>();

    const onSubmit = async () => {
        console.log("HEY THERE")
    }

    return (
        <Modal show={showModal} 
            key={chosenAvailabilityPoll ? chosenAvailabilityPoll.id : "new-fixture"}
            onHide={() => {
                reset();
                handleClose(false);
            }}>
            <Modal.Header closeButton>
                <Modal.Title>{ (chosenAvailabilityPoll == null) ? "Add Poll" : "Update Poll" }</Modal.Title>
            </Modal.Header>
            <Form onSubmit={ handleSubmit(onSubmit) }>
                <Modal.Body>
                    <Row>
                        <Form.Group as={Col} className="mb-4">
                            <Form.Label htmlFor="title"><b>Title</b></Form.Label>
                            <Form.Control
                                { ...register("title", { required: true }) }
                                type="text"
                                id="title"
                                aria-describedby="title" />
                            { errors.title && <p role="alert" style={{ color: "red", marginTop: "10px" }}>{errors.title.message}</p> }
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-4">
                        <Form.Label><b>Dates To Poll</b></Form.Label>

                        <Stack direction="horizontal" gap={2}>
                            <Form.Control
                                {...register("startDate", { required: true })}
                                type="date" />
                            
                            <span>to</span>
                            
                            <Form.Control
                                {...register("endDate", { required: true })}
                                type="date" />
                        </Stack>
                        { (errors.startDate || errors.endDate) && <p role="alert" style={{ color: "red", marginTop: "10px" }}>{errors.startDate?.message} {errors.endDate?.message}</p> }
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} xs={6} className="mb-4">
                            <Form.Label htmlFor="pollEndDate"><b>Poll End Date</b></Form.Label>
                            <Form.Control
                                { ...register("pollEndDate", { required: true }) }
                                type="date"
                                id="pollEndDate"
                                aria-describedby="pollEndDate" />
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">{ (chosenAvailabilityPoll == null) ? "Add" : "Update" } </Button>
                    <Button variant="primary" onClick={() => {
                        reset();
                        setChosenAvailabilityPoll(null);
                        handleClose(false);
                    }}>Cancel</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddAvailabilityPollModal;