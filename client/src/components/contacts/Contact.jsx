import React from "react";
import { Card, Avatar } from "antd";

const Contact = ({ key, contact, sourceColumnId, onDragStart }) => {
  console.log(contact);
  return (
    <Card
      className="contact-card"
      draggable
      onDragStart={(event) => onDragStart(event, contact.id, sourceColumnId)}
    >
      <div className="flex items-center space-x-4">
        <Avatar
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
            Math.floor(Math.random() * 1000) + 1
          }`}
        />
        {/* Contact Details */}
        <div>
          <p className="text-lg font-bold">{contact.name}</p>
          <p className="text-gray-500">{contact.phone}</p>
        </div>
      </div>
    </Card>
  );
};

export default Contact;
