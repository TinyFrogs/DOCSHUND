import { Link } from "react-router-dom";

const Footer = () => {
  let footerChild = "text-[#f8f8f7] text-left text-[14px] font-semibold";
  return (
    <div className="box-border bg-black px-[120px] py-[90px] flex flex-col gap-[10px] items-center justify-center h-[190px] relative">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-[47px] items-center justify-center shrink-0 relative">
        <div className="bg-white border-b border-white opacity-[0.6] self-stretch relative"></div>
        <div className="flex flex-row items-center justify-center self-stretch shrink-0 relative">
          <div className="flex flex-row gap-[36px] items-start justify-start shrink-0 relative">
            <Link to="/terms" className={footerChild}>
              이용약관
            </Link>
            <Link to="/privacy" className={footerChild}>
              개인정보처리방침
            </Link>
            <Link to="/helpDesk/notices" className={footerChild}>
              공지사항
            </Link>
            <Link to="/helpDesk/faq" className={footerChild}>
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
