# NodeBase

> An advanced workflow automation platform built with Next.js, tRPC, and Inngest.

NodeBase is a visual workflow builder that allows you to automate tasks by connecting various services and APIs. Create complex logic flows with a drag-and-drop interface, integrate with popular tools like Google, Slack, and Discord, and leverage AI capabilities.

## Features

-   **Visual Workflow Editor**: Drag-and-drop interface to build automation flows.
-   **Powerful Integrations**: Connect seamlessly with:
    -   Google Services (Forms, etc.)
    -   Stripe
    -   Discord & Slack
    -   AI Models (Gemini)
-   **Reliable Execution**: Powered by [Inngest](https://www.inngest.com/) for durable, serverless-ready background job processing.
-   **Type-Safe APIs**: Built with tRPC for end-to-end type safety.
-   **Secure**: Authentication via Better Auth and secure credential management.

## System Design
For a detailed overview of the architecture, data model, and technology stack, please refer to the **[System Design Document](./SYSTEM_DESIGN.md)**.

## Getting Started

### Prerequisites
-   Node.js 18+
-   PostgreSQL Database
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nodebase
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Duplicate the `.env.example` file (if available) or create a `.env` file with the necessary variables:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/nodebase"
    # Add other required keys for Auth, Inngest, etc.
    ```

4.  **Database Setup:**
    Run Prisma migrations to set up your database schema:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

To run the full stack with Inngest dev server and potential tunnel (if configured):

```bash
npm run dev:all
```

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
