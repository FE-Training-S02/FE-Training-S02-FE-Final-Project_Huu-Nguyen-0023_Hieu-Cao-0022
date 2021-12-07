import React, { useEffect, useState, useRef, useCallback } from 'react';

import Post from './Post';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'app/stores/app-reducer';
import { postOptions } from 'app/shared/models/post-interface';
import { fetchPostRequest, fetchRecommendPostRequest } from 'app/stores/post/actions';
import SkeletonNewsfeed from 'app/pages/home/partials/skeleton-component/SkeletonNewsfeed';
import { UserInfoOptions } from 'app/shared/models/User';

const Newsfeed = () => {
  const { userCurrent }: { userCurrent: UserInfoOptions } = useSelector(
    (state: RootState) => state.userState
  );
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const observer: any = useRef();
  const dispatch = useDispatch();
  const fetchNewsfeedAPI = (action: any, pageNumber: number) => {
    setLoading(true);
    dispatch(action(pageNumber)).then((res: any) => {
      if (pageNumber === 1) {
        setPosts(res?.data);
      } else {
        setPosts([...posts, ...res?.data]);
      }
      setLoadMore(res?.loadMore);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoadMore(true);
    setPageNumber(1);
  }, [userCurrent]);

  useEffect(() => {
    if (userCurrent) {
      fetchNewsfeedAPI(fetchRecommendPostRequest, pageNumber);
    }
    if (!userCurrent) {
      fetchNewsfeedAPI(fetchPostRequest, pageNumber);
    }
  }, [pageNumber]);

  const loadMoreElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && loadMore) {
            setPageNumber(pageNumber + 1);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading]
  );
  return (
    <section className="section-new-post">
      <div className="container">
        <ul className="row group-item">
          {posts?.map((post: postOptions) => (
            <Post post={post} />
          ))}
        </ul>
        {loading && (
          <ul className="row group-item">
            {[1, 2, 3, 4, 5, 6].map((n: number) => (
              <SkeletonNewsfeed key={n} />
            ))}
          </ul>
        )}
      </div>
      {loadMore && (
        <div className="load-more-wrap" ref={loadMoreElementRef}></div>
      )}
    </section>
  );
};
export default Newsfeed;
