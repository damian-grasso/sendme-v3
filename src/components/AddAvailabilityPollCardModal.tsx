import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import { Timestamp } from "firebase/firestore";

import type { AvailabilityPoll, CreateAvailabilityPoll, UpdateAvailabilityPoll } from "../models/availability-poll";
import { createAvailabilityPoll, updateAvailabilityPoll } from "../services/availability-poll-service";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";

type AvailabilityPollCardProps = {
  chosenPoll: AvailabilityPoll | null;
  showModal: boolean;
  setShowModal: any;
  setChosenPoll: any;
  setPolls: any;
};

const AddAvailabilityPollModal = ({ chosenPoll, showModal, setShowModal, setChosenPoll, setPolls }: AvailabilityPollCardProps) => {
  
  const [title, setTitle] = useState("");
  const [dateInput, setDateInput] = useState("");      // <- draft input
  const [dates, setDates] = useState<string[]>([]);    // <- selected list

  // optional: when editing an existing poll, preload values
  useEffect(() => {
    if (!showModal) return;

    if (chosenPoll) {
      setTitle(chosenPoll.title ?? "");
      setDates((chosenPoll.dates ?? []).slice().sort()); // adjust if your model differs
    } else {
      setTitle("");
      setDates([]);
    }
    setDateInput("");
  }, [showModal, chosenPoll]);

  function addDate() {
    if (!dateInput) return;
    setDates(prev => (prev.includes(dateInput) ? prev : [...prev, dateInput].sort()));
    setDateInput("");
  }

  function removeDate(d: string) {
    setDates(prev => prev.filter(x => x !== d));
  }

  function closeWithoutSave() {
    setShowModal(false);
    setChosenPoll(null);
  }

  const canSave = title.trim().length > 0 && dates.length > 0;

  async function save() {
    if (!canSave) return;

    if (chosenPoll) {

      console.log("UPDATE")

      const payload = {
        id: chosenPoll.id,
        title: title,
        dates: dates,
        status: "draft",
      } as UpdateAvailabilityPoll;

      updateAvailabilityPoll(payload);

      setPolls((prev: any) =>
        prev.map((p: any) =>
          p.id === chosenPoll.id
            ? {
                ...p,
                title: payload.title,
                dates: payload.dates,
                status: payload.status
              } : 
                p
          )
      );
      setShowModal(false);
    }

    else {

      console.log("CREATE");

      const payload = {
        title: title.trim(),
        dates: dates,
        status: "draft",
        createdAt: Timestamp.now()
      } as CreateAvailabilityPoll;

      const newPoll = await createAvailabilityPoll(payload);


      console.log("NEW POLL")
      console.log(newPoll)

      setPolls((prev: any) => [...prev, newPoll]);
      setShowModal(false);
    }
  }
  
  return (
    <Modal show={showModal} onHide={closeWithoutSave} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{chosenPoll ? "Update Poll" : "Add Poll"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Form.Group as={Col} className="mb-4">
            <Form.Label htmlFor="title"><b>Poll Title</b></Form.Label>
            <Form.Control
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Row>

        <h5 className="mb-3">Dates To Poll</h5>

        <Row className="align-items-end">
          <Form.Group as={Col} className="mb-3">
            <Form.Control
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </Form.Group>

          <Col xs="auto" className="mb-3">
            <Button variant="success" onClick={addDate} disabled={!dateInput || dates.includes(dateInput)}>
              <FaPlus />&nbsp;&nbsp;Add Date
            </Button>
          </Col>
        </Row>

        {dates.length === 0 ? (
          <div className="text-muted mb-2">Add at least one date.</div>
        ) : (
          dates.map((d) => (
            <Row key={d} className="mb-2">
              <Col className="d-flex align-items-center">
                <span>{d}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-auto"
                  onClick={() => removeDate(d)}
                >
                  <FaTimes />
                </Button>
              </Col>
            </Row>
          ))
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" type="button" disabled={!canSave} onClick={save}>
          <FaSave className="me-1" />
          Save
        </Button>
        <Button variant="secondary" type="button" onClick={closeWithoutSave}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAvailabilityPollModal;
