import { UPDATE_CHAT_BADGE } from "../actions/actionTypes";

const initialState = {
  count: 0
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_BADGE:
      return {
        ...state,
        count: action.badgeCount
      };

    default:
      return state;
  }
};

export default notificationReducer;