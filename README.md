# CodePulse

CodePulse is a comprehensive coding platform that allows users to practice coding problems, submit solutions, and get real-time feedback on their code. The platform supports multiple programming languages and provides a complete environment for coding practice and evaluation.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services Overview](#services-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Problem Management**: Create, read, update, and delete coding problems with descriptions, test cases, and code templates
- **Multi-language Support**: Supports Python, Java, C++, and JavaScript
- **Code Execution**: Secure code execution using Docker containers
- **Real-time Feedback**: WebSocket-based real-time feedback on code submissions
- **Admin Panel**: Comprehensive admin interface for problem management
- **Responsive UI**: Modern, responsive frontend built with Next.js
- **Code Editor**: Integrated Monaco code editor for coding
- **Problem Filtering**: Filter problems by difficulty, tags, and categories
- **Pagination**: Efficient pagination for problem listings

## Architecture

CodePulse follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │   Socket Server  │    │   Redis Cache    │
│   (Next.js)     │◄──►│   (Express)      │◄──►│                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
       │                        │                         │
       ▼                        ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Problem Service │    │Submission Service│    │ Evaluator Service│
│   (Express)     │◄──►│   (Fastify)      │◄──►│   (Express)      │
└─────────────────┘    └──────────────────┘    └──────────────────┘
       │                        │                         │
       ▼                        ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Database                         │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend Services**: Node.js, Express, Fastify
- **Database**: MongoDB with Mongoose
- **Message Queue**: BullMQ with Redis
- **Containerization**: Docker for secure code execution
- **Real-time Communication**: Socket.IO
- **Deployment**: PM2, GitHub Actions
- **Monorepo Management**: Turborepo, pnpm

## Project Structure

```
CodePulse/
├── apps/
│   ├── evalutor-service/     # Code evaluation service
│   ├── frontend/             # Next.js frontend application
│   ├── problem-service/      # Problem management service
│   ├── socket-server/        # WebSocket server for real-time communication
│   └── submission-service/   # Code submission service
├── packages/
│   ├── backend-common/       # Shared backend utilities
│   ├── code-executor/        # Code execution engine
│   ├── config/               # Configuration constants
│   ├── db/                   # Database models and connections
│   ├── errors/               # Custom error classes
│   ├── eslint-config/        # ESLint configurations
│   ├── lib/                  # Shared libraries
│   ├── mq/                   # Message queue implementation
│   ├── redis/                # Redis connection utilities
│   ├── tailwind-config/      # Tailwind CSS configuration
│   ├── typescript-config/    # TypeScript configurations
│   └── ui/                   # Shared UI components
├── .github/workflows/        # GitHub Actions workflows
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── turbo.json                # Turborepo configuration
```

## Services Overview

### 1. Frontend (Next.js)
- User interface for browsing problems, coding, and submitting solutions
- Admin panel for problem management
- Responsive design with Tailwind CSS
- Integrated Monaco code editor
- Real-time feedback via WebSocket

### 2. Problem Service (Express)
- CRUD operations for coding problems
- Problem filtering and pagination
- Tag management
- RESTful API endpoints

### 3. Submission Service (Fastify)
- Handles code submissions from users
- Queues submissions for evaluation
- Communicates with Evaluator Service via message queue

### 4. Evaluator Service (Express)
- Processes code submissions from the queue
- Executes code in secure Docker containers
- Evaluates code against test cases
- Sends results back via message queue

### 5. Socket Server (Express)
- Manages WebSocket connections
- Provides real-time feedback to users
- Communicates evaluation results to frontend

### 6. Code Executor (Docker)
- Secure code execution using Docker containers
- Language-specific executors for Python, Java, C++, and JavaScript
- Memory and time limits for code execution

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9 or higher)
- Docker (for code execution)
- MongoDB (or MongoDB Atlas)
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/CodePulse.git
cd CodePulse
```

2. Install dependencies:
```bash
pnpm install
```

### Environment Variables

Each service requires specific environment variables. Create `.env` files in each service directory:

**apps/problem-service/.env**
```env
ATLAS_DB_URL=your_mongodb_connection_string
LOG_DB_URL=your_log_db_connection_string
REDIS_HOST=localhost
PORT=3000
```

**apps/submission-service/.env**
```env
ATLAS_DB_URL=your_mongodb_connection_string
LOG_DB_URL=your_log_db_connection_string
REDIS_HOST=localhost
PORT=3001
SOCKET_SERVICE_URL=http://localhost:3002
PROBLEM_ADMIN_SERVICE_URL=http://localhost:3000
```

**apps/evalutor-service/.env**
```env
ATLAS_DB_URL=your_mongodb_connection_string
LOG_DB_URL=your_log_db_connection_string
REDIS_HOST=localhost
SOCKET_SERVICE_URL=http://localhost:3002
PORT=3003
```

**apps/socket-server/.env**
```env
REDIS_HOST=localhost
PORT=3002
```

**apps/frontend/.env**
```env
NEXT_PUBLIC_PROBLEM_SERVICE_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_SUBMISSION_SERVICE_URL=http://localhost:3001
```

### Running the Application

1. Start all services in development mode:
```bash
pnpm dev
```

2. Access the application:
- Frontend: http://localhost:3004
- Problem Service: http://localhost:3000
- Submission Service: http://localhost:3001
- Socket Server: http://localhost:3002
- Evaluator Service: http://localhost:3003

## Deployment

CodePulse is configured for deployment using GitHub Actions. The deployment workflow:

1. Builds all services using Turborepo
2. Creates deployment archives for each service
3. Deploys to an EC2 instance via SSH
4. Restarts services using PM2

To deploy:
1. Set up the required secrets in GitHub Actions:
   - `DB_URL`: MongoDB connection string
   - `REDIS_HOST`: Redis host
   - `DEPLOY_SSH_KEY`: SSH key for EC2 instance
   - `DEPLOY_IP`: EC2 instance IP
   - `DEPLOY_USERNAME`: EC2 username
   - `DEPLOY_PATH`: Deployment path on EC2
   - `SOCKET_SERVICE_URL`: Socket service URL
   - `PROBLEM_SERVICE_URL`: Problem service URL
   - `SUBMISSION_SERVICE_URL`: Submission service URL
   - `PROBLEM_SERVICE_PORT`: Problem service port
   - `SUBMISSION_SERVICE_PORT`: Submission service port
   - `EVALUATOR_SERVICE_PORT`: Evaluator service port

2. Push to the `main` branch to trigger deployment

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
