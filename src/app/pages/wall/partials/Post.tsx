import React from 'react';

import { Link } from 'react-router-dom';
import { postOptions } from 'app/shared/models/post-interface';
import { calculateTimeSince } from 'app/shared/helper/helper-function';

const PostItem = ({
  post,
  handleDeletePost,
  isMyself,
  showBookmark,
}: {
  post: postOptions;
  handleDeletePost: (id: number) => void;
  isMyself: boolean;
  showBookmark: boolean;
}) => {
  const { id, title, cover, description, createdAt, status, tags } = post;
  const timeSince = calculateTimeSince(createdAt);

  return (
    <li key={id} className="post-item">
      <Link to={`/post/${id}`} className="item-img">
        <img src={cover} alt="" className="item-image" />
      </Link>
      <div className="item-detail">
        <div className="item-content">
          <Link to={`/post/${id}`} className="item-title">
            <h2>{title}</h2>
          </Link>
          <div className="item-description">{description}</div>
        </div>
        <ul className="sub-info-list">
          Tags:
          {tags?.map((item, index) => {
            return (
              <li key={index} className="sub-info-item">
                {item}
              </li>
            );
          })}
        </ul>
        <div className="time-status-info">
          <p className="time-info">{timeSince}</p>
          {isMyself && !showBookmark && (
            <p className="status-info">
              {status === 'public' ? (
                <i className="fal fa-globe-americas"></i>
              ) : (
                <i className="fal fa-lock-alt"></i>
              )}
            </p>
          )}
        </div>
      </div>
      {isMyself && !showBookmark && (
        <div className="sign-optional">
          <i className="far fa-ellipsis-h dot"></i>
          <ul className="list-option">
            <Link to={`/post/${id}/edit`} className="option-item">
              <i className="fal fa-pencil-alt option-item-icon"></i> Edit
            </Link>
            <li
              className="option-item"
              onClick={() => {
                handleDeletePost(id);
              }}
            >
              <i className="fal fa-trash-alt option-item-icon"></i> Delete
            </li>
          </ul>
        </div>
      )}
    </li>
  );
};
export default PostItem;
