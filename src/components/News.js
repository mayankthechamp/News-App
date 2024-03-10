import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

import Newsitem from './Newsitem';
import Spinner from './Spinner';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=06116f28526f48bcae830fb9eeff9cb2&page=${page+1}&pageSize=${props.pageSize}`;
    setLoading(true);
    try {
      let response = await axios.get(url);
      props.setProgress(30);
      let parsedData = response.data;
      props.setProgress(70);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    setPage(page + 1);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=06116f28526f48bcae830fb9eeff9cb2&page=${page+1}&pageSize=${props.pageSize}`;
    try {
      let response = await axios.get(url);
      let parsedData = response.data;
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
    } catch (error) {
      console.error('Error fetching more news:', error);
    }
  };

  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - MayankNews`;
    updateNews();
    // eslint-disable-next-line
  }, [props.country, props.category, props.pageSize]);

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: '35px', marginTop: '90px' }}>
        MayankNews - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <Newsitem
                  key={element.url}
                  title={element.title ? element.title : ''}
                  description={element.description ? element.description.slice() : ''}
                  imageurl={element.urlToImage}
                  newsurl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
      <div className="container d-flex justify-content-between">
        <button
          className="btn btn-dark"
          onClick={handlePrevClick}
          disabled={page === 1}
        >
          &larr; Previous
        </button>
        <button
          className="btn btn-dark"
          onClick={handleNextClick}
          disabled={page * props.pageSize >= totalResults}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
