import React, { useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Logo from "./logo.png";

import Agents from "./components/Agents";
import EventsView from "./components/calendar/EventsView";
import Contacts from "./components/contacts/Contacts";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import ContactDetails from "./components/ContactDetails";

const App = () => {
  const [current, setCurrent] = useState("landing");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  // Updated items with React Router Links
  const items = [
    {
      label: <img src={Logo} height={50} width={50} />,
    },
    {
      label: <Link to="/">Home</Link>,
      key: "landing",
      icon: <MailOutlined />,
    },
    {
      label: <Link to="/agents">Agents</Link>,
      key: "mail",
      icon: <MailOutlined />,
    },
    {
      label: <Link to="/calendar">Calendar</Link>,
      key: "calendar",
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/contacts">Contacts</Link>,
      key: "contacts",
      icon: <SettingOutlined />,
    },
    {
      label: <Link to="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <Router>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<EventsView />} />
        <Route path="/contacts/:id" element={<ContactDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
