import React from 'react';

import { Link } from 'react-router-dom';

const SlideItem = ({ post, index }: { post: any; index: number }) => {
  return (
    <li
      className="post-item"
      style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
    >
      <Link to={`/post/${post.id}`} className="post-link">
        <div className="row">
          <div className="post-image col-6 col-md-12">
            <img src={post.cover} alt=""></img>
          </div>
          <div className="post-content col-6 col-md-12">
            <p className="post-topic">Business, Travel</p>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-text-content">{post.content}</p>
            <div className="post-author">
              <img
                src={post.user.picture}
                alt=""
                className="author-avatar"
              ></img>
              <div className="author-content">
                <p className="author-name">
                  {post.user.displayName
                    ? post.user.displayName
                    : post.user.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SlideItem;
