import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";

import type { AvailabilityPoll } from "../models/availability-poll";
import { getAvailabilityPollById } from "../services/availability-poll-service";
import DateCard from "../components/DateCard";
import type { CreateInvitee } from "../models/invitee";
import { Timestamp } from "firebase/firestore";
import type { AvailabilityBlock } from "../models/availability-block";
import { createInvitee } from "../services/invitee-service";

const ResponsePage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState<AvailabilityPoll | null>(null);
  const [responses, setResponses] = useState<Responses>({});

  const [submitted, setSubmitted] = useState(false);

  type DayResponse = {
    available: boolean;
    start: string;
    end: string;
  };

  type Responses = Record<string, DayResponse>;

  /*function isInvalid(r: DayResponse) {
    if (!r.available) return false;
    return r.start > r.end;
  }

  const hasErrors = Object.values(responses).some(isInvalid);

  if (hasErrors) {
    alert("Fix time ranges");
    return;
  }*/

  async function onSubmit(responses: Responses) {

    if (poll) {
      let blocks = [] as AvailabilityBlock[];

      for (var date of poll.dates) {
        const response = responses[date] as DayResponse;

        console.log("RESPONSE")
        console.log(response)
      
        let block = {} as AvailabilityBlock;
        block.day = date;
        block.name = "";

        if (response.available) {          
          block.available = true;
          block.startTime = response.start;
          block.endTime = response.end;
        }

        else {
          block.available = false;
          block.startTime = "";
          block.endTime = "";
        }

        console.log("BLOCK")
        console.log(block)

        blocks.push(block);
      }

      const newInvitee = {
        availabilityPollId: id,
        name: "",
        availabilityBlocks: blocks,
        dateResponded: Timestamp.now()
      } as CreateInvitee;

      const invitee = await createInvitee(newInvitee);

      console.log("INVTIEE");
      console.log(invitee);

      setSubmitted(true);
    }
  }

  async function fetchPoll(id: string) {

    if (!id)
      return;

    try {
      const poll = await getAvailabilityPollById(id);

      if (!poll) return;

      else {
        setPoll(poll);

        const initial: Responses = {};

        poll.dates.forEach((day: string) => {
          initial[day] = {
            available: false,
            start: "06:00",
            end: "10:00",
          };
        });

        setResponses(initial);
      }      
    }

    catch (error) {
      console.error(error);
      
    }
  }

  useEffect(() => {
    if (!id)
      return;

    else
      fetchPoll(id);
  }, [id]);

  if (!poll) return <p>Loading…</p>;

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }} className="mt-5">
        <h1 className="mb-4">{poll.title}</h1>
        {
          (!submitted) ? 
            <>
              <div className="mb-4">
                <h5 className="mb-4">Please let the organiser know what days you're available.</h5>
                {poll.dates.map((day: string) => (
                  <DateCard
                    key={day}
                    day={day}
                    value={responses[day]}
                    onChange={(next: any) =>
                      setResponses(prev => ({
                        ...prev,
                        [day]: next,
                      }))
                    }
                  />
                ))}
              </div>
              <Button onClick={() => onSubmit(responses)}>
                Submit
              </Button>
            </> : 
            <h6>Thanks for submitting! We've let the poll organiser know your availability.</h6>
        }
        </Col>
      </Row>
    </Container>
  );
};

export default ResponsePage;
