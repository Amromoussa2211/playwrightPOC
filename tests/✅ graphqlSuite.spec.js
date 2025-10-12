import { test, expect, request } from '@playwright/test';

test.describe('Trainer full flow', () => {

  const baseUrl = 'https://dev.willma.life/api/graphql';
  const trainerPassword = 'Abc@1234';
  const trainerRoleId = '14deaea0-9a9b-11ef-915d-22142ceebac0';
  const trainerVerificationCode = '111111';
  const currencyID = '68009fdf-0980-4c00-b6f4-98fbca4b4b4d';
  const adminEmail = 'superadmin@example.com';
  const adminPassword = '#willma-admin2025##';

  let trainerEmail;
  let trainerToken;
  let trainerID;
  let trainerRegistrationNumber;
  let packageID;
  let adminToken;

  test('Trainer creation, verification, approval, and package management', async ({ request }) => {
    // ============ 1. Create Trainer ===============
    trainerEmail = `trainer_${Math.random().toString(36).substring(2, 8)}@example.com`;
    console.log('✅ Trainer email:', trainerEmail);

    let createTrainer = await request.post(baseUrl, {
      data: {
        query: `
          mutation CreateTrainer($email: String!, $password: String!, $roleId: ID!) {
            createUser(createUserDto: { email: $email, password: $password, gender: Female, roleId: $roleId }) {
              id email isVerified roleId createdAt
            }
          }`,
        variables: {
          email: trainerEmail,
          password: trainerPassword,
          roleId: trainerRoleId,
        },
      },
    });

    expect(createTrainer.ok()).toBeTruthy();
    let trainerRes = await createTrainer.json();
    console.log('Trainer created:', trainerRes);

    // ============ 2. Verify Trainer with OTP ===============
    let verify = await request.post(baseUrl, {
      data: {
        query: `
          mutation VerifyUserForSignUp($email: String!, $code: String!) {
            verifyUserForSignUp(email: $email, code: $code) { token }
          }`,
        variables: { email: trainerEmail, code: trainerVerificationCode },
      },
    });

    expect(verify.ok()).toBeTruthy();
    let verifyRes = await verify.json();
    console.log('Trainer verified:', verifyRes);

    // ============ 3. Login as Trainer ===============
    let login = await request.post(baseUrl, {
      data: {
        query: `
          mutation TrainerLogin($input: AuthenticationLoginInput!) {
            loginAsTrainer(loginInput: $input) {
              accessToken user { id email isVerified }
            }
          }`,
        variables: {
          input: { email: trainerEmail, password: trainerPassword },
        },
      },
    });

    expect(login.ok()).toBeTruthy();
    let loginRes = await login.json();
    trainerToken = loginRes.data.loginAsTrainer.accessToken;
    trainerID = loginRes.data.loginAsTrainer.user.id;
    console.log('✅ Trainer logged in, ID:', trainerID);

    // ============ 4. Create Trainer Account ===============
    let randomLastName = `Trainer_${Math.random().toString(36).substring(2, 7)}`;
    let createTrainerAccount = await request.post(baseUrl, {
      headers: { Authorization: `Bearer ${trainerToken}` },
      data: {
        query: `
          mutation CreateTrainer {
            createTrainer(createTrainerDto: {
              bio: "bio test",
              educationState: BachelorDegree,
              estimated_response_time: "24",
              graduationYear: 1990,
              name: "${randomLastName}",
              specializations: ["b6c95f01-f83b-4649-b099-0563a0997cd6", "715c538d-668c-45b4-9578-5c3bebe6305a"],
              trainerId: "${trainerID}",
              yearsOfExperience: 12
            }) {
              registrationNumber
            }
          }`,
      },
    });

    expect(createTrainerAccount.ok()).toBeTruthy();
    let accountRes = await createTrainerAccount.json();
    trainerRegistrationNumber = accountRes.data.createTrainer.registrationNumber;
    console.log('✅ Trainer account created, registrationNumber:', trainerRegistrationNumber);

    // ============ 5. Admin Login to Approve ===============
    let adminLogin = await request.post(baseUrl, {
      data: {
        query: `
          mutation AdminLogin($email: String!, $password: String!, $ip: String) {
            loginForAdmin(data: { email: $email, password: $password }, ipAddress: $ip)
          }`,
        variables: { email: adminEmail, password: adminPassword, ip: '127.0.0.1' },
      },
    });

    expect(adminLogin.ok()).toBeTruthy();
    let adminRes = await adminLogin.json();
    adminToken = adminRes.data.loginForAdmin;
    console.log('✅ Admin logged in to get token and approved trainer');

    // ============ 6. Approve Trainer by registrationNumber ===============
    let approveTrainer = await request.post(baseUrl, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        query: `
          mutation UpdateTrainerStatusByRegistrationNumber($registrationNumber: Int!, $status: TrainerStatus!) {
            updateTrainerStatusByRegistrationNumber(registrationNumber: $registrationNumber, status: $status) {
              id name registrationNumber status updatedAt
            }
          }`,
        variables: { registrationNumber: parseInt(trainerRegistrationNumber), status: 'Approved' },
      },
    });

    expect(approveTrainer.ok()).toBeTruthy();
    console.log('✅ Trainer approved');

    // ============ 7. Create Package ===============
    let createPackage = await request.post(baseUrl, {
      headers: { Authorization: `Bearer ${trainerToken}` },
      data: {
        query: `
          mutation CreatePackage {
            createPackage(createPackageInput: {
              types: [Workout],
              currencyId: "${currencyID}",
              initialFormId: "024f139a-0209-47c2-b6c7-e54a0ea83d8c",
              description: "pakage1",
              duration: 2,
              hasSessionsOnly: false,
              price: 1000,
              name: "pakagefromapi"
            }) { id name description price }
          }`,
      },
    });

    expect(createPackage.ok()).toBeTruthy();
    let pkgRes = await createPackage.json();
    packageID = pkgRes.data.createPackage.id;
    console.log('✅ Package created with ID:', packageID);

    // ============ 8. Update Package ===============
    let updatePackage = await request.post(baseUrl, {
      headers: { Authorization: `Bearer ${trainerToken}` },
      data: {
        query: `
          mutation UpdatePackage {
            updatePackage(id: "${packageID}", updatePackageInput: {
              name: "UpdatedPackageName",
              description: "Updated description",
              price: 1500,
              duration: 3,
              hasSessionsOnly: false
            }) {
              id name description price duration updatedAt
            }
          }`,
      },
    });

    expect(updatePackage.ok()).toBeTruthy();
    let updateRes = await updatePackage.json();
    expect(updateRes.data.updatePackage.name).toBe('UpdatedPackageName');
    console.log('✅ Package updated successfully, with id:', packageID);
  });
});
