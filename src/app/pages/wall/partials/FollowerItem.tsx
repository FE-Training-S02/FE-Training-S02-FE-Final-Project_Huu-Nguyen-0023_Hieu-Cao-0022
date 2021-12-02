import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { followUserRequest } from 'app/stores/post/actions';

const FollowerItem = (props: any) => {
  const dispatch = useDispatch();
  const { person, action, handleShowPopupFollow } = props;
  const [follow, setFollow] = useState<boolean>(true);
  const { id }: { id: string } = useParams();

  const handleUnfollow = () => {
    let data = {
      followingId: person.id,
    };
    setFollow(!follow);
    dispatch(followUserRequest(data)).then((res: any) => {
      console.log(res);
      props.setCountFollow(
        res.followed
          ? (preState: number) => preState + 1
          : (preState: number) => preState - 1
      );
    });
  };
  return (
    <div key={person.id} className="follow-item">
      <Link
        to={`/wall/${person.id}`}
        className="follow-item-content"
        onClick={() => handleShowPopupFollow(false)}
      >
        <img
          src={
            person?.picture
              ? `${person?.picture}`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht9-qZYmqErdGMhJVbRf7BfhLRGspNWaFnR8nddu3x7Da7nqh23vsG6VWtG_VE9G9kLU&usqp=CAU'
          }
          alt=""
          className="user-avatar"
        ></img>
        <span className="user-name">
          {person?.displayName ? person?.displayName : person?.lastName}
        </span>
      </Link>
      {action &&
        id === 'me' &&
        (follow ? (
          <button className="btn btn-primary" onClick={() => handleUnfollow()}>
            <i className="fas fa-user-check"></i>
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => handleUnfollow()}>
            <i className="far fa-user-plus"></i>
          </button>
        ))}
    </div>
  );
};
export default FollowerItem;
