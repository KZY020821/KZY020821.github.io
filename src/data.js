export const portfolioData = {
  hero: {
    title: "Khor Ze Yi",
    subtitle: "Software Engineer specializing in scalable web experiences and AI integration.",
    cta: "View My Work"
  },
  skills: [
    { name: "JavaScript", icon: "/src/assets/javascript.svg", color: "#F7DF1E" },
    { name: "TypeScript", icon: "/src/assets/typescript.svg", color: "#3178C6" },
    { name: "React / Next.js", icon: "/src/assets/react.svg", color: "#61DAFB" },
    { name: "Python", icon: "/src/assets/python.svg", color: "#3776AB" },
    { name: "Redis", icon: "/src/assets/redis.svg", color: "#DC382D" },
    { name: "TanStack Query", icon: "/src/assets/tanstack.svg", color: "#FF4154" }
  ],
  experience: [
    {
      role: "Software Engineer",
      company: "MessengerCo",
      period: "Sept 2024 - Current",
      description: "Led AI chatbot & eCommerce revamp using Next.js and Laravel. Implemented TanStack Query, Redux, and Redis for performance. Developed CRM system managing 3,000+ SKUs."
    },
    {
      role: "BSc (Hons) Multimedia Computing",
      company: "Liverpool John Moore University",
      period: "Sept 2021 - Sept 2024",
      description: "Graduated with CGPA 3.8/4.0. Strong foundation in software engineering, agile processes, and multimedia technologies."
    }
  ],
  projects: [
    {
      title: "Face Recognition Attendance System",
      description: "95% accuracy attendance system with liveness detection. Built with Python, Django, TensorFlow, and OpenCV.",
      tech: ["Python", "Django", "TensorFlow", "OpenCV"]
    },
    {
      title: "AI Chatbot & eCommerce Platform",
      description: "Complete platform revamp for MessengerCo, enhancing user engagement and sales measurement.",
      tech: ["Next.js", "Laravel", "Redis", "Redux"]
    },
    {
      title: "CRM System",
      description: "Comprehensive CRM managing full sales cycles, 3,000+ SKUs and generating 8,000+ sales.",
      tech: ["React", "Agile", "SQL"]
    }
  ],
  contact: {
    email: "khorzeyi02@gmail.com",
    github: "github.com/KZY020821",
    linkedin: "media.linkedin.com/in/khorzeyi"
  }
};
