import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import { getAvailabilityPollById } from "../services/availability-poll-service";

const ResponsePage = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState<AvailabilityPoll | null>(null);

  const fetchAvailabilityPoll = async () => {
    if (!id) return;

    try {
      const poll = await getAvailabilityPollById(id);
      
      console.log("OI");
      console.log(poll);

      if (poll)
        setPoll(poll);
    }

    catch(error) {
      console.error(error);
      setPoll(null);
    }
  };

  useEffect(() => {

    fetchAvailabilityPoll();
  }, [id]);

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }} className="mt-5">
          <h1>Availability Poll</h1>
          <h3>{poll?.title}</h3>
          <hr/>
          <p>LOL</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ResponsePage;
