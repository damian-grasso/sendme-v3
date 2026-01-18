import { Route, Routes } from "react-router-dom";
import AvailabilityPollPage from "./pages/AvailabilityPollPage";
import ResponsePage from "./pages/ResponsePage";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={ <AvailabilityPollPage /> } />
      <Route path="/respond/:availabilityPollId" element={ <ResponsePage /> } />

      {/* Exception Routes */}
      <Route path="*" element={ <NoPage /> } />
    </Routes>
  );
}

export default App;