import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Typography } from "antd";

const { Text } = Typography;

const textModels = [
  "gpt-4o",
  "gpt-o1-mini",
  "gpt-3.5-hybrid",
  "anthropic-4b",
  "llama-72b-turbo",
  "whisper-1",
  "text-bison",
  "vertex-ai-palm",
  "bert-base-uncased",
  "claude-instant-v1",
  "claude-2",
  "azure-gpt-4",
  "azure-davinci",
  "ernie-4.0",
];

const Agents = () => {
  const [agents, setAgents] = useState([]);
  console.log(agents);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/agents");
        setAgents(response.data); // Axios automatically parses JSON
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="px-4 py-8 mx-auto max-w-screen-xl">
        <div className="max-w-screen-md mb-4">
          <h1 className="text-2xl font-bold mb-4">Meet our AI Agents</h1>
          <p className="text-gray-500 sm:text-md">
            Discover our agents and their characteristics and assign them to
            serve your contacts.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-start items-center space-x-2">
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-blue-100">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
                      Math.floor(Math.random() * 1000) + 1
                    }`}
                    size={"large"}
                  />

                  {/* <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 110 2 1 1 0 010-2zm4 8a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 110 2 1 1 0 010-2z"></path>
                </svg> */}
                </div>
                <Text code>
                  {textModels[Math.floor(Math.random() * textModels.length)]}
                </Text>
              </div>
              <h3 className="mb-2 text-xl font-bold">{agent.name}</h3>
              <p className="text-gray-400">{agent.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
