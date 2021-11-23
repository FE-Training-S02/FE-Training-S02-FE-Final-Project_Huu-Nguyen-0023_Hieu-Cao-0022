import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from 'app/stores/app-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import UserComment from './partials/UserComment';
import {
  getUserInfoByIdRequest,
  showModalSignInRequest,
} from 'app/stores/user/actions';

import { formatNumber } from 'app/shared/helper/helper-function';
import {
  commentPostRequest,
  fetchSpecificPostRequest,
  followUserRequest,
  addBookmarkRequest,
  getCommentPostRequest,
  likePostRequest,
} from 'app/stores/post/actions';

const Detail = () => {
  const dispatch = useDispatch();
  const { id }: any = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [post, setPost] = useState<any>();
  const [comments, setComments] = useState<any>([]);
  const [follow, setFollow] = useState<boolean>(false);
  const { userCurrent }: any = useSelector(
    (state: RootState) => state.userState
  );

  const [bookmark, setBookmark] = useState<boolean>(false);
  const [showComment, setShowComment] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSpecificPostRequest(id)).then((res: any) => {
      setPost(res);
      setBookmark(res.isInBookmark);
    });
    dispatch(getCommentPostRequest(id)).then((res: any) => setComments(res));
  }, [id]);

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

  const handleShowComment = () => {
    setShowComment(!showComment);
  };

  const onSubmit = (data: CommentHandleOptions) => {
    if (userCurrent) {
      dispatch(commentPostRequest(id, data)).then((res: any) => {
        let newComment = {
          ...res,
          user: {
            displayName: userCurrent?.displayName,
          },
        };
        setComments((comments: any) => [...comments, newComment]);
      });
      setShowComment(true);
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
    let data = {
      postId: String(post.id),
    };
    dispatch(addBookmarkRequest(data)).then((res: any) => {
      setBookmark(res.isInBookmark);
    });
  };

  return (
    <>
      {post ? (
        <div className="detail-page">
          <div className="container">
            <div className="row">
              <aside className="author-interact">
                <ul className="interact-action-list">
                  <li className="interact-action-item" onClick={handleLikePost}>
                    <span className="item-icon">
                      {post.isLiked ? (
                        <i className="fas fa-heart"></i>
                      ) : (
                        <i className="fal fa-heart"></i>
                      )}
                    </span>
                  </li>
                  <li
                    className="interact-action-item"
                    onClick={handleFollowUser}
                  >
                    <span className="item-icon">
                      {follow ? (
                        <i className="fal fa-user-minus"></i>
                      ) : (
                        <i className="fal fa-user-plus"></i>
                      )}
                    </span>
                  </li>
                  <li
                    className="interact-action-item"
                    onClick={handleAddBookmark}
                  >
                    <span className="item-icon">
                      {bookmark ? (
                        <i className="fas fa-bookmark"></i>
                      ) : (
                        <i className="fal fa-bookmark"></i>
                      )}
                    </span>
                  </li>
                </ul>
              </aside>
              <article className="post-detail col-8 offset-2 col-lg-12 offset-lg-0">
                <div className="post-header">
                  <h2 className="post-title">{post.title}</h2>
                </div>
                <div className="author-detail">
                  <ul className="author-info-list">
                    <li className="author-info-item author-avatar">
                      <img
                        src={
                          post.user.picture
                            ? `${post.user.picture}`
                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht9-qZYmqErdGMhJVbRf7BfhLRGspNWaFnR8nddu3x7Da7nqh23vsG6VWtG_VE9G9kLU&usqp=CAU'
                        }
                        alt={post.user?.displayName}
                      />
                    </li>
                    <li className="author-info-item author-name">
                      <Link to="" className="text-primary">
                        <h3>{post.user?.displayName}</h3>
                      </Link>
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
                    <li
                      className="interact-detail-item"
                      onClick={handleFollowUser}
                    >
                      {follow ? (
                        <i className="fal fa-user-minus"></i>
                      ) : (
                        <i className="fal fa-user-plus"></i>
                      )}
                    </li>
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
                    <li
                      className="interact-detail-item"
                      onClick={handleShowComment}
                    >
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
                {showComment &&
                  comments
                    ?.slice(0)
                    .reverse()
                    .map((props: any) => {
                      return <UserComment props={props} />;
                    })}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default Detail;
