export const apiService = async ({
  url,
  method = "GET",
  data = null,
  headers = {},
  params = {},
}) => {
  try {
    // Build query params if provided (for GET or DELETE)
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data && method !== "GET" && method !== "DELETE") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);

    const contentType = response.headers.get("Content-Type");

    const isJson = contentType && contentType.includes("application/json");

    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(responseData?.message || responseData?.error || "API Error");
    }

    return responseData;
  } catch (error) {
    console.error("API Service Error:", error.message);
    return { error: true, message: error.message };
  }
};


const getTickets = async () => {
        const jsonbody = {
            "email": "sancharikarmakar40@gmail.com"
        };
        try {
            const response = await apiService({
                url: POST_url.userTicket,
                method: "POST",
                data: jsonbody,
            });
            setTickets(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Failed to fetch tickets:", error.message);
            setTickets([]);
        }
}