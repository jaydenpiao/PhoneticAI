import React, { useEffect, useState } from "react";
import axios from "axios";
import Contact from "./Contact";

const AgentAssign = () => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch agents and contacts
    const fetchData = async () => {
      try {
        const [agentsResponse, contactsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/agents"),
          axios.get("http://127.0.0.1:8000/contacts"),
        ]);

        const agents = agentsResponse.data;
        const contacts = contactsResponse.data;

        // Group contacts by agent or unassigned
        const contactsByAgent = {};
        const unassignedContacts = [];

        contacts.forEach((contact) => {
          if (contact.agent_id === null) {
            // Unassigned contact
            unassignedContacts.push({
              id: contact.id,
              name: contact.name,
              phone: contact.phone_number,
            });
          } else {
            // Assigned contact
            if (!contactsByAgent[contact.agent_id]) {
              const agent = agents.find(
                (agent) => agent.id === contact.agent_id
              );
              contactsByAgent[contact.agent_id] = {
                title: agent ? agent.name : `Agent ${contact.agent_id}`,
                id: `agent_${contact.agent_id}`,
                contacts: [],
              };
            }
            contactsByAgent[contact.agent_id].contacts.push({
              id: contact.id,
              name: contact.name,
              phone: contact.phone_number,
            });
          }
        });

        // Build columns: unassigned first, then agents
        const columnsData = [
          {
            title: "Unassigned",
            id: "unassigned",
            contacts: unassignedContacts,
          },
          ...Object.values(contactsByAgent),
        ];

        setColumns(columnsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDrop = async (event, targetColumnId) => {
    event.preventDefault();
    const contactId = event.dataTransfer.getData("contactId");
    const sourceColumnId = event.dataTransfer.getData("sourceColumnId");

    const targetAgentId =
      targetColumnId === "unassigned"
        ? null
        : parseInt(targetColumnId.split("_")[1], 10);

    try {
      // Update contact's agent on the server
      await axios.put(
        `http://127.0.0.1:8000/contacts/${contactId}/${targetAgentId}`
      );

      // Update state
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const sourceColumn = newColumns.find(
          (col) => col.id === sourceColumnId
        );
        const targetColumn = newColumns.find(
          (col) => col.id === targetColumnId
        );

        const contactIndex = sourceColumn.contacts.findIndex(
          (contact) => contact.id === parseInt(contactId, 10)
        );
        const [movedContact] = sourceColumn.contacts.splice(contactIndex, 1);

        targetColumn.contacts.push(movedContact);
        return newColumns;
      });
    } catch (error) {
      console.error("Error updating contact's agent:", error);
    }
  };

  const handleDragStart = (event, contactId, sourceColumnId) => {
    event.dataTransfer.setData("contactId", contactId);
    event.dataTransfer.setData("sourceColumnId", sourceColumnId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex overflow-x-auto gap-6 p-4 w-full h-full bg-white">
      <div className="flex flex-row min-w-[100%] space-x-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col flex-shrink-0 w-1/3 bg-gray-50 shadow-lg rounded-md min-h-screen"
            onDrop={(event) => handleDrop(event, column.id)}
            onDragOver={handleDragOver}
          >
            <div className="p-4 border-b bg-blue-50 rounded-md">
              <h2 className="text-lg text-blue-800 font-bold">{column.title}</h2>
              <p className="text-sm text-gray-600">
                {column.contacts.length} Contacts
              </p>
            </div>
            <div className="flex-1 overflow-y-auto h-96 p-4 space-y-4">
              {column.contacts.map((contact) => (
                <Contact
                  key={contact.id}
                  contact={contact}
                  sourceColumnId={column.id}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
            <div className="p-4 text-center text-gray-500 hover:text-gray-700 cursor-pointer">
              + Add Contact
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentAssign;
