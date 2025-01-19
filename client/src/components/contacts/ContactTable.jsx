import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/contacts");
        setContacts(
          response.data.map((contact, index) => ({
            key: index.toString(), // Assign a unique key
            contact_name: contact.name,
            phone_number: contact.phone_number,
            agent_name: contact.agent_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Table columns definition
  const columns = [
    {
      title: "Contact Name",
      dataIndex: "contact_name",
      key: "contact_name",
      render: (text, record) => (
        <Link
          to={`/contacts/${record.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Assigned Agent",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (agentName) =>
        agentName ? (
          <Tag color="blue">{agentName}</Tag>
        ) : (
          <Tag color="red">Unassigned</Tag>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Contacts</h1>
      <Table
        dataSource={contacts}
        columns={columns}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ContactTable;