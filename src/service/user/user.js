import $http from "../index";
import { interceptors } from "../config";

export function loginRequest(account) {
  account.type = 2;
  return $http.post({
    url: "/admin/login",
    data: account,
    showLoading: false
  });
}

export function logoutRequest() {
  return $http.post({
    url: "/logout",
    showMessage: false
  });
}

export function resetPasswordRequest(account) {
  return $http.patch({
    url: "/users/forgot",
    data: account,
    showLoading: false
  });
}

export function sendEmailCodeRequest(account) {
  account.type = 2;
  return $http.post({
    url: "/sendEmailCode",
    data: account,
    showLoading: false
  });
}

export function updateUserInfoRequest(payload) {
  return $http.patch({
    url: "/users/update",
    data: payload,
    interceptors,
    showLoading: false,
    showMessage: payload.type !== false
  });
}

export function setRoleRequest({ userId }) {
  return $http.post({
    url: "/users/role",
    data: { userId },
    interceptors
  });
}

export function getUserInfoRequest({ userId }) {
  return $http.get({
    url: `/users/${userId}/info`,
    showLoading: false
  });
}

export function getUserListFuzzyRequest(payload) {
  return $http.get({
    url: "/users/list",
    params: payload
  });
}

export function getUserForumInfoRequest({ userId, type }) {
  return $http.get({
    url: `/users/${userId}/forum`,
    params: { type },
    showLoading: false
  });
}

export function getMessageCountRequest() {
  return $http.get({
    url: "/users/message",
    showLoading: false,
    showMessage: false
  });
}

export function updateMessageStateRequest({ messageType, offset, size }) {
  return $http.patch({
    url: `/users/message/${messageType}`,
    data: {
      offset,
      size
    },
    interceptors,
    showLoading: false
  });
}

export function sendSystemMessageRequest({
  receivedUserId,
  userId,
  username,
  message
}) {
  return $http.post({
    url: `/system/${receivedUserId}`,
    data: {
      userId,
      username,
      message
    },
    interceptors
  });
}

export function verifyLoginStateRequest() {
  return $http.get({
    url: "/test",
    showLoading: false,
    showMessage: false
  });
}
