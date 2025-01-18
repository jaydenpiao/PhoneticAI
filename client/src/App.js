import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Components
const Contacts = () => <h2>Contacts Page</h2>;
const Calendar = () => <h2>Calendar Page</h2>;
const Agents = () => <h2>Agents Page</h2>;
const Dashboards = () => <h2>Dashboards Page</h2>;

const App = () => {
  return (
    <>
      <h1 className="text-blue-400">adsfds</h1>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/contacts">Contacts</Link>
              </li>
              <li>
                <Link to="/calendar">Calendar</Link>
              </li>
              <li>
                <Link to="/agents">Agents</Link>
              </li>
              <li>
                <Link to="/dashboards">Dashboards</Link>
              </li>
            </ul>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/dashboards" element={<Dashboards />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
