import React, { useContext, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { RootState } from 'app/stores/app-reducer';
import {
  clearUserState,
  getUserInfoRequest,
  updateUserInfoRequest,
} from 'app/stores/user/actions';
import SelectGender from './partials/SelectGender';
import HandleBirthdate from './partials/HandleBirthdate';
import Avatar from './partials/Avatar';
import { uploadImage } from 'app/stores/post/actions';
import { NotificationContext } from 'app/shared/components/notifications/NotificationProvider';
import { LoadingContext } from 'app/shared/components/loading/LoadingProvider';
import { useHistory } from 'react-router';

const UpdateInfo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('lastName name is required'),
    displayName: yup.string().required('displayName name is required'),
    dob: yup.string().required('dob name is required'),
    picture: yup.mixed().required('You need upload image to update'),
    phone: yup
      .string()
      .trim()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Wrong phone number')
      .required(),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { handleAddNotification } = useContext(NotificationContext);
  const { handleShowLoading } = useContext(LoadingContext);
  const { userCurrent, isLoading, message, error } = useSelector(
    (state: RootState) => state.userState
  );

  useEffect(() => {
    dispatch(getUserInfoRequest());
  }, []);

  useEffect(() => {
    handleShowLoading(isLoading ? true : false);
    if (error) {
      handleAddNotification({ type: 'ERROR', message: error });
    }
    if (message) {
      handleAddNotification({
        type: 'SUCCESS',
        message: 'Update user info success',
      });
      reset(userCurrent);
      setTimeout(() => {
        history.push('/');
      }, 2500);
    }
    if (userCurrent) {
      reset(userCurrent);
    }
  }, [isLoading, message, error]);

  useEffect(() => {
    return () => {
      dispatch(clearUserState());
    };
  }, []);

  const onSubmit = async (data: any) => {
    const infoData = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dob: data.dob,
      displayName: data.displayName,
      phone: data.phone,
      picture: data.picture,
    };
    if (data.picture instanceof File) {
      const url = await dispatch(uploadImage(data.picture, 'avatar'));
      infoData.picture = url;
    }
    dispatch(updateUserInfoRequest(infoData));
  };

  return (
    <section className="section-update-info">
      <div className="container">
        <h2 className="update-info-title">Update information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="update-form">
          <Controller
            control={control}
            name="picture"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <Avatar value={value} onChange={onChange} />
            )}
          />
          {errors.picture ? (
            <p className="error error-avatar">{errors.picture.message}</p>
          ) : (
            ''
          )}
          <label className="label-input">
            <span>First name : </span>
            <input placeholder="First name" {...register('firstName')}></input>
          </label>
          {errors.firstName ? (
            <p className="error">{errors.firstName.message}</p>
          ) : (
            ''
          )}
          <label className="label-input">
            <span>Last name : </span>
            <input placeholder="Last name" {...register('lastName')}></input>
          </label>
          {errors.lastName ? (
            <p className="error">{errors.lastName.message}</p>
          ) : (
            ''
          )}
          <Controller
            control={control}
            name="gender"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <SelectGender value={value} onChange={onChange} />
            )}
          />
          <label className="label-input">
            <span>Date of birth : </span>
            <Controller
              control={control}
              name="dob"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <HandleBirthdate value={value} onChange={onChange} />
              )}
            />
          </label>
          {errors.dob ? <p className="error">{errors.dob.message}</p> : ''}
          <label className="label-input">
            <span>Display name : </span>
            <input
              placeholder="Display name"
              {...register('displayName')}
            ></input>
          </label>
          {errors.displayName ? (
            <p className="error">{errors.displayName.message}</p>
          ) : (
            ''
          )}
          <label className="label-input">
            <span>Phone number : </span>
            <input placeholder="Phone" {...register('phone')}></input>
          </label>
          {errors.phone ? <p className="error">{errors.phone.message}</p> : ''}
          <div className="form-btn">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateInfo;
