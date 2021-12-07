import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { UserInfoOptions } from '../models/User';
import { RootState } from 'app/stores/app-reducer';
import { logoutRequest, showModalSignInRequest } from 'app/stores/user/actions';
import AuthenticationModal from './authentication/AuthenticationModal';

const Header = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showUserAction, setShowUserAction] = useState<boolean>(false);
  const {
    userCurrent,
    showModalSignIn,
  }: { userCurrent: UserInfoOptions; showModalSignIn: boolean } = useSelector(
    (state: RootState) => state.userState
  );
  const token = localStorage.getItem('USER_TOKEN');

  useEffect(() => {
    if (showModalSignIn) {
      dispatch(showModalSignInRequest(true));
    }
  }, [showModalSignIn]);

  const handleShowMobileMenu = () => {
    setShowMenu(true);
  };
  const handleHiddenMobileMenu = () => {
    setShowMenu(false);
  };
  const handleShowUserAction = () => {
    setShowUserAction(!showUserAction);
  };
  const handleSignOut = () => {
    dispatch(logoutRequest());
  };

  const handleShowSignInModal = () => {
    dispatch(showModalSignInRequest(true));
    handleHiddenMobileMenu();
  };
  const UserAction = () => (
    <li className="user-avatar">
      <img
        src={
          userCurrent?.picture
            ? `${userCurrent.picture}`
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht9-qZYmqErdGMhJVbRf7BfhLRGspNWaFnR8nddu3x7Da7nqh23vsG6VWtG_VE9G9kLU&usqp=CAU'
        }
        alt=""
        className="avatar-image"
        onClick={handleShowUserAction}
      ></img>
      {showUserAction ? (
        <div className="user-action">
          <ul className="action-list">
            <li className="action-item">
              <Link
                to={`/wall/me`}
                className="action-link"
                onClick={handleShowUserAction}
              >
                Profile
              </Link>
            </li>
            <li className="action-item">
              <Link
                to="/user/update"
                className="action-link"
                onClick={handleShowUserAction}
              >
                Update information
              </Link>
            </li>
            <li className="action-item">
              <Link
                to="/user/changepass"
                className="action-link"
                onClick={handleShowUserAction}
              >
                Update password
              </Link>
            </li>
            <li className="action-item" onClick={handleSignOut}>
              <Link
                to=""
                className="action-link"
                onClick={handleShowUserAction}
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        ''
      )}
    </li>
  );
  return (
    <header>
      <div className="page-header container">
        <Link to="/" className="menu-link">
          <h1 className="header-logo">
            <span className="text-primary logo-letter">B</span>oogle
          </h1>
        </Link>
        <div className="header-action">
          <nav className="navigation-bar">
            <ul className="group-item menu-list">
              <li className="list-item menu-item">
                <Link to="/" className="text-primary menu-link">
                  Home
                </Link>
              </li>
              {token ? (
                <li className="list-item menu-item">
                  <Link to="/post/new" className="menu-link">
                    Write
                  </Link>
                </li>
              ) : (
                ''
              )}
              {token ? (
                <UserAction />
              ) : (
                <li className="list-item menu-item">
                  <p className="menu-link" onClick={handleShowSignInModal}>
                    Sign In
                  </p>
                </li>
              )}
              <li className="list-item menu-item menu-mobile">
                <ul
                  className={
                    showMenu
                      ? 'group-item menu-mobile-list active'
                      : 'group-item menu-mobile-list'
                  }
                >
                  <li className="list-item menu-mobile-item hide-menu">
                    <button
                      className="hide-menu-btn"
                      onClick={handleHiddenMobileMenu}
                    >
                      <i className="fal fa-times"></i>
                    </button>
                  </li>
                  <li className="list-item menu-mobile-item">
                    <Link
                      to="/"
                      className="text-primary menu-mobile-link"
                      onClick={handleHiddenMobileMenu}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="list-item menu-mobile-item">
                    <Link
                      to="/post/new"
                      className="menu-mobile-link"
                      onClick={handleHiddenMobileMenu}
                    >
                      Write
                    </Link>
                  </li>
                  {!token ? (
                    <li
                      className="list-item menu-mobile-item"
                      onClick={handleShowSignInModal}
                    >
                      <Link to="" className="menu-mobile-link">
                        Sign In
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
                <Link
                  to="/"
                  className="menu-link menu-bar"
                  onClick={handleShowMobileMenu}
                >
                  <i className="fas fa-bars"></i>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {showModalSignIn ? <AuthenticationModal /> : ''}
    </header>
  );
};;

export default Header;
