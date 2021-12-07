import React, { useState, useContext, FormEvent, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputMask from 'react-input-mask';

import { UserLoginOptions } from 'app/shared/types/UserLogin';
import { clearUserState, signUpRequest } from 'app/stores/user/actions';
import { RootState } from '../../../stores/app-reducer';
import { NotificationContext } from '../notifications/NotificationProvider';
import { LoadingContext } from '../loading/LoadingProvider';

interface SignUpEmailOptions {
  handleShowSignInModal: () => void;
  handleShowSignInEmail: () => void;
}

const SignUpEmail = ({
  handleShowSignInModal,
  handleShowSignInEmail,
}: SignUpEmailOptions) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('lastName name is required'),
    displayName: yup.string().required('displayName name is required'),
    phone: yup
      .string()
      .trim()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Wrong phone number')
      .required('phone is required'),
    email: yup.string().email('Invalid email').required('Invalid email'),
    password: yup
      .string()
      .min(8, 'Password must be more than 8 characters')
      .max(20, 'Password must be less than 20 characters')
      .required(),
  });
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [showErrorDate, setShowErrorDate] = useState<boolean>(false);
  const [pass, setPass] = useState<string>('');
  const [repeatPass, setRepeatPass] = useState<string>('');

  const { handleAddNotification } = useContext(NotificationContext);
  const { handleShowLoading } = useContext(LoadingContext);
  const { isLoading, message, error } = useSelector(
    (state: RootState) => state.userState
  );

  useEffect(() => {
    handleShowLoading(isLoading ? true : false);
    if (error) {
      handleAddNotification({ type: 'ERROR', message: error });
    }
    if (message) {
      handleAddNotification({
        type: 'SUCCESS',
        message: 'Sign up user success',
      });
      handleShowSignInEmail();
    }
  }, [isLoading, message, error]);

  useEffect(() => {
    return () => {
      dispatch(clearUserState());
    };
  }, []);

  const resetForm = () => {
    reset();
    setDateOfBirth('');
  };

  useEffect(() => {
    if (pass.length >= 8) {
      clearErrors('password');
    }
  }, [pass, clearErrors]);

  useEffect(() => {
    let date = new Date(dateOfBirth);
    let currentDate = new Date();
    if (date.getTime() > currentDate.getTime()) {
      setError('dateOfBirth', {
        type: 'manual',
        message: 'Wrong date of birth',
      });
    } else {
      clearErrors('dateOfBirth');
    }
  }, [dateOfBirth, clearErrors, setError]);

  const handleCheckDateOfBirth = () => {
    if (dateOfBirth.length === 0) {
      setShowErrorDate(true);
    }
  };

  const onSubmit = (data: UserLoginOptions) => {
    if (pass === repeatPass) {
      const infoUser = {
        ...data,
        gender: gender,
        dob: dateOfBirth,
      };
      dispatch(signUpRequest(infoUser, resetForm));
    } else {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Password not match',
      });
    }
  };

  return (
    <div className="sign-up-email">
      <h2 className="sign-up-email-title">
        Join <span className="blog-name">Boogle</span>
      </h2>
      <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="label-input">
          <span>Email : </span>
          <input type="text" placeholder="Email" {...register('email')}></input>
        </label>
        {errors.email ? <p className="error">{errors.email.message}</p> : ''}
        <label className="label-input">
          <span>First Name : </span>
          <input
            type="text"
            placeholder="First name"
            {...register('firstName')}
          ></input>
        </label>
        {errors.firstName ? (
          <p className="error">{errors.firstName.message}</p>
        ) : (
          ''
        )}
        <label className="label-input">
          <span>Last Name : </span>
          <input
            type="text"
            placeholder="Last name"
            {...register('lastName')}
          ></input>
        </label>
        {errors.lastName ? (
          <p className="error">{errors.lastName.message}</p>
        ) : (
          ''
        )}
        <label className="label-input">
          <span>Display Name : </span>
          <input
            type="text"
            placeholder="Display name"
            {...register('displayName')}
          ></input>
        </label>
        {errors.displayName ? (
          <p className="error">{errors.displayName.message}</p>
        ) : (
          ''
        )}
        <div className="select-gender">
          <label className="container-radio">
            Male
            <input
              type="radio"
              name="radio"
              checked={gender === 'male' ? true : false}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setGender('male');
              }}
            ></input>
            <span className="checkmark"></span>
          </label>
          <label className="container-radio">
            Female
            <input
              type="radio"
              name="radio"
              checked={gender === 'female' ? true : false}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setGender('female');
              }}
            ></input>
            <span className="checkmark"></span>
          </label>
        </div>
        <label className="label-input">
          <span>Date of birth : </span>
          <InputMask
            mask="99/99/9999"
            placeholder="Enter birth date"
            value={dateOfBirth}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setDateOfBirth(e.currentTarget.value)
            }
          />
        </label>
        {showErrorDate ? (
          <p className="error">Date Of Birth is required</p>
        ) : (
          ''
        )}
        <label className="label-input">
          <span>Phone number : </span>
          <input
            type="number"
            placeholder="Phone"
            {...register('phone')}
          ></input>
        </label>
        {errors.phone ? <p className="error">{errors.phone.message}</p> : ''}
        <label className="label-input">
          <span>Password : </span>
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setPass(e.currentTarget.value)
            }
          ></input>
        </label>
        {errors.password ? (
          <p className="error">{errors.password.message}</p>
        ) : (
          ''
        )}
        <label className="label-input">
          <span>Repeat password : </span>
          <input
            type="password"
            placeholder="Repeat password"
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setRepeatPass(e.currentTarget.value)
            }
          ></input>
        </label>
        {errors.repeatPassword ? (
          <p className="error">{errors.repeatPassword.message}</p>
        ) : (
          ''
        )}
        <button className="btn btn-primary" onClick={handleCheckDateOfBirth}>
          Sign Up
        </button>
      </form>
      <Link to="" className="back-all-action" onClick={handleShowSignInModal}>
        <i className="fal fa-chevron-left"></i> All sign in options
      </Link>
    </div>
  );
};

export default SignUpEmail;
