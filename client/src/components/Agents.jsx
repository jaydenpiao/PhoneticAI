import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold">
            Meet Our AI Agents
          </h2>
          <p className="text-gray-500 sm:text-xl">
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
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 110 2 1 1 0 010-2zm4 8a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 110 2 1 1 0 010-2z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">{agent.name}</h3>
              <p className="text-gray-400">{agent.prompt}</p>
              {agent.phone_number && (
                <p className="text-sm text-gray-500 mt-2">
                  Phone: {agent.phone_number}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;