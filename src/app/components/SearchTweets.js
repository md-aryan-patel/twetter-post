"use client";
import { useState } from "react";
import {
  getUserTweets,
  getUserTweetsContinuation,
} from "../api/search-tweets/rapidRouter";

export default function SearchTweets() {
  const [user, setUser] = useState("");
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [continuationToken, setContinuationToken] = useState("");
  const [seenTweetIds, setSeenTweetIds] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState({});

  const loadNextThreeTweets = async (_resp) => {
    const startIndex = currentIndex;
    const endIndex = currentIndex + 3;
    const nextThreeTweets = _resp.tweets.slice(startIndex, endIndex);

    setCurrentIndex(endIndex);

    if (currentIndex >= _resp.tweets.length) {
      setCurrentIndex(0);
      return false;
    }

    setSeenTweetIds(new Set(nextThreeTweets.map((tweet) => tweet.tweet_id)));
    setContinuationToken(_resp.continuation_token);
    setTweets((prevTweets) => [...prevTweets, ...nextThreeTweets]);
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTweets([]); // Clear existing tweets
    setSeenTweetIds(new Set()); // Reset seen tweet IDs
    setContinuationToken(""); // Reset continuation token
    try {
      const resp = await getUserTweets(user);
      setResponse(resp);
      if (resp === false) {
        console.log("Error getting tweets");
      } else {
        loadNextThreeTweets(resp);
      }
    } catch (error) {
      console.error("Error searching tweets:", error);
    }
    setLoading(false);
  };

  const handleLoadMore = async () => {
    setLoading(true);
    const hasNextTweets = await loadNextThreeTweets(response);
    console.log(`Has next tweets: ${hasNextTweets}`);
    if (!hasNextTweets) {
      try {
        const resp = await getUserTweetsContinuation(user, continuationToken);
        setResponse(resp);
        if (resp === false) {
          console.log("Error getting more tweets");
        } else {
          loadNextThreeTweets(resp);
        }
      } catch (error) {
        console.error("Error loading more tweets:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex w-screen items-center justify-center flex-col">
        <form
          onSubmit={handleSearch}
          className="w-screen flex items-center justify-center"
        >
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter user"
            className="bg-transparent border border-white rounded-full p-4 m-4 text-white placeholder-white::placeholder focus:outline-none focus:ring-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-4 m-4 bg-blue-700 rounded-3xl"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tweets.map((tweet, index) => (
          <div
            key={tweet.tweet_id}
            className={`bg-gray-700 rounded-lg border border-gray-300 shadow-md overflow-hidden ${
              index === 0 ? "sm:ml-2" : ""
            } ${index === tweets.length - 1 ? "sm:mr-2" : ""}`}
          >
            {tweet.media_url && (
              <img
                src={tweet.media_url[0]}
                alt={`Tweet by ${tweet.user.username}`}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-4 flex-grow">
              <div className="flex items-center mb-2">
                {tweet.user.profile_pic_url && (
                  <img
                    src={tweet.user.profile_pic_url}
                    alt={tweet.user.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="font-bold">{tweet.user.username}</p>
                  <p className="">@{tweet.user.username}</p>
                </div>
              </div>
              <p className="">{tweet.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-screen items-center justify-center flex-col">
        {continuationToken && tweets.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-4 mb-4 px-9 py-2 border border-white rounded-xl text-white"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
