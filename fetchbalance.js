const axios = require("axios");

async function fetchBalance() {
  const restEndpoint = "http://146.190.5.120:1317";
  const address = "ssi18qz03y0e3av9zhm7wgrmpuhx0l0jv63sarseky";

  try {
    const response = await axios.get(
      `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}`
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

fetchBalance();
