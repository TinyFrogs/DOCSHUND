import { axiosJsonInstance } from "../../../utils/axiosInstance";

const baseUrl = "http://i12a703.p.ssafy.io:8081/api/v1/docshund/docs";

export const likeDocs = async (docsId) => {
  try {
    const response = await axiosJsonInstance.post(`${baseUrl}/${docsId}/likes`);
    console.log(response.data);
  } catch (error) {
    console.log("문서 좋아요 실패", error);
  }
};

export const likeTranslate = async (docsId, transId) => {
  try {
    const response = await axiosJsonInstance.post(
      `${baseUrl}/${docsId}/trans/paragraph/${transId}/votes`
    );
    console.log(response);
    return response.status;
  } catch (error) {
    console.log("번역 좋아요 실패", error);
  }
};

export const registTranslate = async (docsId, originId, content) => {
  try {
    const response = await axiosJsonInstance.post(
      `${baseUrl}/${docsId}/trans/${originId}`,
      { content: content }
    );
    console.log(response.data.message);
    return response.data.message;
  } catch (error) {
    console.log("번역 등록 실패", error);
  }
};
