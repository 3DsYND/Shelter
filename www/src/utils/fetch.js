const queryString = params => {
  if (params) {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&")
  }
  return ""
}

const createUrl = (url, queryOptions) => {
  return url + "?" + queryString(queryOptions)
}

export default function (url, options = { body: {}, query: {} }) {
  let fetchOptions = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
  };
  if (fetchOptions.method !== "GET") {
    fetchOptions["body"] = JSON.stringify(options.body);
  }

  return fetch(createUrl(url, options.query), fetchOptions)
    //.then(response => response.json())
    .catch(error => {
      return {
        response: { status: error},//"network_failure" },
        error: true,
      }
    })
}
