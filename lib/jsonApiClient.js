/**
 * Client for JSON API server.
 * We use "jsonapi-parse" package to format responses :
 * It resolves relationships and included objects nicely in the final data object.
 */
import jsonapiParse from 'jsonapi-parse';
import axios from 'axios';
import qs from 'qs';

// Add a response interceptor to format response with jsonapi-parse
axios.interceptors.response.use(response => {
  const parsedResponse = jsonapiParse.parse(response.data);
  if (parsedResponse === undefined) {
    return response;
  }
  return parsedResponse.data;
});

function prepareUrl(uri, params = null, useBaseUrl = 'api') {
  const query = params ? '?' + qs.stringify(params, { indices: false }) : '';
  let url = `${uri}${query}`;
  if (useBaseUrl === 'api') {
    url = `${process.env.serverApiUrl}/${url}`;
  } else if (useBaseUrl === 'server') {
    url = `${process.env.serverBaseUrl}/${url}`;
  }
  return url;
}

export default {
  prepareUrl: prepareUrl,
  get: (uri, params = null, useBaseUrl = 'api') => {
    const url = prepareUrl(uri, params, useBaseUrl);
    return axios.get(url);
  },
  post: (uri, params = null, data = null, useBaseUrl = 'api') => {
    const url = prepareUrl(uri, params, useBaseUrl);
    return axios.post(url, data);
  },
};
