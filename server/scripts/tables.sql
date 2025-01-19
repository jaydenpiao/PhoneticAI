CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prompt TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    agent_id INT,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS calls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT,
    agent_id INT,
    transcript TEXT,
    length INT,
    summary TEXT,
    sentiment ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Meeting', 'Task', 'Follow-up', 'Demo', 'Deadline', 'Support'),
    contact_id INT,
    call_id INT,
    start_time DATETIME,
    end_time DATETIME,
    agent_id INT,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    FOREIGN KEY (call_id) REFERENCES calls(id)
);