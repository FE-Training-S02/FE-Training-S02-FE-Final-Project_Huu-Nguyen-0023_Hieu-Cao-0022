import React, { useContext, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useHistory } from 'react-router';

import HandleTag from './HandleTag';
import HandleStatus from './HandleStatus';
import HandleImage from './HandleImage';
import { RootState } from 'app/stores/app-reducer';
import { LoadingContext } from 'app/shared/components/loading/LoadingProvider';
import { NotificationContext } from 'app/shared/components/notifications/NotificationProvider';
import {
  createNewPostRequest,
  updatePostRequest,
  uploadImage,
} from 'app/stores/post/actions';
import { UserInfoOptions } from 'app/shared/models/User';
import { postOptions } from 'app/shared/models/post-interface';
import { getToken } from 'app/shared/helper/helper-function';

interface PopupPublishOptions {
  showPopupPublish: boolean;
  setShowPopupPublish: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupPublish = ({
  showPopupPublish,
  setShowPopupPublish,
}: PopupPublishOptions) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const schema = yup.object().shape({
    cover: yup.mixed().required('File is required'),
    tags: yup.array().required('Tags is require'),
    status: yup.string().required('Status is require'),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const { infoPost }: { infoPost: postOptions; error: any } = useSelector(
    (state: RootState) => state.post
  );
  const { userCurrent }: { userCurrent: UserInfoOptions } = useSelector(
    (state: RootState) => state.userState
  );
  const { handleShowLoading } = useContext(LoadingContext);
  const { handleAddNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (infoPost) {
      reset(infoPost);
    }
  }, [infoPost]);

  const onSubmit = async (data: any) => {
    handleShowLoading(true);
    const postData = {
      ...infoPost,
      ...data,
    };
    if (postData.cover instanceof File) {
      const url = await dispatch(uploadImage(postData.cover, 'cover-post'));
      postData.cover = url;
    }
    if (infoPost?.id) {
      await dispatch(updatePostRequest(postData, String(infoPost.id))).then(
        (res: any) => {
          if (res) {
            history.push(`/post/${infoPost.id}`);
            handleAddNotification({
              type: 'SUCCESS',
              message: 'Updated new post',
            });
          } else {
            handleAddNotification({
              type: 'ERROR',
              message: 'Update post fail',
            });
          }
        }
      );
    } else {
      await dispatch(createNewPostRequest(postData)).then((res: any) => {
        if (res) {
          history.push(`/post/${res.id}`);
          handleAddNotification({
            type: 'SUCCESS',
            message: 'Created new post',
          });
        } else {
          handleAddNotification({
            type: 'ERROR',
            message: 'Create post fail',
          });
        }
      });
    }
    handleShowLoading(false);
  };

  return (
    <div className="publish-post">
      <div className="container">
        <div className="row">
          <button
            className="close-publish"
            onClick={() => setShowPopupPublish(false)}
          >
            <i className="fal fa-times"></i>
          </button>
          <form
            className="publish-content col-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="row">
              <div className="col-6 col-md-12">
                <h3 className="cover-image-title">Cover image</h3>
                <Controller
                  control={control}
                  name="cover"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => <HandleImage value={value} onChange={onChange} />}
                />
                {errors.cover ? (
                  <p className="error">{errors.cover.message}</p>
                ) : (
                  ''
                )}
              </div>
              <div className="col-6 col-md-12">
                <h3 className="publish-description">
                  Publishing to:{' '}
                  <span className="publish-author">
                    {userCurrent?.displayName
                      ? userCurrent.displayName
                      : userCurrent.lastName}
                  </span>
                </h3>
                <Controller
                  control={control}
                  name="status"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => <HandleStatus value={value} onChange={onChange} />}
                />
                {errors.status ? (
                  <p className="error">{errors.status.message}</p>
                ) : (
                  ''
                )}
                <p className="select-tags-description">
                  Note: You can only add 5 tags
                </p>
                <Controller
                  control={control}
                  name="tags"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => <HandleTag value={value} onChange={onChange} />}
                />
                {errors.tags ? (
                  <p className="error">{errors.tags.message}</p>
                ) : (
                  ''
                )}
                <button className="btn btn-primary">Publish Now</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupPublish;
