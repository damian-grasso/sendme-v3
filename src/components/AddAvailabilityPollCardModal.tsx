import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import type {
  AvailabilityPoll,
  CreateAvailabilityPoll,
  UpdateAvailabilityPoll,
} from "../models/availability-poll";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import {
  createAvailabilityPoll,
  updateAvailabilityPoll,
} from "../services/availability-poll-service";
import { FaSave } from "react-icons/fa";

type AvailabilityPollCardProps = {
  showModal: boolean;
  handleClose: (didSave: boolean) => void;
  chosenAvailabilityPoll: AvailabilityPoll | null;
  setChosenAvailabilityPoll: any;
  setAvailabilityPolls: any;
};

type AvailabilityPollFormInputs = {
  title: string;
  startDate: string;   // yyyy-mm-dd
  endDate: string;     // yyyy-mm-dd
};

function toDateInput(ts?: Timestamp | null): string {
  if (!ts) return "";
  const d = ts.toDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fromDateInput(dateStr: string): Timestamp {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Timestamp.fromDate(new Date(year, month - 1, day, 0, 0, 0));
}

const AddAvailabilityPollModal = ({
  showModal,
  chosenAvailabilityPoll,
  setChosenAvailabilityPoll,
  setAvailabilityPolls,
  handleClose
}: AvailabilityPollCardProps) => {
  const defaultValues: AvailabilityPollFormInputs = useMemo(
    () => ({
      title: "",
      startDate: "",
      endDate: ""
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AvailabilityPollFormInputs>({ defaultValues });

  useEffect(() => {
    if (!showModal) return;

    if (!chosenAvailabilityPoll) {
      reset(defaultValues);
      return;
    }

    reset({
      title: chosenAvailabilityPoll.title || "",
      startDate: toDateInput(chosenAvailabilityPoll.startDate),
      endDate: toDateInput(chosenAvailabilityPoll.endDate)
    });
  }, [showModal, chosenAvailabilityPoll?.id, reset, defaultValues]);

  const closeWithoutSave = () => {
    reset(defaultValues);
    setChosenAvailabilityPoll(null);
    handleClose(false);
  };

  const onSubmit = async (form: AvailabilityPollFormInputs) => {
    try {
      const startDateTs = fromDateInput(form.startDate);
      const endDateTs = fromDateInput(form.endDate);

      if (chosenAvailabilityPoll) {

        const payload: UpdateAvailabilityPoll = {
          id: chosenAvailabilityPoll.id,
          title: form.title,
          startDate: startDateTs,
          endDate: endDateTs,
          status: chosenAvailabilityPoll.status
        };

        await updateAvailabilityPoll(payload);

        // Update parent list
        setAvailabilityPolls((prev: any) =>
          prev.map((p: any) =>
            p.id === chosenAvailabilityPoll.id
              ? {
                  ...p,
                  title: payload.title,
                  startDate: payload.startDate,
                  endDate: payload.endDate,
                  status: payload.status,
                }
              : p
          )
        );

        setChosenAvailabilityPoll(
            chosenAvailabilityPoll
              ? {
                  ...chosenAvailabilityPoll,
                  title: payload.title,
                  startDate: payload.startDate,
                  endDate: payload.endDate,
                  status: payload.status,
                }
              : null
          );
        
        setChosenAvailabilityPoll(null);
        reset(defaultValues);
        handleClose(true);
        return;
      }

      // CREATE
      const payload: CreateAvailabilityPoll = {
        title: form.title,
        startDate: startDateTs,
        endDate: endDateTs,
        status: "draft",
        link: crypto.randomUUID().slice(0, 7),
        createdAt: Timestamp.now(),
      };

      // Ideally returns new doc id
      const poll = await createAvailabilityPoll(payload);

      if (poll) {
        // Optimistic poll for UI
        const optimisticPoll: AvailabilityPoll = {
          id: poll.id,
          title: payload.title,
          startDate: payload.startDate,
          endDate: payload.endDate,
          status: payload.status,
          link: payload.link,
          createdAt: Timestamp.now()
        };

        setAvailabilityPolls((prev) => [optimisticPoll, ...prev]);
        setChosenAvailabilityPoll(null);
        handleClose(true);
      }

      else
        throw new Error("An error occurred");
    } catch (error) {
      console.error(error);
      // optionally show toast / inline error
    }
  };

  return (
    <Modal show={showModal} onHide={closeWithoutSave} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{chosenAvailabilityPoll ? "Update Poll" : "Add Poll"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Form.Group as={Col} className="mb-4">
              <Form.Label htmlFor="title">
                <b>Poll Title</b>
              </Form.Label>
              <Form.Control
                {...register("title", { required: "Please enter a title" })}
                type="text"
                id="title"
              />
              {errors.title && (
                <div role="alert" className="mt-2 text-danger">
                  {errors.title.message}
                </div>
              )}
            </Form.Group>
          </Row>

          <h5 className="mb-2" style={{ textAlign: "center" }}>Date Range To Poll</h5>

          <Form.Group className="mb-3">
            <Form.Label>
              <b>Start Date</b>
            </Form.Label>
            <Form.Control
              {...register("startDate", { required: "Start Date is missing" })}
              type="date" />
            
            {errors.startDate && (
              <div role="alert" className="mt-2 text-danger">
                {errors.startDate.message}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>End Date</b>
            </Form.Label>
            <Form.Control
              {...register("endDate", { required: "End Date is missing" })}
              type="date" />

            {errors.endDate && (
              <div role="alert" className="mt-1 text-danger">
                {errors.endDate.message}
              </div>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            <FaSave className="me-1" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button variant="secondary" type="button" onClick={closeWithoutSave}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddAvailabilityPollModal;
