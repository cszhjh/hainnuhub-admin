import $http from "../index";
import { interceptors } from "../config";

export function releaseForumRequest(payload) {
  return $http.post({
    url: "/forum",
    data: payload,
    interceptors
  });
}

export function getForumRequest({ forumId, userId }) {
  return $http.get({
    url: "/forum/" + forumId,
    params: {
      userId
    },
    showLoading: false
  });
}

export function getForumListRequest({
  offset = 0,
  size = 10,
  labelId = 0,
  type = 0
}) {
  return $http.get({
    url: "/forum",
    params: {
      offset,
      size,
      labelId,
      type
    },
    showLoading: false
  });
}

export function getForumListFuzzyRequest(payload) {
  return $http.get({
    url: "/forum/fuzzy",
    params: payload
  });
}

export function updateForumRequest(payload) {
  return $http.patch({
    url: "/forum/" + payload.forumId,
    data: payload,
    interceptors
  });
}

export function removeForumRequest({ forumId }) {
  return $http.delete({
    url: "/forum/" + forumId,
    interceptors
  });
}

export function doLikeRequest({ forumId }) {
  return $http.post({
    url: `/forum/${forumId}/dolike`,
    showLoading: false,
    interceptors
  });
}

export function getAttachmentInfoRequest({ forumId }) {
  return $http.get({
    url: "/forum/attachment/" + forumId,
    showLoading: false
  });
}

export function incrementDownloadCount({ forumId }) {
  return $http.post({
    url: "/forum/attachment/downloadCount/" + forumId,
    showLoading: false,
    showMessage: false,
    interceptors
  });
}

export function incrementReadCount({ forumId }) {
  return $http.post({
    url: `/forum/${forumId}/read`,
    showLoading: false,
    showMessage: false
  });
}

export function updateLabelRequest({ forumId, labels }) {
  return $http.post({
    url: `/forum/${forumId}/labels`,
    data: { labels },
    interceptors
  });
}

export function auditRequest({ forumIds, status }) {
  return $http.post({
    url: "/forum/audit",
    data: {
      forumIds,
      status
    },
    interceptors
  });
}
