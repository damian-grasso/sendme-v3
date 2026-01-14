import { useForm } from "react-hook-form";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import type { AvailabilityPoll, CreateAvailabilityPoll, UpdateAvailabilityPoll } from "../models/availability-poll";
import { useEffect } from "react";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { createAvailabilityPoll, updateAvailabilityPoll } from "../services/availability-poll-service";

type AvailabilityPollCardProps = {
    showModal: boolean,
    handleClose: any,
    chosenAvailabilityPoll: AvailabilityPoll | null,
    setChosenAvailabilityPoll: any
}

const AddAvailabilityPollModal = ({ showModal, chosenAvailabilityPoll, setChosenAvailabilityPoll, handleClose }: AvailabilityPollCardProps) => {  

    console.log(chosenAvailabilityPoll)

    type AvailabilityPollFormInputs = {
        title: string,
        startDate: string,
        endDate: string,
        pollEndDate: string
    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AvailabilityPollFormInputs>();

    let values = null;

    const defaultValues = {
        title: "",
        startDate: "",
        endDate: "",
        pollEndDate: ""
    };

    function getFormattedDate(dateStr: string): Timestamp {
        const [year, month, day] = dateStr.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        return Timestamp.fromDate(localDate);
    }

    const onSubmit = async (form: AvailabilityPollFormInputs) => {

        if (chosenAvailabilityPoll) {
            try {
                const updateAvailabilityPollData = {
                    id: chosenAvailabilityPoll.id,
                    title: form.title,
                    startDate: getFormattedDate(form.startDate),
                    endDate: getFormattedDate(form.endDate),
                    pollEndDate: getFormattedDate(form.pollEndDate),
                    status: chosenAvailabilityPoll.status,
                    reminderSent: false
                } as UpdateAvailabilityPoll;
    
                await updateAvailabilityPoll(updateAvailabilityPollData)

                // then update state...
            }

            catch (error) {
                console.error(error);
            }
        }

        else {
            try {
                const createAvailabilityPollData = {
                    title: form.title,
                    pollEndDate: getFormattedDate(form.pollEndDate),
                    startDate: getFormattedDate(form.startDate),
                    endDate: getFormattedDate(form.endDate),
                    status: "draft",
                    reminderSent: false,
                    createdAt: serverTimestamp()
                } as CreateAvailabilityPoll;
    
                await createAvailabilityPoll(createAvailabilityPollData);

                handleClose(true);

                // then update state...
            }

            catch (error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        values = (chosenAvailabilityPoll == null) ?
            defaultValues : 
            {
                title: chosenAvailabilityPoll.title,
                startDate: chosenAvailabilityPoll.startDate.toDate().toISOString().slice(0, 10),
                endDate: chosenAvailabilityPoll.endDate.toDate().toISOString().slice(0, 10),
                pollEndDate: chosenAvailabilityPoll.pollEndDate.toDate().toISOString().slice(0, 10)
            };

        reset(values);
    }, [chosenAvailabilityPoll, reset]);

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
                        <Form.Group as={Col} className="mb-1">
                            <Form.Label htmlFor="title"><b>Title</b></Form.Label>
                            <Form.Control
                                { ...register("title", { required: "Please enter a title" }) }
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
                                {...register("startDate", { required: "Start Date is missing" })}
                                type="date" />
                            <span>to</span>
                            <Form.Control
                                {...register("endDate", { required: "End Date is missing" })}
                                type="date" />
                        </Stack>
                        { (errors.startDate) && <p role="alert" className="mt-1 mb-1" style={{ color: "red" }}>{errors.startDate?.message}</p> }
                        { (errors.endDate) && <p role="alert" className="mt-1 mb-1" style={{ color: "red" }}>{errors.endDate?.message}</p> }
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} xs={6} className="mb-4">
                            <Form.Label htmlFor="pollEndDate"><b>Poll End Date</b></Form.Label>
                            <Form.Control
                                { ...register("pollEndDate", { required: "Poll End Date is missing" }) }
                                type="date"
                                id="pollEndDate"
                                aria-describedby="pollEndDate" />
                            { (errors.pollEndDate) && <p role="alert" className="mt-1 mb-1" style={{ color: "red" }}>{errors.pollEndDate?.message}</p> }
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="secondary" onClick={() => {
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