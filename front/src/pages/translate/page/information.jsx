import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const Information = () => {
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("hasAgreed");
    if (hasAgreed === "true") {
      setAgree(true);
    } else {
      setAgree(false);
    }
  }, []);

  const handleAgree = () => {
    if (!localStorage.getItem("hasAgreed")) {
      setAgree(true);
      localStorage.setItem("hasAgreed", "true");
    }
  };

  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log("튜토리얼 완료됨!");
      handleAgree();
      setRun(false); // Joyride 종료
    }
  };

  const steps = [
    {
      target: "#navbar",
      content:
        "여기를 누르면 사이드바가 열립니다. 사이드바에서는 문서 목록, 알림, 메모를 조회할 수 있습니다.",
    },
    {
      target: "#paragraph",
      content:
        "각 문단을 클릭하면 베스트 번역본의 내용을 볼 수 있고, 우클릭하면 번역을 작성하거나 기록을 볼 수 있습니다.",
    },
    {
      target: "#toggleTranslate",
      content: "이 버튼을 통해 전체 번역 내용을 볼 수 있습니다.",
    },
    {
      target: "#chatbot",
      content: "챗봇 버튼을 통해 번역봇과 대화할 수 있습니다.",
    },
    {
      target: "#chat",
      content: "채팅 버튼을 통해 다른 사용자들과 대화할 수 있습니다.",
    },
  ];

  return (
    <div>
      {!agree && (
        <div className="fixed inset-0 flex items-center justify-center z-[3000] bg-transparent border-box w-full h-full">
          {/* Joyride를 상단에서 렌더링하여 UI 위에 나타나도록 변경 */}
          <Joyride
            steps={steps}
            continuous={true}
            showProgress={true}
            run={true}
            callback={handleJoyrideCallback} // 스텝 완료 이벤트 감지
            styles={{
              options: {
                zIndex: 20000,
                overlayColor: "transparent",
              },
              overlay: {
                backgroundColor: "transparent",
                mixBlendMode: "unset",
              },
              spotlight: {
                backgroundColor: "transparent", // Spotlight(초점 강조) 투명하게 설정
                boxShadow: "none", // 기본 그림자 효과 제거
              },
            }}
          />

          {/* 가이드 대상이 되는 요소들 */}
          <div
            id="navbar"
            className="fixed top-30 left-5 w-8 h-8 bg-transparent"
          ></div>
          <div id="paragraph" className="fixed top-35 left-250"></div>
          <div id="toggleTranslate" className="fixed bottom-32 right-16"></div>
          <div id="chatbot" className="fixed bottom-16 right-16"></div>
          <div
            id="chat"
            className="fixed bottom-8 right-16"
            onClick={handleAgree}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Information;
