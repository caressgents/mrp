import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiUrl = 'http://localhost:3000/api/auth/login';

const credentials = {
  email: process.env.TEST_EMAIL, // INPUT_REQUIRED {Enter the correct email address for testing}
  password: process.env.TEST_PASSWORD // INPUT_REQUIRED {Enter the correct password for testing}
};

async function fetchAuthToken() {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error('Login failed: ' + errorResponse);
    }

    const data = await response.json();
    const token = data.token;
    
    console.log(token);

    process.exit(0); // Exit with success status
    
  } catch (error) {
    console.error('Error fetching auth token:', error.message);
    process.exit(1); // Exit with an error status
  }
}

fetchAuthToken();
