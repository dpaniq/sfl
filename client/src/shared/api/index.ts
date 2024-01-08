import got, { Response } from "got";

const API_URL = "https://sfl.com:3001/rest" as const;

// Simple configuration object
// Create a custom instance of got with the configuration
const client = got.extend({
  prefixUrl: API_URL,
  responseType: "json", // Change this based on your response type (json, text, etc.)
  // headers: {
  //   // Add any headers if needed
  //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  //   'Content-Type': 'application/json',
  // },
  retry: {
    limit: 2,
  }, // Number of retries if the request fails
  timeout: {
    request: 2,
  }, // Request timeout in milliseconds
});

export default client;
