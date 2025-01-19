import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FieldTimeOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import {
  Col,
  Row,
  Statistic,
  Avatar,
  Card,
  Timeline,
  Typography,
  Button,
  Divider,
  Space,
} from "antd";
import axios from "axios";

const { Paragraph, Text, Title } = Typography;

const CallList = ({ calls, downloadTranscript }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return <SmileOutlined style={{ color: "green", fontSize: "20px" }} />;
      case "NEUTRAL":
        return <MehOutlined style={{ color: "orange", fontSize: "20px" }} />;
      case "NEGATIVE":
        return <FrownOutlined style={{ color: "red", fontSize: "20px" }} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-0">
      {calls.map((call) => (
        <Card
          key={call.id}
          className="shadow-sm"
          bordered
          bodyStyle={{ padding: "12px" }}
          style={{ borderRadius: "0", borderBottom: "1px solid #d9d9d9" }} // Removed rounded corners
        >
          <div className="flex justify-between items-start">
            {/* Call Details */}
            <div className="flex flex-col space-y-1">
              <div className="flex flex-row space-x-2 justify-start align-middle">
                <Title level={5} className="mb-0">
                  #{call.id} : {call.summary || "No summary"}
                </Title>
                <Text className="text-xs text-gray-500 pt-1">
                  {new Date(call.timestamp).toLocaleString()} for{" "}
                  {call.length} seconds
                </Text>
                <Space align="center" className="mb-1">
                  {getSentimentIcon(call.sentiment)}
                </Space>
              </div>
              <div className="flex flex-row space-x-4">
                <audio
                  controls
                  style={{ width: "500px", marginTop: "6px" }}
                  src={call.audio_url} // Ensure the audio URL is provided in your call object
                >
                  Your browser does not support the audio element.
                </audio>
                <Button
                  type="primary"
                  size="default"
                  className="bg-white text-blue-700 mt-4"
                  icon={<DownloadOutlined />}
                  onClick={() => downloadTranscript(call.transcript, call.id)}
                ></Button>
              </div>
            </div>

            {/* Download Button */}
          </div>
        </Card>
      ))}
    </div>
  );
};

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
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/contacts/${id}`
        );
        setUser(userResponse.data[0]);

        const callsResponse = await axios.get(
          `http://127.0.0.1:8000/contacts/${id}/calls`
        );
        setCalls(callsResponse.data);

        const eventsResponse = await axios.get(
          `http://127.0.0.1:8000/events/${id}/`
        );
        setEvents(eventsResponse.data);
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
          <div className="p-4 border rounded-md shadow-sm">
            <Row gutter={16}>
              <Col span={12}>
                <Card bordered={true} className="border-[1px] bg-blue-50">
                  <Statistic
                    title="Total Call Time (s)"
                    value={
                      calls.reduce((total, call) => total + call.length, 0)}
                    prefix={<FieldTimeOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={true} className="border-[1px] bg-blue-50">
                  <Statistic
                    title="Satisfaction"
                    value={Math.floor(Math.random() * 30) + 70}
                    suffix="/ 100"
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <Card bordered={true} className="border-[1px] bg-blue-50">
                  <Statistic
                    title="Positive Sentiment"
                    value={
                      calls.length > 0
                        ? (calls.filter((call) => call.sentiment === "POSITIVE")
                            .length /
                            calls.length) *
                          100
                        : 0
                    }
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={true} className="border-[1px] bg-blue-50">
                  <Statistic
                    title="Negative Sentiment"
                    value={
                      calls.length > 0
                        ? (calls.filter((call) => call.sentiment === "NEGATIVE")
                            .length /
                            calls.length) *
                          100
                        : 0
                    }
                    precision={2}
                    valueStyle={{ color: "#cf1322" }}
                    prefix={<ArrowDownOutlined />}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mt-6">Events</h1>
          <div className="w-full flex flex-col justify-start items-start space-y-2 p-4">
            <Timeline
              items={[
                ...events.map((call) => ({
                  children: `${call.name} | ${new Date(
                    call.start_time
                  ).toLocaleString()} - ${new Date(
                    call.end_time
                  ).toLocaleString()}`,
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
            <CallList calls={calls} downloadTranscript={downloadTranscript} />
          ) : (
            <p className="text-gray-500">No calls available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
