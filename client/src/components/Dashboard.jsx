import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic, Progress } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/statistics");
        setStatistics(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  if (!statistics) {
    return <div>Loading...</div>;
  }

  // Chart Data Preparation
  const callLengthData = {
    labels: statistics.call_length_by_time.map((item) => item[0]),
    datasets: [
      {
        label: "Call Length by Time (in seconds)",
        data: statistics.call_length_by_time.map((item) => item[1] / 1000),
        backgroundColor: "rgba(38, 128, 235, 0.1)",
        borderColor: "rgba(38, 128, 235, 1)", // Darker blue
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Usage & Statistics (YTD)</h1>

      <div className="flex flex-row">
        <div className="w-1/2">
          {/* Call Statistics */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={24}>
              <Card title="Call Statistics" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Statistic
                      title="Average Call (s)"
                      value={(statistics.call_stats.avg_length / 1000).toFixed(2)}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Total Call Seconds"
                      value={(statistics.call_stats.total_length / 1000).toFixed(2)}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Longest Call (s)"
                      value={(statistics.call_stats.max_length / 1000).toFixed(2)}
                      valueStyle={{ color: "#cf1322" }}
                      prefix={<ArrowDownOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Shortest Call (s)"
                      value={(statistics.call_stats.min_length / 1000).toFixed(2)}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} className="pl-12">
          {/* Calendar Events */}
          <Col span={12}>
            <Card title="Calendar Events" bordered={false}>
              <Statistic
                title="Total Events (added to Calendar)"
                value={statistics.calendar_event_count}
              />
            </Card>
          </Col>

          {/* Overall Sentiment */}
          <Col span={12} className="">
            <Card title="Overall Sentiment" bordered={false} className="ml-10">
              <p className="mb-2 font-medium">Sentiment Breakdown:</p>
              <Progress
                percent={(
                  (statistics.overall_sentiment.POSITIVE /
                    statistics.overall_sentiment.total_count) *
                  100
                ).toFixed(1)}
                format={(percent) => `Positive: ${percent}%`}
                strokeColor="#4caf50"
                className="mb-2"
              />
              <Progress
                percent={(
                  (statistics.overall_sentiment.NEUTRAL /
                    statistics.overall_sentiment.total_count) *
                  100
                ).toFixed(1)}
                format={(percent) => `Neutral: ${percent}%`}
                strokeColor="#ff9800"
                className="mb-2"
              />
              <Progress
                percent={(
                  (statistics.overall_sentiment.NEGATIVE /
                    statistics.overall_sentiment.total_count) *
                  100
                ).toFixed(1)}
                format={(percent) => `Negative: ${percent}%`}
                strokeColor="#f44336"
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} className="m-4">
        {/* Call Length by Time */}
        <Col span={24}>
          <Card title="Call Length by Time" bordered={false}>
            <div style={{ maxWidth: "100%", height: "300px" }}>
              {" "}
              {/* Adjust height here */}
              <Line
                data={callLengthData}
                options={{
                  maintainAspectRatio: false, // Allows the chart to resize properly
                  responsive: true, // Ensures the chart resizes with the container
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
