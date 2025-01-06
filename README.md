# ChatGenius

A modern real-time chat application with AI-powered features.

## Prerequisites

- Node.js >= 22.0.0
- Yarn
- PostgreSQL >= 15
- Docker (optional)

## Tech Stack

- **Frontend**: React.js with Next.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Testing**: Jest, Cypress

## Project Structure

```
chatgenius/
├── client/           # React frontend
├── server/           # Express backend
├── e2e/              # Cypress end-to-end tests
└── package.json      # Root package.json for workspaces
```

## Getting Started

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/chatgenius.git
cd chatgenius
yarn install
```

2. Set up environment variables:

Create `server/.env`:
```env
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chatgenius
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Initialize the database:
```bash
yarn migrate
```

4. Start the development servers:
```bash
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Database Migrations

Create a new migration:
```bash
yarn migrate:create
```

Run migrations:
```bash
yarn migrate
```

## Testing

Run all tests:
```bash
yarn test
```

Run end-to-end tests:
```bash
yarn workspace e2e test
```

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push your changes and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Available Scripts

- `yarn dev` - Start development servers
- `yarn build` - Build for production
- `yarn start` - Start production servers
- `yarn test` - Run tests
- `yarn lint` - Run linting
- `yarn migrate` - Run database migrations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 