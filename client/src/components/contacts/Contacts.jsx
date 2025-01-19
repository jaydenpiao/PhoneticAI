import React from "react";
import { Tabs } from "antd";

import ContactTable from "./ContactTable";
import AgentAssign from "./AgentAssign";

const items = [
  {
    key: "1",
    label: "Contacts",
    children: <ContactTable />,
  },
  {
    key: "2",
    label: "Assign Agents",
    children: <AgentAssign />,
  },
];

const Contacts = () => {
  return (
    <div className="m-4">
      <Tabs
        defaultActiveKey="1"
        items={items}
        type="card"
        onChange={(key) => {
          console.log(key);
        }}
      />
    </div>
  );
};
export default Contacts;
