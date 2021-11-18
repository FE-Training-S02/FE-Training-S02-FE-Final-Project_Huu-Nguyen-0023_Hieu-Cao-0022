import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendPostRequest } from 'app/stores/post/actions';
import { RootState } from 'app/stores/app-reducer';
import NewFeedItem from './partials/NewsfeedItem';
import { postOptions } from 'app/shared/models/post-interface';

const Newsfeed = () => {
  const { posts, isLoading, loadMore }: any = useSelector((state: RootState) => state.post);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRecommendPostRequest(pageNumber));
  }, [pageNumber]);

  const observer: any = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && loadMore) {
            setPageNumber(() => pageNumber + 1);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 1,
        }
      );
      if (node) observer.current.observe(node);
      return [];
    },
    [isLoading]
  );
  return (
    <div className="newsfeed container">
      <div className="row">
        <div className="newsfeed-container col-8 col-lg-12 offset-2 offset-lg-0">
          <h3>RECOMMENDED FOR YOU</h3>
          <ul className="newsfeed-list">
            {posts?.map((post: postOptions, index: number) => {
              if (posts.length === index + 1) {
                return <NewFeedItem post={post} />;
              } else return <NewFeedItem post={post} />;
            })}
          </ul>
        </div>
      </div>
      {loadMore && (
        <div className="load-wrap" ref={lastPostElementRef}>
          <div className="load-more">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Newsfeed;
