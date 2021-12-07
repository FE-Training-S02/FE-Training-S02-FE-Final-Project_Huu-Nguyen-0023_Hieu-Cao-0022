import React, { useEffect, useState } from 'react';

import { Switch, Route, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../stylesheets/styles.scss';

import AuthRoute from './routes/AuthRoute';
import Header from './shared/components/Header';
import Home from './pages/home/Home';
import ChangePassword from './pages/resetPassword/ChangePassword';
import Detail from './pages/detail/Detail';
import Wall from './pages/wall/Wall';
import HandlePost from './pages/handlePost/HandlePost';
import UpdateInfo from './pages/updateInfo/UpdateInfo';
import { getUserInfoRequest, logoutRequest } from './stores/user/actions';
import NotFound from './pages/notFound/NotFound';

function App() {
  const dispatch = useDispatch();
  const [reload, setReload] = useState<boolean>(false);
  const { pathname }: { pathname: string } = useParams();

  const [token, setToken] = useState(localStorage.getItem('USER_TOKEN'));

  useEffect(() => {
    dispatch(getUserInfoRequest());
  }, []);

  useEffect(() => {
    setReload(!reload);
    if (!localStorage.getItem('USER_TOKEN')) {
      dispatch(logoutRequest());
    }
  }, [pathname]);

  return (
    <>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/post/:id" exact component={Detail} />
        <AuthRoute
          path={['/post/new', '/post/:id/edit']}
          exact
          component={HandlePost}
        />
        <AuthRoute path="/wall/:id" exact component={Wall} />
        <AuthRoute path="/user/update" component={UpdateInfo} />
        <AuthRoute path="/user/changepass" component={ChangePassword} />
        <Route path="*" exact={true} component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
