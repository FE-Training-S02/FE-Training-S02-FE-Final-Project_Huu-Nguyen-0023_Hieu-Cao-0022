import React from 'react';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { postOptions } from 'app/shared/models/post-interface';
import { calculateTimeSince, formatNumber } from 'app/shared/helper/helper-function';
import { UserInfoOptions } from 'app/shared/models/User';
import { RootState } from 'app/stores/app-reducer';
import { showModalSignInRequest } from 'app/stores/user/actions';

const Post = ({ post }: { post: postOptions }) => {
  const dispatch = useDispatch();
  const { id, title, comments, likes, user, cover, description, createdAt, tags } = post;
  const { userCurrent }: { userCurrent: UserInfoOptions } = useSelector(
    (state: RootState) => state.userState
  );
  const countLike = formatNumber(likes);
  const countComment = formatNumber(+comments);
  const timeSince = calculateTimeSince(createdAt);

  const handleToWallPage = () => {
    if (!userCurrent) {
      dispatch(showModalSignInRequest(true));
    }
  };
  return (
    <li key={id} className="list-item col-4 col-lg-6 col-md-12">
      <div className="card">
        <div className="card-img">
          <Link to={`/post/${id}`}>
            <img src={cover} alt="" className="post-image" />
          </Link>
        </div>
        <div className="card-body post-content">
          <Link to={`/post/${id}`}>
            <h2 className="card-title">{title}</h2>
          </Link>
          <ul className="card-tags">
            {tags.map((item) => (
              <li className="tag-item">{item}</li>
            ))}
          </ul>
          <p
            className="post-description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
        </div>
        <div className="card-footer">
          <Link
            to={
              userCurrent?.email === user.email
                ? '/wall/me'
                : `/wall/${user.id}`
            }
            className="post-creator-info"
            onClick={handleToWallPage}
          >
            <img
              src={
                user && user.picture
                  ? `${user.picture}`
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht9-qZYmqErdGMhJVbRf7BfhLRGspNWaFnR8nddu3x7Da7nqh23vsG6VWtG_VE9G9kLU&usqp=CAU'
              }
              alt={user?.displayName}
              className="author-avatar"
            />
            <div className="author-info">
              <h4 className="card-content author-name">
                {user?.displayName ? user?.displayName : user?.lastName}
              </h4>
              <p className="card-content post-sub-info">{timeSince}</p>
            </div>
          </Link>
          <div className="post-status-info">
            <div className="post-interact ">
              <p>
                {countLike} <i className="fal fa-heart"></i>
              </p>
              <p>
                {countComment} <i className="fal fa-comment"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
export default Post;
