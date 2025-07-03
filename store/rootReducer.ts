import { combineReducers } from 'redux';
import authReducer from './slices/authReducer';
const rootReducer = combineReducers({
   auth: authReducer,
});

export default rootReducer;
