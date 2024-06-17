"use client";
import { useState, useEffect } from "react";
import { getTweetsFromTags } from "../api/search-tweets/rapidRouter";

export default function SearchTweets() {
  const [hashtags, setHashtags] = useState("");
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [continuationToken, setContinuationToken] = useState("");
  const [seenTweetIds, setSeenTweetIds] = useState(new Set());

  useEffect(() => {
    console.log(`This is continuation token: ${continuationToken}`);
  }, [continuationToken]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTweets([]); // Clear existing tweets
    setSeenTweetIds(new Set()); // Reset seen tweet IDs
    setContinuationToken(""); // Reset continuation token
    try {
      const resp = await getTweetsFromTags(hashtags);
      if (resp === false) {
        console.log("Error getting tweets");
      } else {
        const newTweets = resp.tweets.filter(
          (tweet) => !seenTweetIds.has(tweet.tweet_id)
        );
        setTweets(newTweets);
        setSeenTweetIds(new Set(newTweets.map((tweet) => tweet.tweet_id)));
        setContinuationToken(resp.continuation_token);
      }
    } catch (error) {
      console.error("Error searching tweets:", error);
    }
    setLoading(false);
  };

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const resp = await getTweetsFromTags(hashtags, continuationToken);
      if (resp === false) {
        console.log("Error getting more tweets");
      } else {
        const newTweets = resp.tweets.filter(
          (tweet) => !seenTweetIds.has(tweet.tweet_id)
        );
        setTweets((prevTweets) => [...prevTweets, ...newTweets]);
        setSeenTweetIds(
          (prevIds) =>
            new Set([...prevIds, ...newTweets.map((tweet) => tweet.tweet_id)])
        );
        setContinuationToken(resp.continuation_token);
      }
    } catch (error) {
      console.error("Error loading more tweets:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Search Tweets by Hashtags</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="Enter hashtags (comma-separated)"
          className="text-black"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.tweet_id}>
            <p>
              <strong>{tweet.user.username}</strong> (@{tweet.user.username})
            </p>
            <p>{tweet.text}</p>
            <hr />
          </div>
        ))}
      </div>
      {continuationToken && tweets.length > 0 && (
        <button onClick={handleLoadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
