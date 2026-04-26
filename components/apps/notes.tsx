"use client"

import type React from "react"

import { useState } from "react"

interface NotesProps {
  isDarkMode?: boolean
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "About Me",
      content: `# Lakshay Dhoundiyal

## Full Stack Developer & Cyber Security Researcher

### Professional Summary
With over four years of hands-on internship and freelancing experience, I have developed a strong and versatile skill set in IT, specializing in full stack development and cybersecurity. I build scalable, high-performance web applications and secure systems with a strong commitment to user-friendly digital experiences.

### Education

Master's Degree
M.Sc. Informatics (2024 - 2026)
Institute of Informatics and Communication (IIC), UDSC, Delhi
CGPA - 8.46

Professional Course
Advance Certification in Information Security (2024 - 2026)
Indira Gandhi National Open University (IGNOU), Noida

Bachelor's Degree
B.Sc. (Hons) Electronics (2021-2024)
ARSD College, Delhi University
CGPA - 8.32

Diploma
Training and Diploma in Ethical Hacking (Jan 2024 - Aug 2024)
Global Defensive Security, Bhopal | Remote
Score - 90%

Intermediate
Science Stream (PCM with Eco)
Ramjas International School, R.K Puram
Score - 93%

### Co-Curricular Roles
- Placement Coordinator at The Placement Cell, IIC, UDSC
- Vice President and Technical Head - ElectroSpark ARSD (Society of Electronics Department)
- Team Member - Content Department of E-Cell, ARSD
- Web Developer - IT Cell, ARSD
- Student Representative - Student Faculty Committee

### Connect With Me
- Website: https://lakshaydhoundiyal.cloud/
- LinkedIn: https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259
- GitHub: https://github.com/LakshayD02
- Blogs: https://lakshaydhoundiyal.hashnode.dev/
- Email: lakshaydhoundiyal0@gmail.com`,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      title: "Technical Skills",
      content: `# Technical Skills

## Frameworks, Libraries & SDKs
- Angular, React/Next.js, Vue.js
- HTML5, CSS3, JavaScript, TypeScript
- Node.js, Express.js
- Python, Java, Golang, C/C++
- PHP, SQL, Bash
- Tailwind CSS, Bootstrap

## Cloud, Databases & Hosting
- XAMPP, Apache, Nginx
- MySQL, MongoDB, PostgreSQL
- Firebase, AWS, Azure, Google Cloud
- Jenkins, Ansible, Terraform
- Cloudflare, Supabase, Heroku, Netlify, Prisma
- SSL/TLS, Docker, Kubernetes

## Machine Learning & DevOps
- NumPy, Pandas, PyTorch, TensorFlow
- Matplotlib, OpenCV
- Prometheus, Grafana, Vagrant
- CI/CD, Git/GitHub/GitLab

## Cybersecurity & Pentesting Tools
- NMap, Kali Linux, Metasploit, Shodan
- BurpSuite, Armitage, Aircrack
- Wireshark, John The Ripper, Hydra
- Nessus, SQLMap

## AI Tools & Technologies
- OpenAI API, LangChain, LlamaIndex
- Hugging Face, TensorFlow.js, PyTorch

## Design & Developer Tools
- Canva, Figma, Arduino
- VS Code, PyCharm, Atom
- Postman, Jupyter, Linux/Unix`,
      date: "Yesterday, 3:15 PM",
    },
    {
      id: 3,
      title: "Achievements",
      content: `# Achievements & Recognition

## India Book of Records
Maximum Virtual and Remote Internships Completed by an Individual in Different Domains
https://indiabookofrecords.in/maximum-virtual-and-remote-internships-completed-by-an-individual-in-different-domains/

## Professional Network
- 22k+ connections across professional platforms
- Active engagement in tech communities

## Technical Blogging
- Published articles on cybersecurity & web development
- Blog: https://lakshaydhoundiyal.hashnode.dev/

## Certifications
- Training and Diploma in Ethical Hacking (90% score)
- Advance Certification in Information Security (ongoing)

## Academic Excellence
- M.Sc. Informatics: 8.46 CGPA
- B.Sc. Electronics (Hons): 8.32 CGPA
- Intermediate: 93% (PCM with Economics)`,
      date: "Yesterday, 11:00 AM",
    },
    {
      id: 4,
      title: "Services I Offer",
      content: `# My Services

## Web Development
- Full-stack web applications
- Responsive & modern UI/UX design
- E-commerce platforms
- Portfolio & business websites
- CMS integration (WordPress, etc.)

## Software Development
- Custom software solutions
- Desktop applications
- API development & integration
- Database design & management
- System automation scripts

## Cybersecurity & Pentesting
- Vulnerability assessment
- Penetration testing
- Security audits
- Secure code review
- Security implementation

## Content Writing & Technical Blogging
- Technical articles & tutorials
- Cybersecurity blogs
- Documentation writing
- SEO-optimized content

## Graphic Designing
- UI/UX design (Figma/Canva)
- Brand identity & logos
- Social media graphics
- Marketing materials

## Schedule a Consultation
Book a 1:1 session: https://topmate.io/lakshay_dhoundiyal`,
      date: "Today, 9:00 AM",
    },
    {
      id: 5,
      title: "Learning Goals",
      content: `# Learning Goals & Roadmap

## Short-term Goals (0-6 months)
- Deepen expertise in advanced React patterns and Next.js
- Complete OSCP certification
- Contribute to 5+ open-source projects
- Build a comprehensive portfolio of security tools

## Long-term Goals (6-12 months)
- Master cloud security (AWS Certified Security)
- Develop a full-stack SaaS product
- Build a community of 50k+ tech enthusiasts
- Launch a cybersecurity awareness campaign

## Technical Skills to Master

### Advanced Cybersecurity
- Red Teaming advanced techniques
- Cloud security architecture
- Malware analysis
- Digital forensics

### Emerging Technologies
- Web3 & Blockchain security
- AI/ML security applications
- Quantum computing basics
- Edge computing

### Soft Skills Development
- Technical leadership
- Public speaking
- Technical writing
- Project management

## Resources & Learning Path
- PortSwigger Web Security Academy
- TryHackMe & HackTheBox
- OWASP Top 10 mastery
- Cloud native security frameworks

## Community Involvement
- Start a cybersecurity meetup group
- Mentor junior developers
- Create video tutorials
- Speak at tech conferences`,
      date: "Dec 15, 2024",
    },
    {
      id: 6,
      title: "Quick Links",
      content: `# Important Links

## Portfolio & Socials

Main Portfolio
https://lakshaydhoundiyal.cloud/

LinkedIn (22k+ network)
https://www.linkedin.com/in/lakshay-dhoundiyal-531b25259

GitHub
https://github.com/LakshayD02

Technical Blog (Hashnode)
https://lakshaydhoundiyal.hashnode.dev/

Beacons Page
https://beacons.ai/lakshaydhoundiyal/home

## Recognition

India Book of Records
https://indiabookofrecords.in/maximum-virtual-and-remote-internships-completed-by-an-individual-in-different-domains/

## Connect With Me

Topmate (1:1 Sessions)
https://topmate.io/lakshay_dhoundiyal

Email
lakshaydhoundiyal0@gmail.com

All links open in new tabs. Feel free to connect!`,
      date: "Dec 8, 2024",
    },
  ])

  const [selectedNoteId, setSelectedNoteId] = useState(1)
  const [editableContent, setEditableContent] = useState("")

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditableContent(note.content)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value)

    setNotes(
      notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: e.target.value }
        }
        return note
      }),
    )
  }

  const renderContent = (content: string) => {
    const lines = content.split("\n")
    const renderedLines: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    lines.forEach((line, idx) => {
      if (line.startsWith("# ")) {
        if (inList) {
          renderedLines.push(<ul key={`list-${idx}`} className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
          listItems = []
          inList = false
        }
        renderedLines.push(<h1 key={idx} className="text-2xl font-bold mb-3 mt-4 first:mt-0">{line.slice(2)}</h1>)
      }
      else if (line.startsWith("## ")) {
        if (inList) {
          renderedLines.push(<ul key={`list-${idx}`} className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
          listItems = []
          inList = false
        }
        renderedLines.push(<h2 key={idx} className="text-xl font-semibold mb-2 mt-3">{line.slice(3)}</h2>)
      }
      else if (line.startsWith("### ")) {
        if (inList) {
          renderedLines.push(<ul key={`list-${idx}`} className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
          listItems = []
          inList = false
        }
        renderedLines.push(<h3 key={idx} className="text-lg font-medium mb-2 mt-2">{line.slice(4)}</h3>)
      }
      else if (line.startsWith("- ") || line.startsWith("• ")) {
        inList = true
        const cleanText = line.slice(2)
        const urlMatch = cleanText.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
          const parts = cleanText.split(/(https?:\/\/[^\s]+)/)
          listItems.push(
            <li key={`list-${idx}`} className="mb-1">
              {parts.map((part, i) => 
                part.match(/https?:\/\/[^\s]+/) ? (
                  <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
            </li>
          )
        } else {
          listItems.push(<li key={`list-${idx}`} className="mb-1">{cleanText}</li>)
        }
      }
      else if (line.trim() !== "") {
        if (inList) {
          renderedLines.push(<ul key={`list-${idx}`} className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
          listItems = []
          inList = false
        }
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = line.split(urlRegex)
        renderedLines.push(
          <p key={idx} className="mb-2">
            {parts.map((part, i) => 
              part.match(urlRegex) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {part}
                </a>
              ) : (
                part
              )
            )}
          </p>
        )
      }
      else {
        if (inList) {
          renderedLines.push(<ul key={`list-${idx}`} className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
          listItems = []
          inList = false
        }
        renderedLines.push(<div key={idx} className="h-2"></div>)
      }
    })

    if (inList) {
      renderedLines.push(<ul className="list-disc ml-5 mb-2 space-y-1">{listItems}</ul>)
    }

    return renderedLines
  }

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300"

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      <div className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className="p-3 border-b ${borderColor} flex justify-between items-center">
          <h2 className="font-medium">Notes</h2>
          <button className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 cursor-pointer border-b ${borderColor} ${selectedNoteId === note.id ? selectedBg : hoverBg} transition-colors`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "").replace(/^[^\s]+\s/, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div className={`p-3 border-b ${borderColor}`}>
              <h2 className="font-medium">{selectedNote.title}</h2>
              <p className="text-xs text-gray-500">{selectedNote.date}</p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="prose prose-invert max-w-none">
                {renderContent(selectedNote.content)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}