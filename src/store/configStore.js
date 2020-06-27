import { createStore, combineReducers } from 'redux';
import notificationReducer  from './reducers/notificationReducer';

const rootReducer = combineReducers({
    counter: notificationReducer,
});

const configStore = () => {
    return createStore(rootReducer);
};

export default configStore;