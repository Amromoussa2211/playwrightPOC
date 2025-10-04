// import axios from "axios";
 const GRAPHQL_URL = "https://dev.willma.life/api/graphql"; // عدّل الـ endpoint
// export async function graphqlRequest(query, variables = {}, token) {
//   try {
//     const response = await axios.post(
//       GRAPHQL_URL,
//       { query, variables },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "apollo-require-preflight": "true"
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("GraphQL Request Error:", error.response?.data || error.message);
//     throw error;
//   }
// }// utils/graphqlClient.js
import dotenv from "dotenv";
dotenv.config();



export async function graphqlRequest(query, variables = {}, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(process.env.GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
  }
  return json;
}
