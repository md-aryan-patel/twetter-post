const axios = require("axios");
require("dotenv").config();

const getTweetsFromTags = async (tag, continuationToken = "") => {
  const options = {
    method: "GET",
    url: "https://twitter154.p.rapidapi.com/hashtag/hashtag",
    params: {
      hashtag: `#${tag}`,
      limit: "6",
      section: "top",
      continuation_token: continuationToken,
    },
    headers: {
      "x-rapidapi-key": "b4819fe260msh0758222fe87b9dbp14f9a3jsn5799f99e843f",
      "x-rapidapi-host": "twitter154.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return {
      tweets: response.data.results,
      continuation_token: response.data.continuation_token,
    };
  } catch (error) {
    console.error({ error });
    return false;
  }
};

const main = async () => {
  const res = await getTweetsFromTags("python");
  res.tweets.map((tweet) => {
    console.log(tweet);
  });
};

main().catch((err) => {
  console.log(err);
});

module.exports = { getTweetsFromTags };
