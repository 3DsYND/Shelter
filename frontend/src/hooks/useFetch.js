import { useState, useEffect } from "react"

const queryString = params =>
  Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&")

const createUrl = (url, queryOptions) => {
  return url + "?" + queryString(queryOptions)
}

export default (url, options = { body: {}, query: {} }) => {
  const [data, setData] = useState({
    response: null,
    error: false,
    loading: true,
  })

  useEffect(() => {
    setData((data) => ({ ...data, error: null, loading: true }))

    let fetchOptions = {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json" },
    };
    if (fetchOptions.method !== "GET") {
      fetchOptions["body"] = JSON.stringify(options.body);
    }

    fetch(createUrl(url, options.query), fetchOptions)
      .then(async response => {
        const data = await response.json()
        setData({
          response: data,
          error: !response.ok,
          loading: false,
        })
      })
      .catch(error => {
        setData({
          response: { status: error},//"network_failure" },
          error: true,
          loading: false,
        })
      })
  }, [url, options.method, JSON.stringify(options.query), JSON.stringify(options.body)])
  return data;
}
