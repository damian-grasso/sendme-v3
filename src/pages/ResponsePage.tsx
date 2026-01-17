import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { Card, Col, Form, Row, Button, Spinner } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import type { AvailabilityBlock } from "../models/availability-block";
import { getAvailabilityPollById } from "../services/availability-poll-service";
import { createInvitee } from "../services/invitee-service";
import type { CreateInvitee } from "../models/invitee";

const ResponsePage = () => {
  const { id } = useParams();

  const [availabilityPoll, setAvailabilityPoll] = useState<AvailabilityPoll | null>(null);
  const [dateRange, setDateRange] = useState<Timestamp[]>([]);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ---- Helpers ----
  function toDayKey(ts: Timestamp): string {
    const d = ts.toDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // stable key e.g. 2026-01-17
  }

  function prettyDay(dayKey: string): string {
    // dayKey = "YYYY-MM-DD" (safe to render)
    const [y, m, d] = dayKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const updateBlock = (day: string, patch: Partial<AvailabilityBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.day === day ? { ...b, ...patch } : b)));
  };

  // ---- Fetch poll ----
  useEffect(() => {
    const fetchAvailabilityPoll = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const poll = await getAvailabilityPollById(id);
        if (poll) setAvailabilityPoll(poll);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilityPoll();
  }, [id]);

  // ---- Build date range from poll ----
  useEffect(() => {
    if (!availabilityPoll?.startDate || !availabilityPoll?.endDate) return;

    // For now this is just start+end (your earlier behaviour).
    // If you later want EVERY day between them, change this logic.
    setDateRange([availabilityPoll.startDate, availabilityPoll.endDate]);
  }, [availabilityPoll]);

  // ---- Build blocks from date range ----
  useEffect(() => {
    if (dateRange.length === 0) return;

    setBlocks(
      dateRange.map((date) => ({
        day: toDayKey(date),
        available: false,
        startTime: "",
        endTime: "",
        note: "",
      }))
    );
  }, [dateRange]);

  // ---- Submit placeholder (you’ll wire to Firestore later) ----
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting blocks:", blocks);

    console.log("APoll")
    console.log(availabilityPoll)
    
    const invitee = {
        availabilityPollId: availabilityPoll?.id,
        availabilityBlocks: blocks
    } as CreateInvitee;

    createInvitee(invitee);

    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="py-4">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!availabilityPoll) {
    return (
      <div className="py-4">
        <h1>Response Page</h1>
        <p>Poll not found.</p>
      </div>
    );
  }

  return (
    <>
      <h1>Response Page</h1>

      <h3 className="mt-3 mb-3">{availabilityPoll.title}</h3>

        {
            (!submitted) ? 
            <Form onSubmit={onSubmit}>
            {blocks.map((block) => (
              <Card key={block.day} style={{ marginBottom: "20px" }}>
                <Card.Header>{prettyDay(block.day)}</Card.Header>
    
                <Card.Body>
                  <Form.Check
                    type="checkbox"
                    id={`avail-${block.day}`}
                    label="I'm available"
                    className="mb-3"
                    checked={block.available}
                    onChange={(e) =>
                      updateBlock(block.day, {
                        available: e.target.checked,
                        ...(e.target.checked ? {} : { startTime: "", endTime: "" }),
                      })
                    }
                  />
    
                  <Row className="g-2 align-items-end mb-3">
                    <Col xs={6}>
                      <Form.Label className="mb-1">
                        <b>Start time</b>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled={!block.available}
                        value={block.startTime}
                        onChange={(e) => updateBlock(block.day, { startTime: e.target.value })}
                      />
                    </Col>
    
                    <Col xs={6}>
                      <Form.Label className="mb-1">
                        <b>End time</b>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled={!block.available}
                        value={block.endTime}
                        onChange={(e) => updateBlock(block.day, { endTime: e.target.value })}
                      />
                    </Col>
                  </Row>
    
                  <Form.Group>
                    <Form.Label className="mb-1">
                      <b>Note</b>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Optional note…"
                      value={block.note}
                      onChange={(e) => updateBlock(block.day, { note: e.target.value })}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            ))}
    
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">
                Submit response
              </Button>
            </div>
          </Form>
            : <p>Thanks!</p>
        }

      
    </>
  );
};

export default ResponsePage;
