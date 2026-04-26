"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  isDarkMode?: boolean
}

export default function Terminal({ isDarkMode = true }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Terminal is always dark
  const bgColor = "bg-black"
  const textColor = "text-green-400"

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus()
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)

      // Initial welcome message
      setHistory([
        "Last login: " + new Date().toLocaleString(),
        "Welcome to Lakshay's macOS Terminal",
        "Type 'help' to see available commands",
        "",
      ])
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener("click", handleClick)
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input)
      setCommandHistory((prev) => [...prev, input])
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    }
  }

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return

    const newIndex = historyIndex + direction

    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput("")
    } else if (newIndex >= 0) {
      setHistoryIndex(newIndex)
      setInput(commandHistory[commandHistory.length - 1 - newIndex])
    }
  }

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    const args = command.split(" ")
    const mainCommand = args[0]

    // Add command to history
    setHistory((prev) => [...prev, `lakshay@mac-portfolio ~ $ ${cmd}`, ""])

    // Process command
    switch (mainCommand) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  clear - Clear the terminal",
          "  echo [text] - Print text",
          "  date - Show current date and time",
          "  ls - List files",
          "  whoami - Show current user",
          "  about - About me",
          "  skills - My technical skills",
          "  services - Services I offer",
          "  education - My educational background",
          "  experience - My experience & roles",
          "  achievements - Awards & recognition",
          "  contact - Contact information",
          "  links - All my social/portfolio links",
          "  connect - Schedule a connect with me",
          "",
        ])
        break

      case "clear":
        setHistory([])
        break

      case "echo":
        const echoText = args.slice(1).join(" ")
        setHistory((prev) => [...prev, echoText, ""])
        break

      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""])
        break

      case "ls":
        setHistory((prev) => [
          ...prev, 
          "Documents/", 
          "Projects/", 
          "Certifications/", 
          "Internships/", 
          "Blogs/", 
          "Research/", 
          "Skills/", 
          "Achievements/", 
          ""
        ])
        break

      case "whoami":
        setHistory((prev) => [...prev, "lakshay", ""])
        break

      case "about":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                              Lakshay Dhoundiyal                             │",
          "│                    Full Stack Developer & Cyber Security Researcher         │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "With over four years of hands-on internship and freelancing experience, I have",
          "developed a strong and versatile skill set in IT, specializing in full stack",
          "development and cybersecurity.",
          "",
          "Holding degrees in Electronics and an M.Sc. in Informatics (IT) from Delhi",
          "University, I build scalable, high-performance web applications and secure systems.",
          "",
          "As a cybersecurity enthusiast and red teamer with ethical hacking training and",
          "certifications, I actively explore penetration testing. My competitive programming",
          "experience, solving 4300+ problems, enhances my problem-solving abilities.",
          "",
          "I also do technical blogging and have a growing professional network of 22k+ people.",
          "",
          "I'm passionate about building secure and user-friendly digital experiences, crafting",
          "dynamic web applications, implementing robust security protocols, and staying",
          "informed about the evolving cyber threat landscape.",
          "",
        ])
        break

      case "skills":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                               TECHNICAL SKILLS                              │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Frameworks, Libraries & SDK's",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Angular      • React/Next.js    • Vue.js",
          "  • HTML5        • CSS3             • JavaScript",
          "  • TypeScript   • Node.js          • Express.js",
          "  • Python       • Java             • Golang",
          "  • C/C++        • PHP              • SQL",
          "  • Bash         • Tailwind CSS     • Bootstrap",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Cloud, Databases & Hosting",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • XAMPP        • Apache           • Nginx",
          "  • MySQL        • MongoDB          • PostgreSQL",
          "  • Firebase     • AWS              • Azure",
          "  • Google Cloud • Jenkins          • Ansible",
          "  • Terraform    • Cloudflare       • Supabase",
          "  • Heroku       • Netlify          • Prisma",
          "  • SSL/TLS      • Docker           • Kubernetes",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Machine Learning & DevOps",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • NumPy        • Pandas           • PyTorch",
          "  • TensorFlow   • Matplotlib       • OpenCV",
          "  • Prometheus   • Grafana          • Vagrant",
          "  • CI/CD        • Git/GitHub/GitLab",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Cybersecurity & Pentesting Tools",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • NMap         • Kali Linux       • Metasploit",
          "  • Shodan       • BurpSuite        • Armitage",
          "  • Aircrack     • Wireshark        • John The Ripper",
          "  • Hydra        • Nessus           • SQLMap",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  AI Tools & Technologies",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • OpenAI API   • LangChain        • LlamaIndex",
          "  • Hugging Face • TensorFlow.js    • PyTorch",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Design & Developer Tools",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Canva        • Figma            • Arduino",
          "  • VS Code      • PyCharm          • Atom",
          "  • Postman      • Jupyter          • Linux/Unix",
          "",
        ])
        break

      case "services":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                               MY SERVICES                                   │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Web Development",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Full-stack web applications",
          "  • Responsive & modern UI/UX",
          "  • E-commerce platforms",
          "  • Portfolio & business websites",
          "  • CMS integration (WordPress, etc.)",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Software Development",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Custom software solutions",
          "  • Desktop applications",
          "  • API development & integration",
          "  • Database design & management",
          "  • System automation scripts",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Cybersecurity & Pentesting",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Vulnerability assessment",
          "  • Penetration testing",
          "  • Security audits",
          "  • Secure code review",
          "  • Security implementation",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Content Writing & Technical Blogging",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • Technical articles & tutorials",
          "  • Cybersecurity blogs",
          "  • Documentation writing",
          "  • SEO-optimized content",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Graphic Designing",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  • UI/UX design (Figma/Canva)",
          "  • Brand identity & logos",
          "  • Social media graphics",
          "  • Marketing materials",
          "",
          "Type 'connect' to discuss your project!",
          "",
        ])
        break

      case "education":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                              EDUCATION                                      │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Master's Degree",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  M.Sc. Informatics (2024 - 2026)",
          "  Institute of Informatics and Communication (IIC), UDSC, Delhi",
          "  CGPA - 8.46",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Professional Course",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Advance Certification in Information Security (2024 - 2026)",
          "  Indira Gandhi National Open University (IGNOU), Noida",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Bachelor's Degree",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  B.Sc. (Hons) Electronics (2021-2024)",
          "  ARSD College, Delhi University",
          "  CGPA - 8.32",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Diploma",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Training and Diploma in Ethical Hacking (Jan 2024 - Aug 2024)",
          "  Global Defensive Security, Bhopal | Remote",
          "  Score - 90%",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Intermediate",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  Science Stream (PCM with Eco)",
          "  Ramjas International School, R.K Puram",
          "  Score - 93%",
          "",
        ])
        break

      case "experience":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                          CO-CURRICULAR ROLES                                │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "  • Placement Coordinator at The Placement Cell, IIC, UDSC",
          "  • Vice President and Technical Head - ElectroSpark ARSD",
          "    (Society of Electronics Department)",
          "  • Team Member - Content Department of E-Cell, ARSD",
          "  • Web Developer - IT Cell, ARSD",
          "  • Student Representative - Student Faculty Committee",
          "",
          "───────────────────────────────────────────────────────────────────────────────",
          "",
          "  Total Experience: 4+ years in internships & freelancing",
          "  • Full Stack Development",
          "  • Cybersecurity & Ethical Hacking",
          "  • Technical Content Writing",
          "",
        ])
        break

      case "achievements":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                           ACHIEVEMENTS                                       │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "  🏆 India Book of Records",
          "     Maximum Virtual and Remote Internships Completed",
          "     https://indiabookofrecords.in/maximum-virtual-and-remote-internships-completed-by-an-individual-in-different-domains/",
          "",
          "  💻 Competitive Programming",
          "     4300+ problems solved",
          "     Profile: https://codolio.com/profile/LakshayD02",
          "",
          "  📱 Professional Network",
          "     22k+ connections across platforms",
          "",
          "  📝 Technical Blogging",
          "     Published articles on cybersecurity & development",
          "     Blog: https://lakshaydhoundiyal.hashnode.dev/",
          "",
        ])
        break

      case "links":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                              LINKS & SOCIALS                                │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "  🌐 Website:      https://lakshaydhoundiyal.cloud/",
          "  📧 Email:        lakshaydhoundiyal0@gmail.com",
          "  💼 LinkedIn:     https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259",
          "  🐙 GitHub:       https://github.com/LakshayD02",
          "  📝 Blogs:        https://lakshaydhoundiyal.hashnode.dev/",
          "  🔗 Beacons:      https://beacons.ai/lakshaydhoundiyal/home",
          "  🏆 Award:   https://indiabookofrecords.in/maximum-virtual-and-remote-internships-completed-by-an-individual-in-different-domains/",
          "  💻 Coding:       https://codolio.com/profile/LakshayD02",
          "  🤝 Connect:      topmate.io/lakshay_dhoundiyal",
          "",
        ])
        break

      case "connect":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                           LET'S CONNECT                                     │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "  📅 Schedule a 1:1 session with me:",
          "     https://topmate.io/lakshay_dhoundiyal",
          "",
          "  💬 For collaborations, freelance projects, or mentorship:",
          "     Email: lakshaydhoundiyal0@gmail.com",
          "",
          "  🔗 Follow me on LinkedIn for tech insights & opportunities:",
          "     https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259",
          "",
          "  Let's build something amazing together! 🚀",
          "",
        ])
        break

      case "contact":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────────────────────────────────────┐",
          "│                              CONTACT INFO                                   │",
          "└─────────────────────────────────────────────────────────────────────────────┘",
          "",
          "  📧 Email:        lakshaydhoundiyal0@gmail.com",
          "  🌐 Website:      https://lakshaydhoundiyal.cloud/",
          "  💼 LinkedIn:     https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259",
          "  🐙 GitHub:       https://github.com/LakshayD02",
          "  📝 Hashnode:     https://lakshaydhoundiyal.hashnode.dev/",
          "  🔗 Beacons:      https://beacons.ai/lakshaydhoundiyal/home",
          "  🤝 Topmate:      topmate.io/lakshay_dhoundiyal",
          "",
          "  Type 'links' to see all links",
          "  Type 'connect' to schedule a meeting",
          "",
        ])
        break

      default:
        setHistory((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          'Type "help" to see available commands',
          "",
        ])
    }
  }

  return (
    <div ref={terminalRef} className={`h-full ${bgColor} ${textColor} p-4 font-mono text-sm overflow-auto`}>
      {history.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      <div className="flex">
        <span className="mr-2">lakshay@mac-portfolio ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-green-400 text-green-400"
          autoFocus
        />
      </div>
    </div>
  )
}