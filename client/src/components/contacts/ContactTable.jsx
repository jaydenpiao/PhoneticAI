import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import axios from "axios";

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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
            notes: contact.notes || "---",
          }))
        );
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Function to handle adding a new contact
  const handleAddContact = async (values) => {
    try {
      // Send POST request to add the contact
      await axios.post("http://127.0.0.1:8000/contacts", values);
      message.success("Contact added successfully!");
      setIsModalVisible(false);
      form.resetFields();

      // Refresh contact list
      const response = await axios.get("http://127.0.0.1:8000/contacts");
      setContacts(
        response.data.map((contact, index) => ({
          key: index.toString(),
          contact_name: contact.name,
          phone_number: contact.phone_number,
          agent_name: contact.agent_name,
          notes: contact.notes || "---",
        }))
      );
    } catch (error) {
      console.error("Error adding contact:", error);
      message.error("Failed to add contact. Please try again.");
    }
  };

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
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        className="mb-4"
      >
        Add Contact
      </Button>
      <Table
        dataSource={contacts}
        columns={columns}
        bordered
        pagination={{ pageSize: 9 }}
      />

      {/* Modal for Adding Contact */}
      <Modal
        title="Add New Contact"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Add Contact"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddContact}
          initialValues={{ name: "", phone_number: "", notes: "" }}
        >
          <Form.Item
            name="name"
            label="Contact Name"
            rules={[
              { required: true, message: "Please enter the contact name!" },
            ]}
          >
            <Input placeholder="Enter contact name" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please enter a valid phone number!",
              },
              {
                pattern: /^\+?\d{10,15}$/,
                message: "Phone number must be between 10 and 15 digits!",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="notes" label="Notes" rules={[{ required: false }]}>
            <Input.TextArea
              placeholder="Enter notes for this contact"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactTable;
