import axios from "axios";

export const postImage = async (url, data) => {
  const response = await axios.post(
    url,
    { image: data.base64 },
    {
      headers: {
        Authorization: "fa62910f8e5841247fb5e78d409d38d0cc1fef46",
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response, "<-------response");
  return response;
};
