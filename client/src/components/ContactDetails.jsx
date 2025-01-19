import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FieldTimeOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Avatar, Card, Timeline } from "antd";
import axios from "axios";

const downloadTranscript = (transcript, callId) => {
  const blob = new Blob([transcript], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `call_${callId}_transcript.txt`;
  link.click();
};

const ContactDetails = () => {
  const { id } = useParams();
  const [calls, setCalls] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://127.0.0.1:8000/contacts/${id}`);
        setUser(userResponse.data[0]);

        // Fetch call details
        const callsResponse = await axios.get(`http://127.0.0.1:8000/events/${id}`);
        setCalls(callsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col justify-start items-start m-4">
      <div className="flex flex-col justify-start items-start mb-4 w-full border-b-[1px] p-2 border-gray-200">
        {user ? (
          <div className="flex flex-row">
            <Avatar
              size="large"
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`}
            />
            <div className="flex flex-col ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <h1 className="text-md text-gray-500">{user.phone_number}</h1>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading user details...</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1 min-h-screen p-4 border-r-[1px] border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Details</h1>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Total"
                value={calls.reduce((total, call) => total + call.length, 0)}
                prefix={<FieldTimeOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Satisfaction"
                value={Math.floor(Math.random() * 30) + 70}
                suffix="/ 100"
              />
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Positive Sentiment"
                  value={calls.length > 0 ? (calls.filter(call => call.sentiment === "POSITIVE").length / calls.length) * 100 : 0}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Negative Sentiment"
                  value={calls.length > 0 ? (calls.filter(call => call.sentiment === "NEGATIVE").length / calls.length) * 100 : 0}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <h1 className="text-xl font-semibold text-gray-900 m-4">Events</h1>
          <div className="w-full flex flex-col justify-start items-start space-y-2 border border-base rounded-md p-4">
            <Timeline
              items={[
                ...calls.map(call => ({
                  children: `${call.name} | ${new Date(call.start_time).toLocaleString()} - ${new Date(call.end_time).toLocaleString()}`,
                  color:
                    call.type === "Meeting"
                      ? "blue"
                      : call.type === "Task"
                      ? "green"
                      : call.type === "Follow-up"
                      ? "orange"
                      : call.type === "Demo"
                      ? "purple"
                      : call.type === "Deadline"
                      ? "red"
                      : call.type === "Support"
                      ? "gray"
                      : "black",
                })),
              ]}
            />
          </div>
        </div>
        <div className="flex-1 min-h-screen p-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Calls</h1>
          {calls.length > 0 ? (
            calls.map((call) => (
              <div
                key={call.id}
                className="flex justify-between items-center p-2 border shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Call ID: {call.id} - Sentiment:{" "}
                    <span
                      className={`${
                        call.sentiment === "POSITIVE"
                          ? "text-green-600"
                          : call.sentiment === "NEUTRAL"
                          ? "text-gray-600"
                          : "text-red-600"
                      }`}
                    >
                      {call.sentiment}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Length: {call.length} seconds</p>
                  <p className="text-sm text-gray-500">Summary: {call.summary}</p>
                  <p className="text-sm text-gray-400">
                    Timestamp: {new Date(call.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => downloadTranscript(call.transcript, call.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                >
                  Download Transcript
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No calls available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;