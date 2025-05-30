<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## API Endpoints

This project provides the backend API for a purchase financing application.

### Authentication

*   **POST /auth/login**
    *   Logs in a user.
    *   **Request Body:** \`{ "clientNumber": "string (8 digits)", "password_dont_send_to_client": "string" }\`
    *   **Success Response (200 OK):** \`{ "message": "Login successful", "userId": "string (uuid)" }\`
    *   **Error Response (401 Unauthorized):** If credentials are invalid.
    *   **Error Response (400 Bad Request):** If input validation fails (e.g., clientNumber not 8 digits).

### Purchases

*Note: For the current mock implementation, \`userId\` must be passed as a query parameter. In a production setup with JWT authentication, this would typically be derived from the authentication token.*

*   **GET /purchases/candidate?userId=:userId**
    *   Retrieves a list of purchases eligible for deferral for the specified user.
    *   **Query Parameters:**
        *   \`userId\`: (string, UUID) - The ID of the user.
    *   **Success Response (200 OK):** \`Array<PurchaseDto>\`
        *   \`PurchaseDto: { "id": "string", "userId": "string", "productName": "string", "amount": number, "purchaseDate": "Date", "status": "CANDIDATE" | "DEFERRED" | "PAID" }\`
    *   **Error Response (401 Unauthorized):** If \`userId\` is missing in mock setup.

*   **GET /purchases/deferred?userId=:userId**
    *   Retrieves a list of purchases already deferred by the specified user.
    *   **Query Parameters:**
        *   \`userId\`: (string, UUID) - The ID of the user.
    *   **Success Response (200 OK):** \`Array<PurchaseDto>\`
    *   **Error Response (401 Unauthorized):** If \`userId\` is missing in mock setup.

### Deferrals

*Note: For the current mock implementation, \`userId\` must be passed as a query parameter for the POST endpoint.*

*   **POST /deferrals?userId=:userId**
    *   Creates a new deferral for selected purchases.
    *   **Query Parameters:**
        *   \`userId\`: (string, UUID) - The ID of the user making the deferral.
    *   **Request Body:** \`DeferralRequestDto\`
        *   \`{ "purchaseIds": ["string (uuid)"], "deferralMonths": 3 | 6 | 9 | 12 | 18 | 24 }\`
    *   **Success Response (201 Created - typically, but 200 OK for now is fine):** \`DeferralReceiptDto\`
        *   \`DeferralReceiptDto: { "deferralId": "string", "userId": "string", "selectedPurchases": Array<PurchaseDto>, "totalAmountDeferred": number, "interestRate": number, "monthlyPayment": number, "deferralMonths": number, "termsAndConditionsAccepted": boolean, "operationDate": "Date" }\`
    *   **Error Response (400 Bad Request):** If input validation fails (e.g., empty \`purchaseIds\`, invalid \`deferralMonths\`), or if a purchase is not eligible.
    *   **Error Response (401 Unauthorized):** If \`userId\` is missing in mock setup.
    *   **Error Response (404 Not Found):** If one or more \`purchaseIds\` are not found for the user.

*   **GET /deferrals/terms-and-conditions**
    *   Retrieves the terms and conditions for the purchase deferral program.
    *   **Success Response (200 OK):** \`{ "title": "string", "content": "string" }\`
