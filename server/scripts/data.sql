-- Agents (6 rows)
INSERT INTO agents (name, prompt) VALUES
  ('Alice Johnson', 'Friendly and outgoing with a collaborative tone.'),
  ('Bob Smith', 'Efficient and direct, a no-nonsense problem solver.'),
  ('Carla Gomez', 'Creative and empathetic, focused on customer satisfaction.'),
  ('David Lee', 'Analytical and detail oriented, loves scheduling and planning.'),
  ('Eva Patel', 'Enthusiastic and persuasive with a knack for follow-up.'),
  ('Frank Murphy', 'Calm and professional, dedicated to support and resolution.');

-- Contacts (20 rows)
INSERT INTO contacts (name, phone_number, agent_id) VALUES
  ('Michael Brown', '604-555-1212', 1),
  ('Linda Green', '604-555-2323', 2),
  ('Sarah Williams', '604-555-3434', 3),
  ('John Davis', '604-555-4545', 4),
  ('Patricia Taylor', '604-555-5656', 5),
  ('Robert Wilson', '604-555-6767', 6),
  ('Jennifer Moore', '604-555-7878', 1),
  ('William Anderson', '604-555-8989', 2),
  ('Elizabeth Thomas', '604-555-9090', 3),
  ('Charles Jackson', '604-555-1111', 4),
  ('Barbara White', '604-555-2222', 5),
  ('Christopher Harris', '604-555-3333', 6),
  ('Jessica Martin', '604-555-4444', 1),
  ('Matthew Thompson', '604-555-5555', 2),
  ('Susan Garcia', '604-555-6666', 3),
  ('Anthony Martinez', '604-555-7777', 4),
  ('Karen Robinson', '604-555-8888', 5),
  ('Daniel Clark', '604-555-9999', 6),
  ('Nancy Rodriguez', '604-555-0000', 1),
  ('Paul Lewis', '604-555-1213', 2);

-- Calls (30 rows)
-- First 15 calls: calls that resulted in calendar events.
INSERT INTO calls (contact_id, agent_id, transcript, length, summary, sentiment) VALUES
  (1, 1, 
    'Agent: Hi Michael, thanks for joining. How are you today?\nContact: Hi Alice, I\'m good. I wanted to discuss the quarterly performance numbers.\nAgent: Absolutely, let\'s review the key metrics and trends.\nContact: That sounds great. I have some data to share.', 
    600, 'Quarterly meeting scheduled', 'POSITIVE'),
    
  (2, 2, 
    'Agent: Hello Linda, I\'m calling about the new financial report task.\nContact: Hi Bob, I\'m ready to get started. What are the main points?\nAgent: We need to include the latest expense trends and revenue streams.\nContact: I understand. I\'ll prepare the draft today.', 
    480, 'Financial report task', 'NEUTRAL'),
    
  (3, 3, 
    'Agent: Hi Sarah, following up on the service you received last week.\nContact: Hello Carla, yes, I have some feedback to share.\nAgent: Great, I\'m here to listen. What went well and what could improve?\nContact: Overall good, though there were minor delays.', 
    540, 'Service follow-up', 'POSITIVE'),
    
  (4, 4, 
    'Agent: Hi John, welcome to the product demo call.\nContact: Hi David, excited to see the new features.\nAgent: I will walk you through the functionalities. Let me know if you have questions.\nContact: Sure, the presentation is clear so far.', 
    660, 'Product demo', 'POSITIVE'),
    
  (5, 5, 
    'Agent: Good day Patricia, I wanted to talk about the upcoming project deadline.\nContact: Hello Eva, I have some concerns about the timeline.\nAgent: Let\'s discuss which deliverables need extra attention.\nContact: I appreciate that; we can adjust some milestones.', 
    300, 'Project deadline discussion', 'NEGATIVE'),
    
  (6, 6, 
    'Agent: Hi Robert, thanks for calling support about your software issue.\nContact: Hello Frank, the system is not logging in properly.\nAgent: I will guide you through a few troubleshooting steps.\nContact: Thanks, I\'m ready to try them out.', 
    720, 'Software support', 'NEUTRAL'),
    
  (7, 1, 
    'Agent: Hi Jennifer, let\'s finalize the contract details over this call.\nContact: Hi Alice, I have a couple of questions about the clauses.\nAgent: I\'m here to clarify. Which part needs explanation?\nContact: The payment schedule section is unclear to me.', 
    450, 'Contract finalization meeting', 'POSITIVE'),
    
  (8, 2, 
    'Agent: Hello William, calling regarding the marketing strategy task.\nContact: Hi Bob, I\'m all ears about the new plan.\nAgent: We need to update our campaigns for the next quarter.\nContact: I\'ll gather the current stats and proceed accordingly.', 
    510, 'Marketing task', 'NEUTRAL'),
    
  (9, 3, 
    'Agent: Hi Elizabeth, I\'m following up on last month\'s feedback.\nContact: Hello Carla, I have several points I want to mention.\nAgent: Let\'s go through them one by one. What was the main area of improvement?\nContact: Customer service response time needs to be faster.', 
    630, 'Client feedback follow-up', 'POSITIVE'),
    
  (10, 4, 
    'Agent: Hi Charles, welcome to the demo call on our new service offering.\nContact: Hi David, I\'m curious about how this service differs from the old one.\nAgent: I will explain the unique benefits and answer your questions.\nContact: That sounds promising, I\'m ready for details.', 
    600, 'Service demo', 'POSITIVE'),
    
  (11, 5, 
    'Agent: Hi Barbara, let\'s review the upcoming project milestones.\nContact: Hi Eva, I want to ensure we meet all deadlines.\nAgent: We can adjust the timeline if necessary. What do you think?\nContact: I believe a slight extension could be beneficial.', 
    480, 'Milestone deadline review', 'NEUTRAL'),
    
  (12, 6, 
    'Agent: Hello Christopher, I understand you\'re having issues accessing your account.\nContact: Hi Frank, yes, I can\'t log in despite using the right credentials.\nAgent: I\'ll help you reset your password and check your account status.\nContact: Thank you, that would be very helpful.', 
    550, 'Account support call', 'NEUTRAL'),
    
  (13, 1, 
    'Agent: Hi Jessica, thanks for joining. Let\'s discuss market expansion plans.\nContact: Hello Alice, I have ideas for entering new regions.\nAgent: Wonderful, share your insights so we can strategize.\nContact: I believe targeting the west coast is our next step.', 
    620, 'Market expansion meeting', 'POSITIVE'),
    
  (14, 2, 
    'Agent: Hello Matthew, I want to delegate some tasks for our team meeting.\nContact: Hi Bob, please brief me on the responsibilities.\nAgent: I will outline the new assignments and deadlines.\nContact: Understood, I\'ll organize my team accordingly.', 
    500, 'Team task delegation', 'NEUTRAL'),
    
  (15, 3, 
    'Agent: Hi Susan, I\'m calling to follow up on contract amendments.\nContact: Hello Carla, I reviewed the changes and have a few comments.\nAgent: Let\'s go through the amendments so I can note your feedback.\nContact: Sure, the payment terms need a slight adjustment.', 
    530, 'Contract amendment follow-up', 'NEUTRAL');

-- Next 15 calls: non-calendar related calls.
INSERT INTO calls (contact_id, agent_id, transcript, length, summary, sentiment) VALUES
  (16, 4, 
    'Agent: Hi Anthony, let\'s talk about your contract renewal.\nContact: Hi David, I have concerns about the new pricing structure.\nAgent: I can explain the changes and discuss options.\nContact: That would be great, I want to make sure it fits our budget.', 
    480, 'Contract renewal discussed', 'NEUTRAL'),
    
  (17, 5, 
    'Agent: Hello Karen, thanks for reaching out about the bulk order discounts.\nContact: Hi Eva, I need details on membership benefits and discounts.\nAgent: I will outline our available packages and incentives.\nContact: Excellent, I look forward to the offer details.', 
    510, 'Bulk order inquiry', 'POSITIVE'),
    
  (18, 6, 
    'Agent: Hi Daniel, let\'s discuss our strategy for the upcoming product launch.\nContact: Hi Frank, I have some ideas and questions on promotion tactics.\nAgent: We can review the current plan and brainstorm improvements.\nContact: Sounds good, I believe a combined effort will work best.', 
    600, 'Product launch discussion', 'POSITIVE'),
    
  (19, 1, 
    'Agent: Hi Michael, I see billing issues on your account. Let\'s address them.\nContact: Hello Alice, I noticed discrepancies in the recent invoice.\nAgent: I will walk you through the charges and resolve any errors.\nContact: Thanks, I appreciate the quick help.', 
    550, 'Billing issues addressed', 'NEGATIVE'),
    
  (20, 2, 
    'Agent: Hello Linda, let\'s discuss the latest market trends and investment opportunities.\nContact: Hi Bob, I have questions about the potential returns.\nAgent: I will share our analysis and forecast data.\nContact: Great, I want to explore this further.', 
    580, 'Market trends discussion', 'NEUTRAL'),
    
  (1, 3, 
    'Agent: Hi Michael, let\'s review the software integration options.\nContact: Hello Carla, I\'m interested in understanding the future roadmap.\nAgent: I will detail the integration plan and upcoming features.\nContact: I appreciate the clarity; it helps our planning.', 
    640, 'Integration review', 'POSITIVE'),
    
  (2, 4, 
    'Agent: Hi Linda, thanks for consulting on logistics improvements.\nContact: Hi David, we need to optimize our supply chain.\nAgent: I can suggest some operational changes for better flow.\nContact: That sounds promising, let\'s get into specifics.', 
    500, 'Logistics consultation', 'NEUTRAL'),
    
  (3, 5, 
    'Agent: Hello Sarah, I want to talk about the service contract terms.\nContact: Hi Eva, I have concerns about the renewal conditions.\nAgent: Let\'s review the clauses and negotiate better terms.\nContact: I appreciate the proactive approach.', 
    530, 'Contract negotiation', 'NEGATIVE'),
    
  (4, 6, 
    'Agent: Hi John, let\'s discuss customization options for our enterprise solutions.\nContact: Hello Frank, I need to know what can be adjusted for our use case.\nAgent: I will outline the available custom features and pricing.\nContact: That is useful information, thank you.', 
    610, 'Customization discussion', 'POSITIVE'),
    
  (5, 1, 
    'Agent: Hi Patricia, I hear there are issues with product returns.\nContact: Hello Alice, I\'ve encountered delays in processing returns.\nAgent: Let me guide you through the proper process and resolve this.\nContact: I appreciate the assistance.', 
    470, 'Product return resolution', 'NEUTRAL'),
    
  (6, 2, 
    'Agent: Hello Robert, let\'s discuss feedback on our new app features.\nContact: Hi Bob, I have some usability suggestions.\nAgent: I would love to hear what you think and take notes.\nContact: Great, I\'ll detail my experience for improvements.', 
    520, 'Usability feedback', 'POSITIVE'),
    
  (7, 3, 
    'Agent: Hi Jennifer, I\'m calling about our maintenance plan options.\nContact: Hello Carla, I need clarity on the available service packages.\nAgent: I will explain the different plans and their benefits.\nContact: That makes it easier to choose the right option.', 
    500, 'Maintenance inquiry', 'NEUTRAL'),
    
  (8, 4, 
    'Agent: Hi William, let\'s have a discussion on digital transformation.\nContact: Hello David, I am eager to learn about technology upgrades.\nAgent: I will share our recommendations and next steps.\nContact: Excellent, this could really enhance our workflow.', 
    630, 'Tech upgrade discussion', 'POSITIVE'),
    
  (9, 5, 
    'Agent: Hi Elizabeth, I understand there are issues with your software migration.\nContact: Hello Eva, I have been facing several challenges in the process.\nAgent: Let\'s review the issues and identify a resolution strategy.\nContact: I appreciate your help in addressing these concerns.', 
    590, 'Migration issues discussed', 'NEGATIVE'),
    
  (10, 6, 
    'Agent: Hi Charles, let\'s evaluate potential partnerships for collaboration.\nContact: Hello Frank, I am interested in exploring new opportunities.\nAgent: I will present a few strategic options and benefits.\nContact: Great, that should help us decide the next steps.', 
    610, 'Partnership evaluation', 'POSITIVE');

-- Calendar Events (15 rows) referencing calls 1-15
INSERT INTO calendar_events (name, type, contact_id, call_id, start_time, end_time, agent_id) VALUES
  ('Quarterly Performance Meeting', 'Meeting', 1, 1, '2025-02-10 09:00:00', '2025-02-10 10:00:00', 1),
  ('Financial Report Task', 'Task', 2, 2, '2025-02-11 11:00:00', '2025-02-11 11:30:00', 2),
  ('Service Follow-up', 'Follow-up', 3, 3, '2025-02-12 14:00:00', '2025-02-12 14:30:00', 3),
  ('Product Demo', 'Demo', 4, 4, '2025-02-13 15:00:00', '2025-02-13 16:00:00', 4),
  ('Project Deadline Review', 'Deadline', 5, 5, '2025-02-14 10:00:00', '2025-02-14 10:30:00', 5),
  ('Software Support Session', 'Support', 6, 6, '2025-02-15 09:30:00', '2025-02-15 10:30:00', 6),
  ('Contract Finalization Meeting', 'Meeting', 7, 7, '2025-02-16 13:00:00', '2025-02-16 14:00:00', 1),
  ('Marketing Strategy Task', 'Task', 8, 8, '2025-02-17 11:00:00', '2025-02-17 11:45:00', 2),
  ('Client Feedback Follow-up', 'Follow-up', 9, 9, '2025-02-18 15:00:00', '2025-02-18 15:30:00', 3),
  ('Service Demo', 'Demo', 10, 10, '2025-02-19 16:00:00', '2025-02-19 17:00:00', 4),
  ('Milestone Deadline Review', 'Deadline', 11, 11, '2025-02-20 10:00:00', '2025-02-20 10:30:00', 5),
  ('Account Support Session', 'Support', 12, 12, '2025-02-21 09:30:00', '2025-02-21 10:30:00', 6),
  ('Market Expansion Meeting', 'Meeting', 13, 13, '2025-02-22 09:00:00', '2025-02-22 10:00:00', 1),
  ('Team Task Delegation', 'Task', 14, 14, '2025-02-23 11:00:00', '2025-02-23 11:30:00', 2),
  ('Contract Amendment Follow-up', 'Follow-up', 15, 15, '2025-02-24 14:00:00', '2025-02-24 14:30:00', 3);