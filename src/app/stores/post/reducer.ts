import { postConstant } from 'app/shared/constants/postConstant';

const initialState = {
  error: null,
  infoPost: null,
  urlImage: null,
  quantityFollowing: null,
  isLoading: false,
};

const postReducer = (
  state: any = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case postConstant.SAVE_INFO_POST:
      return {
        ...state,
        infoPost: action.payload,
      };
    case postConstant.SAVE_URL_IMAGE:
      return {
        ...state,
        urlImage: action.payload,
      };
    case postConstant.CLEAR_URL_IMAGE:
      return {
        ...state,
        urlImage: null,
      };
    case postConstant.LOADING_UPLOAD_IMAGE:
      return {
        ...state,
        isLoading: action.payload,
      };
    case postConstant.ERROR_API:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
