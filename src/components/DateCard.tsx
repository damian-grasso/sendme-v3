import { Card, Form } from "react-bootstrap";

type Props = {
  day: string;
  value: DayResponse;
  onChange: (next: DayResponse) => void;
};

type DayResponse = {
  available: boolean;
  start: string;
  end: string;
};

const DateCard = ({ day, value, onChange }: Props) => {

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
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{formatLocalDate(day)}</Card.Title>

        <Form.Check
          label="I'm available"
          checked={value.available}
          onChange={(e) =>
            onChange({ ...value, available: e.target.checked })
          }/>

        {value.available && (
          <div className="d-flex gap-2 mt-2">
            <Form.Select
              value={value.start}
              onChange={(e) =>
                onChange({ ...value, start: e.target.value })
              }>
              <option value="00:00">12:00 AM</option>
              <option value="01:00">1:00 AM</option>
              <option value="02:00">2:00 AM</option>
              <option value="03:00">3:00 AM</option>
              <option value="04:00">4:00 AM</option>
              <option value="05:00">5:00 AM</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </Form.Select>

            <Form.Select
              value={value.end}
              onChange={(e) =>
                onChange({ ...value, end: e.target.value })
              }>
              <option value="00:00">12:00 AM</option>
              <option value="01:00">1:00 AM</option>
              <option value="02:00">2:00 AM</option>
              <option value="03:00">3:00 AM</option>
              <option value="04:00">4:00 AM</option>
              <option value="05:00">5:00 AM</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </Form.Select>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DateCard;