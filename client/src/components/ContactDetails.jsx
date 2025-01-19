import React from "react";
import { useParams } from "react-router-dom";
import { LikeOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Avatar, Card, Timeline } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const calls = [
  {
    id: 1,
    contact_id: 1,
    agent_id: 2,
    transcript: "This is the transcript for call 1.",
    length: 120,
    summary: "Discussed project requirements.",
    sentiment: "POSITIVE",
    timestamp: "2025-01-17 10:00:00",
  },
  {
    id: 2,
    contact_id: 1,
    agent_id: 3,
    transcript: "This is the transcript for call 2.",
    length: 300,
    summary: "Talked about pricing options.",
    sentiment: "NEUTRAL",
    timestamp: "2025-01-18 14:30:00",
  },
  {
    id: 3,
    contact_id: 1,
    agent_id: 4,
    transcript: "This is the transcript for call 3.",
    length: 150,
    summary: "Resolved an issue with the service.",
    sentiment: "NEGATIVE",
    timestamp: "2025-01-19 11:15:00",
  },
];

const downloadTranscript = (transcript, callId) => {
  const blob = new Blob([transcript], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `call_${callId}_transcript.txt`;
  link.click();
};

const ContactDetails = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col justify-start items-start m-4">
      <div className="flex flex-col justify-start items-start mb-4 w-full border-b-[1px] p-2 border-gray-200">
        <div className="flex flex-row">
          <Avatar
            size="large"
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=102"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">Sashank Shukla</h1>
            <h1 className="text-md text-gray-500">+1(437) 777-2712</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1 min-h-screen p-4 border-r-[1px] border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Details</h1>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Feedback"
                value={1128}
                prefix={<LikeOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic title="Unmerged" value={93} suffix="/ 100" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Idle"
                  value={9.3}
                  precision={2}
                  valueStyle={{
                    color: "#cf1322",
                  }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <h1 className="text-xl font-semibold text-gray-900 m-4">Events</h1>
          <div className="w-full flex flex-col justify-start items-start space-y-2 border border-base rounded-md p-4">
            <div className="flex flex-row justify-between items-center mb-2 space-x-4">
              <p className="text-normal text-xl font-medium">Activity</p>
              <p className="text-sm text-subtitle">See All</p>
            </div>
            <Timeline
              items={[
                {
                  children: "@sashankshukla Approved QT-021 2015-09-01",
                  color: "green",
                },
                {
                  children: "QT-021 sent for approval 2015-09-01",
                  color: "red",
                },
                {
                  children: "QT-021 created by @sashankshukla 2015-09-01",
                },
                {
                  children: "QT-021 created 2015-09-01",
                },
              ]}
            />
          </div>
        </div>
        {/* Right Section (1/3 width) */}
        <div className="flex-1 min-h-screen p-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Calls</h1>
          {calls.map((call) => (
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
                <p className="text-sm text-gray-500">
                  Length: {call.length} seconds
                </p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
