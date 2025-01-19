import React from "react";

const Agents = () => {
  const agents = [
    {
      name: "AI Sales Agent",
      description:
        "Specialized in handling sales calls, offering product recommendations, and converting leads into customers effortlessly.",
    },
    {
      name: "Customer Support Agent",
      description:
        "Handles customer queries, resolves issues, and ensures customer satisfaction with a friendly and reliable approach.",
    },
    {
      name: "Appointment Scheduler",
      description:
        "Automates scheduling tasks, manages calendars, and sends reminders to ensure seamless organization.",
    },
    {
      name: "Enterprise CRM Agent",
      description:
        "Seamlessly integrates with your CRM to manage customer interactions, update records, and streamline workflows.",
    },
    {
      name: "Survey and Feedback Agent",
      description:
        "Conducts post-call surveys, collects feedback, and generates actionable insights to improve services.",
    },
    {
      name: "Virtual Receptionist",
      description:
        "Answers incoming calls, provides information, and routes calls to the appropriate department with efficiency.",
    },
  ];

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
          {agents.map((agent, idx) => (
            <div
              key={idx}
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
              <h3 className="mb-2 text-xl font-bold">
                {agent.name}
              </h3>
              <p className="text-gray-400">{agent.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
