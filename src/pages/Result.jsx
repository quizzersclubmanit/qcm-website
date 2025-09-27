import { useParams, Link } from "react-router-dom";
import { Container, Button } from "../components/components";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";

const Result = () => {
  const { msg } = useParams();

  return (
    <Container
      className="min-h-screen flex flex-col items-center justify-center gap-8 py-16 px-4"
      style={{
        background: 'url("/image-quiz-bg.png") no-repeat center center/cover',
      }}
    >

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-3xl rounded-2xl shadow-xl flex flex-col items-center gap-6 p-8 text-center min-h-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px) saturate(120%)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <h1
          className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#FCA311] poppins-bold text-center px-4 leading-tight break-words whitespace-normal"
          style={{
            overflowWrap: "anywhere", 
            wordBreak: "break-word",
            hyphens: "auto",
            overflow: "visible",
            maxWidth: "100%",
          }}
          aria-live="polite"
        >
          {msg}
        </h1>

        <div className="text-white/80 text-base md:text-lg flex flex-col gap-2">
          <p>Results will be announced via your school.</p>
          <p>Next round will be hosted in your city — we’ll update you soon.</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-white/90 text-lg">Stay connected with us:</p>
          <div className="flex gap-6 text-white text-3xl">
            <a
              href="https://whatsapp.com/channel/0029Vaj1E2e7DAWvNkgDhy2O"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FCA311] transition-colors"
              aria-label="WhatsApp Channel"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com/quizzersclub/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FCA311] transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/quizzersclub/posts/?feedView=all"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FCA311] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        <Link to="/">
          <Button className="mt-4 px-6 py-2 rounded-lg shadow-lg text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform transition-all">
            Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Result;
