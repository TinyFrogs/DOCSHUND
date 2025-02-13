import { useEffect, useState } from "react";
import { Carousel } from "flowbite";

const Information = () => {
  const [agree, setAgree] = useState(false);
  useEffect(() => {
    const carouselElement = document.getElementById("indicators-carousel");
    const carousel = new Carousel(carouselElement);
    carousel.init();
  }, []);

  const handleAgree = () => {
    localStorage.setItem("hasAgreed", "true");
    setAgree(true);
  };

  useEffect(() => {
    const checkAgreement = async () => {
      const hasAgreed = localStorage.getItem("hasAgreed");
      if (hasAgreed === "true") {
        setAgree(true);
      }
    };
    checkAgreement();
  }, []);

  return (
    <div>
      {!agree && (
        <div className="w-3/4 md:w-3/4 lg:w-1/2 h-4/5 md:h-4/5 z-[3000] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E4DCD4] rounded-xl shadow-2xl transition-all duration-300 ease-in-out">
          <div
            id="indicators-carousel"
            className="relative w-full h-full"
            data-carousel="static"
          >
            <div className="relative h-full overflow-hidden rounded-lg">
              {/* Item 1 - Welcome */}
              <div
                className="hidden duration-700 ease-in-out h-full"
                data-carousel-item="active"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-20 h-20 mb-6 text-[#C96442]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                    ></path>
                  </svg>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    번역 뷰어에 오신 것을 환영합니다!
                  </h2>
                  <p className="text-lg text-gray-600">
                    효율적인 번역 작업을 위한 몇 가지 중요한 안내사항을
                    확인해주세요.
                  </p>
                </div>
              </div>

              {/* Item 2 - Key Features */}
              <div
                className="hidden duration-700 ease-in-out h-full"
                data-carousel-item
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-20 h-20 mb-6 text-[#C96442]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    주요 기능 안내
                  </h2>
                  <div className="space-y-3 text-gray-600">
                    <p>• 실시간 번역 미리보기</p>
                    <p>• 자동 저장 기능</p>
                    <p>• 단축키를 통한 빠른 작업</p>
                    <p>• 번역 메모리 지원</p>
                  </div>
                </div>
              </div>

              {/* Item 3 - Guidelines */}
              <div
                className="hidden duration-700 ease-in-out h-full"
                data-carousel-item
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-20 h-20 mb-6 text-[#C96442]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    번역 가이드라인
                  </h2>
                  <div className="space-y-3 text-gray-600">
                    <p>• 원문의 의미를 정확하게 전달해주세요</p>
                    <p>• 자연스러운 한국어로 번역해주세요</p>
                    <p>• 전문 용어는 일관성있게 사용해주세요</p>
                    <p>• 맥락을 고려한 번역을 해주세요</p>
                  </div>
                </div>
              </div>

              {/* Item 4 - Tips */}
              <div
                className="hidden duration-700 ease-in-out h-full"
                data-carousel-item
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-20 h-20 mb-6 text-[#C96442]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    유용한 팁
                  </h2>
                  <div className="space-y-3 text-gray-600">
                    <p>• 문단을 우클릭하면 메뉴가 나타나요</p>
                    <p>• 번역하기에서는 해당 내용을 번역 할 수 있어요</p>
                    <p>
                      • 번역기록에서는 문단의 모든 번역들을 조회할 수 있어요
                    </p>
                    <p>• 번역이 막힌다면 챗봇을 이용해주세요</p>
                  </div>
                </div>
              </div>

              {/* Item 5 - Start */}
              <div
                className="hidden duration-700 ease-in-out h-full"
                data-carousel-item
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-20 h-20 mb-6 text-[#C96442]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    시작해볼까요?
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    다음 버튼을 누르면 모든 사용 약관에 동의하게 됩니다.
                  </p>
                  <button
                    onClick={handleAgree}
                    className="cursor-pointer px-6 py-3 bg-[#BC5B39] text-white rounded-lg hover:bg-[#C96442] transition-colors duration-200"
                  >
                    시작하기
                  </button>
                </div>
              </div>
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                  data-carousel-slide-to={index}
                ></button>
              ))}
            </div>

            {/* Slider controls */}
            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
