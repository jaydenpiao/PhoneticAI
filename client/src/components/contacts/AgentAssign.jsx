import React, { useState } from "react";
import Contact from "./Contact";

const AgentAssign = () => {
  const initialColumns = [
    {
      title: "Unassigned",
      id: "unassigned",
      contacts: [
        { id: 1, name: "John Doe", phone: "123-456-7890" },
        { id: 2, name: "Jane Smith", phone: "987-654-3210" },
      ],
    },
    {
      title: "Jake",
      id: "agent1",
      contacts: [],
    },
    {
      title: "Chloe",
      id: "agent2",
      contacts: [],
    },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const handleDrop = (event, targetColumnId) => {
    event.preventDefault();
    const contactId = event.dataTransfer.getData("contactId");
    const sourceColumnId = event.dataTransfer.getData("sourceColumnId");

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      const contactIndex = sourceColumn.contacts.findIndex(
        (contact) => contact.id === parseInt(contactId, 10)
      );
      const [movedContact] = sourceColumn.contacts.splice(contactIndex, 1);

      targetColumn.contacts.push(movedContact);
      return newColumns;
    });
  };

  const handleDragStart = (event, contactId, sourceColumnId) => {
    event.dataTransfer.setData("contactId", contactId);
    event.dataTransfer.setData("sourceColumnId", sourceColumnId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-start gap-6 p-6 w-full h-full bg-white">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col w-full sm:w-1/3 bg-gray-100 shadow-lg rounded-md min-h-screen"
          onDrop={(event) => handleDrop(event, column.id)}
          onDragOver={handleDragOver}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">{column.title}</h2>
            <p className="text-sm text-gray-500">
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
  );
};

export default AgentAssign;
