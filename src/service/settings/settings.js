import $http from "../index";
import { interceptors } from "../config";

export function getSettingsRequest() {
  return $http.get({
    url: "/settings"
  });
}

export function settingsRequest(payload) {
  return $http.post({
    url: "/settings/set",
    data: payload,
    interceptors
  });
}
