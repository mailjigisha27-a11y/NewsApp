import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const categoryMap = {
    business: "business",
    entertainment: "entertainment",
    general: "top",
    health: "health",
    science: "science",
    sports: "sports",
    technology: "technology",
  };

  const fetchNews = async (pageToken = null) => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    console.log("API KEY loaded:", apiKey); // remove this after it works
    const cat = categoryMap[props.category] || "top";

    let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${props.country}&category=${cat}&language=en`;
    if (pageToken) url += `&page=${pageToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.status === "success") {
        const newArticles = data.results || [];
        setArticles((prev) =>
          pageToken === null ? newArticles : [...prev, ...newArticles]
        );
        setNextPage(data.nextPage || null);
        setHasMore(!!data.nextPage);
      } else {
        console.error("API error:", data.message);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching news:", error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`;
    setArticles([]);
    setNextPage(null);
    setHasMore(true);
    fetchNews(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category]);

  const fetchMoreData = () => {
    if (nextPage) fetchNews(nextPage);
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>
        NewsMonkey - Top {capitalize(props.category)} Headlines
      </h1>

      {loading && articles.length === 0 && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element, index) => (
              <div className="col-md-4" key={element.link || index}>
                <NewsItem
                  title={element.title || "No Title"}
                  description={element.description || element.content || ""}
                  imageUrl={element.image_url}
                  newsUrl={element.link}
                  author={element.creator?.[0] || "Unknown"}
                  date={element.pubDate}
                  source={element.source_name || element.source_id}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 10,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;