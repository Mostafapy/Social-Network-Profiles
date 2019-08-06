import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';

export default combineReducers({
  auth: AuthReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer,
});
