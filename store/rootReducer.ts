import { combineReducers } from 'redux';
import authReducer from './slices/authReducer';
import certificateReducer from './slices/certificateSelectedReducer';
const rootReducer = combineReducers({
   auth: authReducer,
   certificate: certificateReducer,
});

export default rootReducer;
