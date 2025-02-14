// hooks/useKoreanTime.js
import { format, parseISO, addHours } from "date-fns";
import { ko } from "date-fns/locale";

const useKoreanTime = () => {
  const convertToKoreanTime = (dateString) => {
    if (!dateString) return "";

    try {
      const date = parseISO(dateString);
      const koreanTime = addHours(date, 9);

      // 오늘 날짜인 경우 시:분만 표시
      const now = new Date();
      const isToday =
        format(koreanTime, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

      return format(koreanTime, isToday ? "HH:mm" : "yyyy-MM-dd HH:mm", {
        locale: ko,
      });
    } catch (error) {
      console.error("Date conversion error:", error);
      return "";
    }
  };

  return { convertToKoreanTime };
};

export default useKoreanTime;
