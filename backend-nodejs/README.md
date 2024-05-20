# Move Exercise Backend with NodeJS and MySQL

This project serves as the backend for the Move Exercise application. It is built using ExpressJS and utilizes MySQL database.

## Description of the Move Exercise Website

Move Exercise is accessible at [https://move-training-stg.madlab.tech/](https://move-training-stg.madlab.tech/)

## Running the Project in Development Environment

To run the project in a development environment, follow these steps:

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Create Environment Variables File**:

   - Create a `.env` file in the root directory.
   - Populate it with the required environment variables based on the `.env.example` file.

3. **Navigate to Source Directory**:

   ```bash
   cd src
   ```

4. **Migrate Database Tables**:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Return to Project Root Directory**:

   ```bash
   cd ..
   ```

6. **Run the Project**:
   ```bash
   npm run dev
   ```

By following these steps, the Move Exercise backend will be up and running in your development environment.
