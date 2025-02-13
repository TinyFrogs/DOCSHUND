import { useNavigate } from "react-router-dom";
import RectBtn from "../components/button/rectBtn";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Edit } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlogan, setCurrentSlogan] = useState(0);

  const slogans = [
    "공식문서\n더 쉽고, 더 빠르게!",
    "공식문서를\n내 것으로 만드는 가장 쉬운 방법!",
    "개발자들이 함께 만드는\n최고의 공식문서 비공식번역",
  ];

  const testimonials = [
    {
      text: "공식문서가 부담스러웠는데,\n이제는 원문을 바로 이해할 수 있어요!",
      name: "김개발",
      role: "프론트엔드 개발자",
      company: "未 네이버",
    },
    {
      text: "번역 품질이 좋아서 학습량이 확 늘었어요.\n수정 과정도 재미있네요!",
      name: "이코딩",
      role: "백엔드 개발자",
      company: "未 카카오",
    },
  ];

  const stats = [
    { number: "100+", label: "번역중인 문서" },
    { number: "1,000+", label: "번역 참여인원" },
    { number: "5,000+", label: "번역본" },
  ];

  const faqs = [
    {
      q: "Q: Docshund는 어떤 서비스인가요?",
      a: "Docshund는 공식문서를 더 쉽게 읽고 이해할 수 있도록 돕는 서비스입니다.\n번역본과 원문을 함께 제공하며, 사용자가 직접 번역을 수정하고 피드백할 수도 있습니다.",
    },
    {
      q: "Q: 서비스 이용료는 얼마인가요?",
      a: "Docshund는 회원가입만 하면 누구나 무료로 이용할 수 있습니다.",
    },
    {
      q: "Q: 어떤 프로그래밍 언어를 지원하나요?",
      a: "Spring, Kubernetes, Android, TensorFlow 등 다양한 기술 문서를 지원하며, 점차 늘려가고 있습니다.\n문서 요청을 주시면 검토 후, 더 빠르게 업로드할 수 있으니 [헬프데스크 > 문의하기]를 이용해주시면 됩니다.",
    },
    {
      q: "Q: 번역 수정에 참여하려면 어떻게 해야 하나요?",
      a: "문서를 열람한 후, 수정하고 싶은 문단을 선택하면 '번역하기' 버튼이 나타납니다. 클릭하면 직접 번역을 수정하거나 제안할 수 있습니다.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-[#FAF9F5] overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="py-24 px-4 bg-gradient-to-b from-white to-[#FAF9F5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="mb-4 text-[#bc5b39] font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            👨‍💻 이미 많은 개발자가 DOCSHUND를 이용하고 있습니다!
          </motion.div>
          <motion.h1
            className="text-2xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#bc5b39] to-[#C96442] text-transparent bg-clip-text"
            key={currentSlogan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}
          >
            {slogans[currentSlogan]}
          </motion.h1>
          <p className="text-xl text-[#424242] mb-10 max-w-2xl mx-auto">
            전 세계 개발자의 70%가 여전히 번역기에 의존합니다.
            <br />
            이제 부담 없이 공식문서를 이해하고, 능률을 높여보세요!
          </p>
          <RectBtn
            onClick={() => navigate("/translate")}
            text="🎉 지금 바로 시작하기"
          />
        </div>
      </motion.section>

      {/* Problem Section */}
      <motion.section
        className="py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">
            개발자들이 자주 겪는 장애물
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-red-50 rounded-lg sm:p-4 sm:mb-4">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                ❌ 기존 방식
              </h3>
              <ul className="space-y-4 text-[#424242]">
                <li>• 복잡한 영어 문서를 구글 번역에 의존</li>
                <li>• 원하는 정보를 찾느라 많은 시간 낭비</li>
                <li>• 부정확한 번역 탓에 학습 중단</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 rounded-lg sm:p-4 sm:mb-4">
              <h3 className="text-xl font-bold text-green-600 mb-4">
                ✅ 새로운 방식
              </h3>
              <ul className="space-y-4 text-[#424242]">
                <li>• 원문과 번역을 나란히 보며 2배 빠른 학습</li>
                <li>• 커뮤니티의 도움으로 더욱 정확한 번역</li>
                <li>• 문서별 실시간 토론과 피드백으로 깊이 있는 이해</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Separator */}
      <div className="flex justify-center ">
        <div className="w-1/5 border-t border-gray-300"></div>
      </div>

      {/* How It Works Section*/}
      <motion.section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">
            어떻게 시작할 수 있나요?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 sm:p-12 sm:mb-12">
            {[
              {
                step: "1",
                title: "문서 선택",
                description:
                  "Spring부터 Docker, Android까지 원하는 기술 문서를 골라보세요",
                image:
                  "https://i.pinimg.com/736x/73/cc/eb/73ccebda620a66cc7e0d57edaaf92418.jpg",
              },
              {
                step: "2",
                title: "사용자 참여 번역",
                description:
                  "첫 번역의 영광을 누리세요 그리고 유저들과 함께 번역해보세요",
                image:
                  "https://i.pinimg.com/736x/55/37/40/553740a0c11fd9afb5b83be406fe7b69.jpg",
              },
              {
                step: "3",
                title: "함께 개선",
                description:
                  "문서별 실시간 토론, 번역봇, 커뮤니티와 함께 토론하며 최고의 번역을 만들어 갑니다",
                image:
                  "https://i.pinimg.com/736x/b1/ef/95/b1ef956e67434f44cdd2b8bba3438f50.jpg",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative mb-6 mx-auto">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none w-8 h-8 bg-[#bc5b39] text-white rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg shadow-lg w-full sm:w-3/4 md:w-full max-w-xs mx-auto"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#424242]">
                  {item.title}
                </h3>
                <p className="text-[#7d7c77]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 bg-[#FAF9F5]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-[#bc5b39]" />,
                title: "공식문서 번역본 보기",
                desc: "원문과 다양한 번역을 비교하며 학습하고, 최적의 번역을 선택",
              },
              {
                icon: <Edit className="w-8 h-8 text-[#bc5b39]" />,
                title: "번역 제안 & 투표 시스템",
                desc: "개발자들이 직접 번역을 제안하고 투표하여 최적의 번역을 개선",
              },
              {
                icon: <Users className="w-8 h-8 text-[#bc5b39]" />,
                title: "기술 문서 커뮤니티",
                desc: "공식문서와 연계된 Q&A, 토론 공간 제공",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[#424242]">
                  {item.title}
                </h3>
                <p className="text-[#7d7c77]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="p-6"
              >
                <h3 className="text-4xl font-bold text-[#bc5b39] mb-2">
                  {stat.number}
                </h3>
                <p className="text-[#424242]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        className="py-16 bg-[#FAF9F5]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#424242]">
            번역중인 공식 문서
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {[
              "Spring",
              "Docker",
              "Kafka",
              "Android",
              "Kubernetes",
              "TensorFlow",
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm min-w-[80px] min-h-[40px] flex items-center justify-center"
              >
                <span className="text-sm md:text-base truncate">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">
            개발자들의 이야기
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-[#FAF9F5] rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}
              >
                <p className="md:text-lg sm:text-sm mb-4 text-[#424242]">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#bc5b39] rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold text-[#424242]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#7d7c77]">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Separator */}
      <div className="flex justify-center ">
        <div className="w-1/5 border-t border-gray-300"></div>
      </div>

      {/* FAQ Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}
                className="p-6 bg-[#FAF9F5] rounded-lg"
              >
                <h3 className="text-xl font-bold mb-2 text-[#424242]">
                  {faq.q}
                </h3>
                <p className="text-[#7d7c77] sm:text-sm md:text-lg">{faq.a}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: faqs.length * 0.2 }}
              className="flex justify-center"
            >
              <RectBtn
                onClick={() => navigate("/helpDesk/faq")}
                text="FAQ 더보기 +"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 bg-[#FAF9F5]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
          <p className="mb-8 text-xl">
            원하시는 문서가 있다면 지금 바로 요청해주세요!
          </p>
          <div className="flex justify-center items-center gap-3">
            <RectBtn
              onClick={() => navigate("/translate")}
              text="🔍 번역문서 보기"
            />
            <RectBtn
              onClick={() => navigate("/helpDesk/inquiryForm")}
              text="🚀 문서 제안하기"
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
