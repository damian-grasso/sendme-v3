import { Button, Form, Modal } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import type { Invitee } from "../models/invitee";
import { useState } from "react";
import type { AvailabilityBlock } from "../models/availability-block";

type ViewResponsesModalProps = {
  showModal: boolean;
  chosenPoll: AvailabilityPoll | null;
  chosenInvitees: Invitee[] | null;
  setChosenPoll: any;
  setShowModal: any;
};

const ViewResponsesModal = ({ showModal, chosenPoll, chosenInvitees, setChosenPoll, setShowModal }: ViewResponsesModalProps) => {
  
  const [chosenDate, setChosenDate] = useState("All Dates");

  function closeModal() {
    setShowModal(false);
    setChosenPoll(null);
  }

  function formatLocalDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
  
    // month is 0-based in JS Date
    const date = new Date(year, month - 1, day);
  
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }  

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Poll Responses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>
          <b>Filter By Day</b>
        </Form.Label>
        <Form.Select 
          className="mb-3"
          value={chosenDate} 
          onChange={(e) => { setChosenDate(e.target.value) }}>
          <option id="All Dates">All Dates</option>
          {
            (chosenPoll && chosenPoll.dates.length > 0) && 
              chosenPoll.dates.map((date: string) => 
                <option id={formatLocalDate(date)}>{formatLocalDate(date)}</option>
              )
          }
        </Form.Select>
        <hr/>
      {
        (chosenInvitees && chosenInvitees.length > 0) ?
          chosenInvitees.map((invitee: Invitee) => (
            <div key={invitee.id}>
              <p className="mb-0" style={{ fontSize: "18px" }}><b>{invitee.name}</b></p>
              {invitee.availabilityBlocks
                .filter(block =>
                  chosenDate === "All Dates"
                    ? true
                    : formatLocalDate(block.day) === chosenDate
                )
                .map((block: AvailabilityBlock, blockIndex) => (
                  <div key={`${invitee.id}-${blockIndex}`}>
                    <p className="mb-1" style={{ fontSize: "16px" }}>
                      <b>{formatLocalDate(block.day)}</b>&nbsp;|&nbsp;
                      {block.available ? (
                        <>
                          {block.startTime} - {block.endTime}
                        </>
                        ) : (
                        <em>Not available</em>
                      )}
                    </p>
                  </div>
                ))}
              <hr className="mt-2 mb-2"/>
            </div>
          )) : 
          <p>No responses have been submitted yet.</p>
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
