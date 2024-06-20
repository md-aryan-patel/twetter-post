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
      "x-rapidapi-key": "99336b0848msh39478f44adbc460p18fd66jsn9e071aedaab1",
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

const getUserTweetsContinuation = async (username, continuationToken) => {
  const options = {
    method: "GET",
    url: "https://twitter154.p.rapidapi.com/user/tweets/continuation",
    params: {
      username: username,
      limit: "3",
      continuation_token: continuationToken,
      include_replies: "false",
    },
    headers: {
      "x-rapidapi-key": "99336b0848msh39478f44adbc460p18fd66jsn9e071aedaab1",
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
    console.error(error);
    return false;
  }
};

const getUserTweets = async (username) => {
  const options = {
    method: "GET",
    url: "https://twitter154.p.rapidapi.com/user/tweets",
    params: {
      username: username,
      limit: 3,
      include_replies: "false",
      include_pinned: "false",
    },
    headers: {
      "x-rapidapi-key": "99336b0848msh39478f44adbc460p18fd66jsn9e071aedaab1",
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
    console.error(error);
    return false;
  }
};

const main = async () => {
  const data = await getUserTweets("marcmarquez93");
  console.log(data);
};

main().catch((err) => {
  console.log(err);
});

module.exports = {
  getTweetsFromTags,
  getUserTweets,
  getUserTweetsContinuation,
};
