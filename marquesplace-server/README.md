# Running Tests in Express API

To ensure the quality and reliability of our Express API, it's essential to run tests regularly. This guide will walk you through the steps to run tests in our Express API using Docker.

## Prerequisites

Before proceeding, make sure you have the following prerequisites installed on your machine:

- Docker
- Docker Compose

## Running Tests

To run the tests, follow these steps:

1. Open a terminal or command prompt.

2. Navigate to the root directory of our Express API project.

3. Run the following command to execute the tests:

   ```bash
   docker compose exec node npm run test
   ```

   This command will execute the tests once and provide the test results in the terminal output.

## Running Tests in Watch Mode

In some cases, you may want to continuously run the tests while making changes to the code. This helps in monitoring the test results in real-time. To run the tests in watch mode, follow these steps:

1. Open a terminal or command prompt.

2. Navigate to the root directory of our Express API project.

3. Run the following command to run the tests in watch mode:

   ```bash
   docker compose exec node npm run test:dev
   ```

   This command will launch the tests and keep watching for changes in the code. Whenever a change is detected, the relevant tests will be re-run, and the updated results will be displayed in the terminal output.

## Conclusion

Running tests in our Express API using Docker ensures that we maintain a reliable and stable application. By following the steps outlined in this guide, you can easily execute the tests and monitor the test results.

Remember to run the tests regularly to catch any issues early on and maintain the overall quality of our Express API.
