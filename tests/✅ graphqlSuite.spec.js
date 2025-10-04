// tests/graphqlSuite.spec.js
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { graphqlRequest } from "../utiles/graphqlClient.js";

dotenv.config();

// Shared state between tests
let authToken;
let createdTrainer;
let trainerPassword = "TrainerPass123!";
let createdPackage;

test.describe.serial("GraphQL Trainer Flow", () => {
  // 0. Admin Login
  test("0. Admin Login", async () => {
    const query = `
      mutation AdminLogin($email: String!, $password: String!, $ip: String) {
        loginForAdmin(data: { email: $email, password: $password }, ipAddress: $ip)
      }
    `;
    const variables = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      ip: "127.0.0.1",
    };

    const data = await graphqlRequest(query, variables);
    authToken = data.data?.loginForAdmin;
    console.log("Admin Login Response:", data.data);
    expect(authToken).toBeTruthy();
  });

  // 1. Create Trainer
  test("1. Create Trainer", async () => {
    const query = `
      mutation CreateTrainer($email: String!, $password: String!, $roleId: ID!) {
        createUser(
          createUserDto: {
            email: $email
            password: $password
            gender: Female
            roleId: $roleId
          }
        ) {
          id
          email
          isVerified
          roleId
          createdAt
        }
      }
    `;

    const variables = {
      email: `trainer_${Date.now()}@example.com`,
      password: trainerPassword,
      roleId: process.env.TRAINER_ROLE_ID,
    };

    const data = await graphqlRequest(query, variables, authToken);
    createdTrainer = data.data?.createUser;

    console.log("Trainer Created:", createdTrainer);
    expect(createdTrainer).toHaveProperty("id");
    expect(createdTrainer).toHaveProperty("email");
  });

  // 2. Verify Trainer SignUp
  test("2. Verify Trainer SignUp", async () => {
    expect(createdTrainer).toBeTruthy(); // Ensure trainer exists

    const query = `
      mutation VerifyUserForSignUp($email: String!, $code: String!) {
        verifyUserForSignUp(email: $email, code: $code) {
          token
        }
      }
    `;

    const variables = {
      email: createdTrainer.email,
      code: process.env.TRAINER_VERIFICATION_CODE || "111111",
    };

    const data = await graphqlRequest(query, variables);
    console.log("Verify Trainer Response:", data.data);
    expect(data.data?.verifyUserForSignUp?.token).toBeTruthy();
  });

  // 3. Trainer Login
  test("3. Trainer Login", async () => {
    expect(createdTrainer).toBeTruthy();

    const query = `
      mutation TrainerLogin($input: AuthenticationLoginInput!) {
        loginAsTrainer(loginInput: $input) {
          accessToken
          user {
            id
            email
            isVerified
          }
        }
      }
    `;

    const variables = {
      input: {
        email: createdTrainer.email,
        password: trainerPassword,
      },
    };

    const data = await graphqlRequest(query, variables);
    const trainerLogin = data.data?.loginAsTrainer;

    console.log("Trainer Login Response:", trainerLogin);
    expect(trainerLogin?.accessToken).toBeTruthy();
  });

  // 4. Update Trainer Status
    test("4. Update Trainer Status", async () => {
    const query = `
      mutation UpdateTrainerStatusByRegistrationNumber($registrationNumber: String!, $status: TrainerStatusEnum!) {
        updateTrainerStatusByRegistrationNumber(
          registrationNumber: $registrationNumber
          status: $status
        ) {
          id
          registrationNumber
          status
          updatedAt
        }
      }
    `;

    const variables = {
      registrationNumber: "REG123456", // ✅ Replace with actual trainer registrationNumber from creation
      status: "Approved",             // ✅ Use schema’s enum value
    };

    const data = await graphqlRequest(query, variables, authToken);
    console.log("Trainer Status Update:", data.data);

    expect(data.data?.updateTrainerStatusByRegistrationNumber?.status).toBe("Approved");
  });


  // 5. Create Package for Trainer
  test("5. Create Package for Trainer", async () => {
    expect(createdTrainer).toBeTruthy();

    const query = `
      mutation CreatePackage($input: CreatePackageInput!) {
        createPackage(input: $input) {
          id
          title
          price
        }
      }
    `;

    const variables = {
      input: {
        title: "Trainer Package",
        description: "Test Package",
        price: 100,
        duration: 30,
        noSession: 5,
        trainerId: createdTrainer.id,
        hasSessionsOnly: true,
        initialFormId: "form-123",
        types: ["WORKOUT"],
      },
    };

    const data = await graphqlRequest(query, variables, authToken);
    createdPackage = data.data?.createPackage;

    console.log("Package Created:", createdPackage);
    expect(createdPackage).toHaveProperty("id");
  });

  // 6. Get Package By Id
  test("6. Get Package By Id", async () => {
    expect(createdPackage).toBeTruthy();

    const query = `
      query GetPackageById($id: ID!) {
        getPackageById(id: $id) {
          id
          title
          price
        }
      }
    `;

    const variables = { id: createdPackage.id };
    const data = await graphqlRequest(query, variables, authToken);

    const fetchedPackage = data.data?.getPackageById;
    console.log("Fetched Package:", fetchedPackage);
    expect(fetchedPackage?.id).toBe(createdPackage.id);
  });
});
