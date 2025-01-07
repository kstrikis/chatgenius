## **Development Roadmap**

**Note:** Each task should be developed in its own Git branch (e.g., `feature/task-name`) and follow TDD practices. Begin by writing tests, implement code to pass the tests, and debug as necessary before moving to the next task.

### **Phase 1: Establish Robust Client-Server Architecture**

#### **Task 1: Initial Project Setup**

- **Branch:** `feature/initial-setup`
- **Objectives:**
  - Initialize Git repository with `.gitignore` for Node.js, React.js, and Cypress.
  - Set up directory structure:
    - `/client` - React.js frontend
    - `/server` - Node.js backend
    - `/e2e` - Cypress end-to-end tests
  - Configure ESLint with Airbnb style guide and Prettier for code formatting.
  - Initialize `package.json` files for `client`, `server`, and `e2e`.
- **Tests:**
  - Ensure linting and formatting tools are correctly set up.
  - Verify folder structure and initial files exist.

---

#### **Task 2: Set Up Continuous Integration (CI) Pipeline**

- **Branch:** `feature/ci-setup`
- **Objectives:**
  - Configure GitHub Actions for automated testing and linting on push and pull requests.
  - Include separate workflows for `client`, `server`, and `e2e` tests.
- **Tests:**
  - Push a commit to verify that CI runs and passes for initial setup.

---

#### **Task 3: Backend Setup with Express.js and PostgreSQL**

- **Branch:** `feature/backend-setup`
- **Objectives:**
  - Set up Express.js server with basic route (`GET /api/health`) returning a health check message.
  - Configure PostgreSQL connection using `pg` or an ORM like Sequelize.
  - Create a script for initializing the database connection.
- **Tests:**
  - Write a test for the health check endpoint.
  - Write a test to confirm successful database connection.

---

#### **Task 4: Implement User Model and Migrations**

- **Branch:** `feature/user-model`
- **Objectives:**
  - Define `User` model with fields: `id`, `username`, `email`, `password_hash`, `is_guest`, `created_at`, `updated_at`.
  - Create migration scripts for creating the `users` table.
- **Tests:**
  - Write unit tests for the `User` model validations.
  - Test migration scripts by running them and verifying the table structure.

---

#### **Task 5: Implement JWT Authentication for Registered and Guest Users**

- **Branch:** `feature/authentication`
- **Objectives:**
  - Create authentication endpoints in Express.js:
    - `POST /api/auth/register` - Register a new user.
    - `POST /api/auth/login` - Login existing user and issue JWT.
    - `POST /api/auth/guest` - Create a guest user session and issue JWT.
  - Implement JWT middleware to protect routes.
- **Tests:**
  - Write tests for registration and login, including success and failure cases.
  - Write tests for guest user creation.
  - Verify that protected routes are inaccessible without a valid JWT.

---

#### **Task 6: Frontend Setup with React.js**

- **Branch:** `feature/frontend-setup`
- **Objectives:**
  - Initialize React.js app in `/client`.
  - Set up routing with React Router.
  - Configure Redux or Context API for state management.
  - Implement ESLint and Prettier configurations.
- **Tests:**
  - Ensure the React app renders without errors.
  - Verify linting and formatting are enforced.

---

#### **Task 7: Implement Authentication Flow on Frontend**

- **Branch:** `feature/frontend-authentication`
- **Objectives:**
  - Create pages/components for:
    - Registration
    - Login
    - Guest access option
  - Set up JWT handling on the client side, storing tokens securely.
  - Redirect users after successful login or guest access.
- **Tests:**
  - Write unit tests for authentication components.
  - Write e2e tests in `/e2e` to cover the authentication flow.

---

#### **Task 8: Define Message and Channel Models with Migrations**

- **Branch:** `feature/message-channel-models`
- **Objectives:**
  - Define `Channel` model with fields: `id`, `name`, `is_private`, `created_at`, `updated_at`.
  - Define `Message` model with fields: `id`, `content`, `user_id`, `channel_id`, `created_at`, `updated_at`.
  - Create migration scripts for `channels` and `messages` tables.
- **Tests:**
  - Write unit tests for model validations.
  - Verify migrations create the correct table structures.

---

#### **Task 9: Implement Basic Messaging API Endpoints**

- **Branch:** `feature/messaging-api`
- **Objectives:**
  - Create endpoints for:
    - `GET /api/channels` - List available channels.
    - `POST /api/channels` - Create a new channel.
    - `GET /api/channels/:channelId/messages` - Get messages in a channel.
    - `POST /api/channels/:channelId/messages` - Post a new message.
  - Apply authentication middleware to protect routes.
- **Tests:**
  - Write tests for each endpoint, covering authorized and unauthorized access.
  - Test message creation and retrieval.

---

#### **Task 10: Frontend Integration of Messaging without WebSockets**

- **Branch:** `feature/frontend-messaging`
- **Objectives:**
  - Implement messaging UI components:
    - Channel list
    - Message list
    - Message input box
  - Use REST API calls to fetch and post messages (polling every few seconds).
- **Tests:**
  - Write unit tests for messaging components.
  - Write e2e tests to simulate user sending and receiving messages.

---

### **Phase 2: Introduce Real-Time Features and Data Persistence**

#### **Task 11: Implement WebSocket Communication with Socket.io**

- **Branch:** `feature/websockets`
- **Objectives:**
  - Set up Socket.io on the server and client.
  - Establish real-time communication for messaging.
  - Replace HTTP polling with WebSocket events for message updates.
- **Tests:**
  - Write tests for WebSocket event handling.
  - Ensure messages are broadcast to all connected clients in a channel.

---

#### **Task 12: Implement User Presence and Typing Indicators**

- **Branch:** `feature/user-presence`
- **Objectives:**
  - Track user connection status via WebSockets.
  - Emit events for user online/offline status.
  - Implement typing indicators when a user is composing a message.
- **Tests:**
  - Test presence updates when users connect/disconnect.
  - Test typing indicator visibility to other users.

---

#### **Task 13: Persist Messages and Users to Database**

- **Branch:** `feature/data-persistence`
- **Objectives:**
  - Ensure all messages are saved to the database.
  - Refactor code to retrieve messages from the database upon client connection.
  - Store guest users in the `users` table with `is_guest` flag.
- **Tests:**
  - Verify messages are correctly stored and retrieved.
  - Test that guest users are managed properly in the database.

---

#### **Task 14: Manage Guest User Sessions and Data Retention**

- **Branch:** `feature/guest-user-management`
- **Objectives:**
  - Implement logic to clean up guest users and their data after a certain time period.
  - Notify guests about data retention policies.
- **Tests:**
  - Test that guest data is deleted appropriately.
  - Ensure system stability during guest user cleanup.

---

#### **Task 15: Implement Role-Based Access Control (RBAC)**

- **Branch:** `feature/rbac`
- **Objectives:**
  - Define roles: Admin, Member, Guest.
  - Assign default roles upon user creation.
  - Enforce permissions in API endpoints based on roles.
- **Tests:**
  - Test access restrictions for different user roles.
  - Verify that guests have limited capabilities.

---

#### **Task 16: Implement Message Editing and Deletion**

- **Branch:** `feature/message-edit-delete`
- **Objectives:**
  - Allow users to edit or delete their messages within a specified time window.
  - Update API endpoints and client UI accordingly.
- **Tests:**
  - Write tests for message editing and deletion functionality.
  - Enforce time limits and permissions.

---

#### **Task 17: Implement File Attachments with AWS S3**

- **Branch:** `feature/file-attachments`
- **Objectives:**
  - Integrate AWS SDK for file uploads to S3.
  - Update the `Message` model to include file URLs.
  - Modify the client to support file attachment uploads.
- **Tests:**
  - Test file upload API with various file types and sizes.
  - Ensure files are stored and retrieved securely.

---

#### **Task 18: Implement Message Formatting and Emoji Support**

- **Branch:** `feature/message-formatting-emoji`
- **Objectives:**
  - Integrate Markdown parsing for messages.
  - Add support for emoji reactions to messages.
- **Tests:**
  - Test rendering of formatted messages.
  - Verify emoji reactions are saved and displayed correctly.

---

### **Phase 3: Enhance Functionality and Prepare for AI Integration**

#### **Task 19: Implement Search Functionality**

- **Branch:** `feature/search`
- **Objectives:**
  - Add full-text search capability using PostgreSQL.
  - Create API endpoint for searching messages.
  - Update client to include search interface.
- **Tests:**
  - Test search results for various queries.
  - Ensure permissions are enforced on search results.

---

#### **Task 20: Implement Threaded Messaging**

- **Branch:** `feature/threaded-messaging`
- **Objectives:**
  - Update `Message` model to support parent-child relationships.
  - Modify API and client to handle message threads.
- **Tests:**
  - Test creating and retrieving message threads.
  - Verify UI displays threads correctly.

---

#### **Task 21: Implement Notifications for Mentions and Direct Messages**

- **Branch:** `feature/notifications`
- **Objectives:**
  - Detect mentions in messages.
  - Send real-time notifications to mentioned users.
  - Implement direct messaging between users.
- **Tests:**
  - Write tests for notification delivery and display.
  - Test direct messaging functionality.

---

#### **Task 22: Optimize Performance and Scalability**

- **Branch:** `feature/performance-optimization`
- **Objectives:**
  - Implement caching strategies where appropriate.
  - Optimize database queries.
  - Conduct load testing and optimize accordingly.
- **Tests:**
  - Measure performance metrics before and after optimizations.
  - Ensure no regression in functionality.

---

#### **Task 23: Prepare Codebase for AI Integration**

- **Branch:** `feature/ai-preparation`
- **Objectives:**
  - Refactor code to allow seamless integration of AI features.
  - Ensure message context is appropriately stored and can be accessed by AI modules.
- **Tests:**
  - Verify that data needed for AI is correctly available.
  - Ensure refactoring does not introduce bugs.

---

### **Phase 4: Implement AI Features**

#### **Task 24: Basic AI Avatar Functionality**

- **Branch:** `feature/ai-avatar-basic`
- **Objectives:**
  - Integrate with an AI service (e.g., OpenAI API) for message generation.
  - Allow users to enable/disable AI responses on their behalf.
- **Tests:**
  - Test AI-generated messages for correctness and appropriateness.
  - Verify user control over AI features.

---

#### **Task 25: Context-Aware AI Responses**

- **Branch:** `feature/ai-context-awareness`
- **Objectives:**
  - Enhance AI integration to include conversation context.
  - Ensure AI respects user privacy and data regulations.
- **Tests:**
  - Test AI responses in various conversation scenarios.
  - Verify compliance with data handling policies.

---

### **Ongoing Tasks**

- **Code Reviews:** Every pull request must be reviewed and approved before merging.
- **Testing:** Maintain high test coverage; tests must pass before merging branches.
- **Documentation:** Keep API and developer documentation up to date.
- **Security Audits:** Regularly check for vulnerabilities and fix promptly.
- **User Feedback:** Continuously collect and incorporate user feedback.

---

## **Guidelines for Managing Guest Users**

- **Storage:**
  - Store guest users in the `users` table with an `is_guest` flag.
  - Assign a unique identifier to manage guest sessions.
- **Data Retention:**
  - Implement a cleanup process to remove guest users and data after a specified period (e.g., 24 hours).
- **Permissions:**
  - Restrict guest capabilities (e.g., cannot create channels, limited access to features).
  - Encourage guest users to register for full functionality.
- **Identification:**
  - Display guest users with a distinct label (e.g., "Guest1234") in the UI.

---

## **Approach for Error-Prone LLMs or Developers**

- **Clear Objectives:** Each task has specific goals and deliverables.
- **Isolated Tasks:** Tasks are independent to minimize conflicts.
- **Test-Driven Development:**
  - Begin with writing tests to define expected behavior.
  - Implement code to pass the tests.
- **Debugging:** Encourage resolving issues in each task before moving on.
- **Branch Management:** Use descriptive branch names for clarity.
- **Documentation:** Provide comments and documentation within the code to guide understanding.
- **Incremental Building:** Ensure that each task builds upon the previous ones logically.

---

By following this detailed roadmap, we establish a solid foundation for the application, ensure that core functionalities are developed thoroughly, and set the stage for integrating advanced features like AI avatars. This structured approach facilitates ease of development, testing, and debugging, making it suitable even for less experienced developers or error-prone LLMs.

**Next Steps:**

1. **Review and Approve the Roadmap:**
   - Ensure all stakeholders agree on the tasks and priorities.
2. **Set Up Development Environment:**
   - Configure local development environments according to the `.cursorrules`.
3. **Begin with Task 1:**
   - Proceed sequentially, ensuring each task is completed and tested before moving to the next.
4. **Maintain Communication:**
   - Regularly update progress and address any blockers promptly.

Please let me know if you need further adjustments or have any questions about the roadmap.