import { UPDATE_CHAT_BADGE} from "./actionTypes";

export const updateChatBadge = (badgeCount) => {
    return {
        type: UPDATE_CHAT_BADGE,
        badgeCount
    };
}

