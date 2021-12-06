import React, { useContext, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from 'app/stores/app-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import UserComment from './partials/UserComment';
import {
  convertFromStringToDate,
  formatNumber,
} from 'app/shared/helper/helper-function';
import SkeletonDetailPost from '../home/partials/skeleton-component/SkeletonDetailPost';
import {
  getUserInfoByIdRequest,
  showModalSignInRequest,
} from 'app/stores/user/actions';
import {
  commentPostRequest,
  fetchSpecificPostRequest,
  followUserRequest,
  addBookmarkRequest,
  getCommentPostRequest,
  likePostRequest,
} from 'app/stores/post/actions';
import Footer from 'app/shared/components/Footer';

const Detail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const schema = yup.object().shape({
    content: yup.string().required('Invalid comment'),
  });
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  const [follow, setFollow] = useState<boolean>(false);
  const { userCurrent }: any = useSelector(
    (state: RootState) => state.userState
  );
  const [bookmark, setBookmark] = useState<boolean>(false);
  const [isMyself, setIsMyself] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { error }: any = useSelector((state: RootState) => state.post);

  useEffect(() => {
    if (error) {
      history.push('/notFound');
    }
  }, [error]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSpecificPostRequest(id)).then((res: any) => {
      if (res) {
        setPost(res);
        setBookmark(res.isInBookmark);
        if (userCurrent?.email === res.user.email) {
          setIsMyself(true);
        } else {
          setIsMyself(false);
        }
        setLoading(false);
      }
    });
    dispatch(getCommentPostRequest(id)).then((res: any) => setComments(res));
  }, [id, userCurrent]);

  useEffect(() => {
    if (post) {
      dispatch(getUserInfoByIdRequest(String(post.userId))).then((res: any) => {
        setFollow(res.isFollowed);
      });
    }
  }, [post]);

  const handleLikePost = () => {
    if (userCurrent) {
      if (post.isLiked) {
        post.likes = +post.likes - 1;
        post.isLiked = false;
      } else {
        post.likes = +post.likes + 1;
        post.isLiked = true;
      }
      setPost({ ...post });
      dispatch(likePostRequest(id));
    } else {
      dispatch(showModalSignInRequest(true));
    }
  };

  const onSubmit = (data: CommentHandleOptions) => {
    if (userCurrent) {
      let newComment = {
        comment: data.content,
        createdAt: new Date().toISOString(),
        user: {
          email: userCurrent.email,
          displayName: userCurrent?.displayName
            ? userCurrent.displayName
            : userCurrent.lastName,
          picture: userCurrent?.picture,
        },
      };
      setComments((comments: any) => [...comments, newComment]);
      dispatch(commentPostRequest(id, data));
      reset();
    } else {
      dispatch(showModalSignInRequest(true));
    }
  };

  const handleFollowUser = () => {
    if (userCurrent) {
      let data = {
        followingId: post.userId,
      };
      setFollow(!follow);
      dispatch(followUserRequest(data));
    } else {
      dispatch(showModalSignInRequest(true));
    }
  };

  const handleAddBookmark = () => {
    if (userCurrent) {
      let data = {
        postId: String(post.id),
      };
      setBookmark(!bookmark);
      dispatch(addBookmarkRequest(data));
    } else {
      dispatch(showModalSignInRequest(true));
    }
  };

  return (
    <>
      {loading ? <SkeletonDetailPost /> : ''}
      {post ? (
        <div className="detail-page">
          <div className="container">
            <div className="row">
              <aside className="author-interact">
                <ul className="interact-action-list">
                  <li className="interact-action-item" onClick={handleLikePost}>
                    {post.isLiked ? (
                      <span className="item-icon active">
                        <i className="fas fa-heart"></i>
                      </span>
                    ) : (
                      <span className="item-icon">
                        <i className="fal fa-heart"></i>
                      </span>
                    )}
                  </li>
                  {!isMyself && (
                    <li
                      className="interact-action-item"
                      onClick={handleFollowUser}
                    >
                      {follow ? (
                        <span className="item-icon active">
                          <i className="fas fa-user-check"></i>
                        </span>
                      ) : (
                        <span className="item-icon">
                          <i className="far fa-user-plus"></i>
                        </span>
                      )}
                    </li>
                  )}
                  <li
                    className="interact-action-item"
                    onClick={handleAddBookmark}
                  >
                    {bookmark ? (
                      <span className="item-icon active">
                        <i className="fas fa-bookmark"></i>
                      </span>
                    ) : (
                      <span className="item-icon">
                        {' '}
                        <i className="fal fa-bookmark"></i>
                      </span>
                    )}
                  </li>
                </ul>
              </aside>
              <article className="post-detail col-8 offset-2 col-lg-12 offset-lg-0">
                <div className="post-header">
                  <h2 className="post-title">{post.title}</h2>
                </div>
                <div className="author-detail">
                  <ul className="author-info-list">
                    <li className="author-info-item">
                      <Link
                        to={
                          userCurrent?.email === post.user.email
                            ? '/wall/me'
                            : `/wall/${post.userId}`
                        }
                        className="author-avatar"
                      >
                        <img
                          src={
                            post.user.picture
                              ? `${post.user.picture}`
                              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht9-qZYmqErdGMhJVbRf7BfhLRGspNWaFnR8nddu3x7Da7nqh23vsG6VWtG_VE9G9kLU&usqp=CAU'
                          }
                          alt={post.user?.displayName}
                        />
                      </Link>
                    </li>
                    <li className="author-info-item">
                      <Link
                        to={
                          userCurrent?.email === post.user.email
                            ? '/wall/me'
                            : `/wall/${post.userId}`
                        }
                        className="text-primary author-name"
                      >
                        <h3>
                          {post.user?.displayName
                            ? post.user?.displayName
                            : post.user?.lastName}
                        </h3>
                      </Link>
                      <p className="post-created-at">
                        {convertFromStringToDate(post.createdAt)}
                      </p>
                    </li>
                  </ul>
                  <ul className="interact-detail-list">
                    <li
                      className="interact-detail-item"
                      onClick={handleAddBookmark}
                    >
                      {bookmark ? (
                        <i className="fas fa-bookmark"></i>
                      ) : (
                        <i className="fal fa-bookmark"></i>
                      )}
                    </li>
                    {!isMyself && (
                      <li
                        className="interact-detail-item"
                        onClick={handleFollowUser}
                      >
                        {follow ? (
                          <i className="fas fa-user-check"></i>
                        ) : (
                          <i className="far fa-user-plus"></i>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="post-image">
                  <img src={post.cover} alt="post-cover" />
                </div>
                <div className="post-content">
                  <p
                    className="post-description"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></p>
                </div>
                <div className="post-footer">
                  <ul className="interact-detail-list">
                    <li
                      className="interact-detail-item"
                      onClick={handleLikePost}
                    >
                      {formatNumber(post.likes)}{' '}
                      {post.isLiked ? (
                        <i className="fas fa-heart"></i>
                      ) : (
                        <i className="fal fa-heart"></i>
                      )}
                    </li>
                    <li className="interact-detail-item">
                      {formatNumber(comments.length)}{' '}
                      <i className="fal fa-comment-alt-lines"></i>
                    </li>
                  </ul>
                </div>
                <div className="interact-box">
                  Responses ({comments.length})
                </div>
                <form
                  className="form-comment"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <input
                    type="text"
                    className="comment-input"
                    {...register('content')}
                  ></input>
                  <button className="btn btn-primary">Comment</button>
                </form>
              </article>
              <ul className="list-user-comment col-8 offset-2 col-lg-12 offset-lg-0">
                {comments.length > 0 &&
                  comments
                    ?.slice(0)
                    .reverse()
                    .map((props: any) => {
                      return <UserComment props={props} />;
                    })}
              </ul>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default Detail;
