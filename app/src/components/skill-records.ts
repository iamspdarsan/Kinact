import {
	BiLogoDjango,
	BiLogoFlask,
	BiLogoGraphql,
	BiLogoJquery,
	BiLogoMongodb,
	BiLogoPython,
	BiLogoSass,
	BiLogoTypescript,
} from "react-icons/bi";
import { CiPenpot } from "react-icons/ci";
import { DiDart } from "react-icons/di";
import { FaGulp, FaLinux, FaNode } from "react-icons/fa";
import { FaAws, FaFreebsd, FaGitAlt, FaJenkins } from "react-icons/fa6";
import { GiDolphin, GiEyeTarget } from "react-icons/gi";
import {
	IoLogoCss3,
	IoLogoElectron,
	IoLogoGithub,
	IoLogoHtml5,
	IoTerminal,
} from "react-icons/io5";
import { MdScatterPlot } from "react-icons/md";
import {
	RiFirebaseFill,
	RiFlutterFill,
	RiJavaFill,
	RiJavascriptFill,
	RiNextjsFill,
	RiReactjsFill,
	RiTailwindCssFill,
	RiWindowsFill,
} from "react-icons/ri";
import {
	SiAdobeillustrator,
	SiAdobephotoshop,
	SiArduino,
	SiBurpsuite,
	SiCplusplus,
	SiExpress,
	SiFoodpanda,
	SiGooglecloud,
	SiGooglesearchconsole,
	SiJest,
	SiKeystone,
	SiNextra,
	SiNumpy,
	SiPassport,
	SiPhp,
	SiPuppeteer,
	SiSelenium,
	SiSocketdotio,
	SiWebassembly,
	SiWebpack,
	SiWindowsterminal,
	SiWireshark,
} from "react-icons/si";
import Office from "../icons/office";

const skills: { text: string; icon: any }[] = [
	{ text: "TypeScript", icon: BiLogoTypescript },
	{ text: "JavaScript", icon: RiJavascriptFill },
	{ text: "Python", icon: BiLogoPython },
	{ text: "Flutter", icon: RiFlutterFill },
	{ text: "Dart", icon: DiDart },
	{ text: "Node", icon: FaNode },
	{ text: "React", icon: RiReactjsFill },

	{ text: "Next JS", icon: RiNextjsFill },
	{ text: "Mongo DB", icon: BiLogoMongodb },
	{ text: "Socket.io", icon: SiSocketdotio },
	{ text: "Electron JS", icon: IoLogoElectron },
	{ text: "PHP", icon: SiPhp },

	{ text: "WebPack", icon: SiWebpack },
	{ text: "Gulp", icon: FaGulp },
	{ text: "Github & CI", icon: IoLogoGithub },
	{ text: "Git", icon: FaGitAlt },
	{ text: "HTML", icon: IoLogoHtml5 },

	{ text: "CSS", icon: IoLogoCss3 },
	{ text: "Tailwind CSS", icon: RiTailwindCssFill },
	{ text: "SCSS", icon: BiLogoSass },
	{ text: "Java", icon: RiJavaFill },
	{ text: "C & C++", icon: SiCplusplus },
	{ text: "Web Assembly", icon: SiWebassembly },
	{ text: "My SQL", icon: GiDolphin },
	{ text: "Linux", icon: FaLinux },

	{ text: "Windows", icon: RiWindowsFill },
	{ text: "Free BSD", icon: FaFreebsd },
	{ text: "GraphQL", icon: BiLogoGraphql },
	{ text: "Firebase", icon: RiFirebaseFill },
	{ text: "Jquery", icon: BiLogoJquery },
	{ text: "Pandas", icon: SiFoodpanda },
	{ text: "Numpy", icon: SiNumpy },
	{ text: "Django", icon: BiLogoDjango },

	{ text: "Flask", icon: BiLogoFlask },
	{ text: "Express JS", icon: SiExpress },
	{ text: "Keystone JS", icon: SiKeystone },
	{ text: "Passport JS", icon: SiPassport },
	{ text: "MatPlotlib", icon: MdScatterPlot },
	{ text: "Bash", icon: IoTerminal },
	{ text: "CMD", icon: SiWindowsterminal },
	{ text: "Photoshop", icon: SiAdobephotoshop },
	{ text: "Illustrator", icon: SiAdobeillustrator },
	{ text: "Penpot", icon: CiPenpot },
	{ text: "MS Office", icon: Office },
	{ text: "SEO", icon: SiGooglesearchconsole },
	{ text: "Puppeteer", icon: SiPuppeteer },
	{ text: "Jest", icon: SiJest },
	{ text: "Selenium", icon: SiSelenium },
	{ text: "Jenkins", icon: FaJenkins },
	{ text: "Nextra", icon: SiNextra },
	{ text: "AWS", icon: FaAws },
	{ text: "Google Cloud", icon: SiGooglecloud },
	{ text: "Wireshark", icon: SiWireshark },
	{ text: "Burp Suite", icon: SiBurpsuite },
	{ text: "Nmap", icon: GiEyeTarget },
	{ text: "Arduino", icon: SiArduino },
];

export default skills;
