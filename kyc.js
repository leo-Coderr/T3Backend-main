const axios = require("axios");

const client_id = "66ae1b632ad8c2001b5b83cc";
const secret = "ca5dcfb63d6718ddf7fd1865924e21";

const requestData = {
  client_user_id: "user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d",
  client_id: client_id,
  secret: secret,
  is_shareable: true,
  template_id: "idvtmp_52xR9LKo77r1Np",
  gave_consent: true,
  user: {
    email_address: "acharleston@email.com",
    phone_number: "+19876543212",
    date_of_birth: "1975-01-18",
    name: {
      given_name: "Anna",
      family_name: "Charleston",
    },
    address: {
      street: "100 Market Street",
      street2: "Apt 1A",
      city: "San Francisco",
      region: "CA",
      postal_code: "94103",
      country: "US",
    },
    id_number: {
      value: "123456789",
      type: "us_ssn",
    },
  },
};

axios
  .post("https://sandbox.plaid.com/identity_verification/create", requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log("Identity Verification Created:", response.data);
  })
  .catch((error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // No response was received
      console.error("Network Error:", error.request);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }
  });
