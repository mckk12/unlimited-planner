import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const githubUrl = "https://github.com/mckk12/unlimited-planner";

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800">
      <div className="px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <p className="text-sm text-slate-400">
            © {currentYear} Unlimited Planner. All rights reserved.
          </p>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-700/70 hover:bg-slate-700/70 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors text-slate-200"
            aria-label="GitHub repository"
          >
            <FontAwesomeIcon icon={faGithub} className="w-5 h-5 cursor-pointer" />
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
