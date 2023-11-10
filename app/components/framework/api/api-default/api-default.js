/* eslint-disable */
import $ from "jquery";
import { ApiError } from "../api-error/api-error";

/**
 * Отправка данных на сервер в виде JSON, а не url
 * @param {{}} params
 * @param {*} data
 * @return {*}
 */
const JSON_REQUEST_FORMAT = (params, data) => {
  params.contentType = "application/json; charset=utf-8";
  params.data = JSON.stringify(data);
  params.dataType = "json";
  return params;
};

let globalHeaders = {};

/**
 *
 * @param {{}} params
 * @param {*} data
 * @return {*}
 */
const FORMDATA_REQUEST_FORMAT = (params, data) => {
  params.data = data;
  return params;
};

const requestFormat = FORMDATA_REQUEST_FORMAT;
const DEBUG = false;
const DEFAULT_REQUEST_METHOD = "POST";

function apiRequest(api_method, data, requestMethod) {
  return $.ajax(
    api_method,
    requestFormat(
      {
        method: requestMethod,
        headers: globalHeaders
      },
      data
    )
  ).then(onStatus200, onStatusError);

  function onStatus200(response) {
    if (response.success === true && !(response.data && response.data.errors)) {
      response.data["$method"] = api_method;
      return response.data;
    }
    throw ApiError.fromApiResponse(response);
  }
  function onStatusError(xhr) {
    throw xhr.responseJSON
      ? ApiError.fromApiResponse(xhr.responseJSON)
      : ApiError.fromHttpError(xhr);
  }
}

export class Api {

  addHeader(header) {
    globalHeaders = $.extend(globalHeaders, header);
  }
  
  addAuthToken(token) {
    globalHeaders["Authorization"] = `Bearer ${token}`;
    
    // $.ajaxSetup({
    //   beforeSend: (xhr) => {
    //     if (this._token) {
    //       xhr.setRequestHeader("Authorization", `Bearer ${this._token}`);
    //     }
    //   }
    // });
  }

  deleteHeader(...names) {
    names.forEach(name=>delete globalHeaders[name]);
  }

  getUrl(method, debug) {
    const prefix = (method.indexOf("api/v1") < 0 ? "/api/v1" : "") + method;

    return base_url(debug ? `/_debug${prefix}.json` : prefix);
  }

  parse(response) {
    if (response.success === true && !(response.data && response.data.errors)) {
      return response.data;
    }
    throw ApiError.fromApiResponse(response);
  }

  send(method, params) {
    const debug = params && params.debug || DEBUG;
    return _params => {
      return apiRequest(
        this.getUrl(method, debug),
        $.extend({}, serialize(_params), serialize(params && params.data)),
        debug ? "GET" : (params && params.requestMethod) || DEFAULT_REQUEST_METHOD
      );
    };
  }
}

function serialize(params) {
  if (Array.isArray(params)) {
    return Object.keys(params)
      .reduce((list, key) => {
        const { name, value } = params[key];
        list[name] = value;
        return list;
      }, {});
  }
  return params;
}
