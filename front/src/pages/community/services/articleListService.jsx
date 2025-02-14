import { axiosJsonInstance } from "../../../utils/axiosInstance";
import propTypes from "prop-types";

const ArticleListService = {
  // fetchArticles 함수는 filter, keyword, page, size를 인자로 받아서 데이터를 가져오는 함수
  async fetchArticles(
    sortType,
    filter,
    keyword,
    searchType,
    page,
    itemsPerPage
  ) {
    try {
      // TODO: 데이터 axios로 변경 필요
      const response = await axiosJsonInstance.get(
        // postman forked mock server endpoint
        `forums?sort=${sortType}&filter=${filter}&keyword=${keyword}&searchType=${searchType}&page=${page}&size=${itemsPerPage}`
      );

      const data = response.data;

      // TODO: 게시글이 itempsPerPage 초과일 경우에 대한 예외처리 필요

      return data;
    } catch (error) {
      //TODO: error handling -> 에러 페이지 제작후 연결까지 구현
      console.error(error);
      return null;
    }
  },
};

ArticleListService.fetchArticles.propTypes = {
  sortType: propTypes.string,
  filter: propTypes.string,
  keyword: propTypes.string,
  searchType: propTypes.string,
  page: propTypes.number,
  itemsPerPage: propTypes.number,
};

export default ArticleListService;
