import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";

// Twitter API credentials
const config = {
  appKey: process.env.NEXT_TWITTER_API_KEY,
  appSecret: process.env.NEXT_TWITTER_API_SECRET,
  accessToken: process.env.NEXT_TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.NEXT_TWITTER_ACCESS_TOKEN_SECRET,
};

const client = new TwitterApi(config);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hashtags = searchParams.get("hashtags");

  if (!hashtags) {
    return NextResponse.json(
      { error: "Hashtags parameter is required" },
      { status: 400 }
    );
  }

  try {
    const hashtagQuery = hashtags
      .split(",")
      .map((tag) => `#${tag.trim()}`)
      .join(" OR ");
    const tweets = await client.v2.search(hashtagQuery, {
      "tweet.fields": ["author_id", "created_at"],
      "user.fields": ["name", "username"],
      expansions: ["author_id"],
      max_results: 10,
    });

    const tweetsWithUserInfo = tweets.data.map((tweet) => {
      const user = tweets.includes.users.find(
        (user) => user.id === tweet.author_id
      );
      return {
        ...tweet,
        user: {
          name: user.name,
          username: user.username,
        },
      };
    });

    return NextResponse.json(tweetsWithUserInfo);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { error: "Error fetching tweets" },
      { status: 500 }
    );
  }
}
