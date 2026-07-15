import ProjectCard, { Project } from '@/components/ProjectCard';
import fs from 'fs';
import path from 'path';

function getProjects(): Project[] {
  const filePath = path.join(process.cwd(), 'content/projects.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="projects-field">
      <div className="projects-field-inner">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-lede">
          A scrapbook of things I&apos;ve built — tap a polaroid to open it.
        </p>
        {projects.length === 0 ? (
          <p className="text-[#5d574b]">
            No projects yet. Add your projects to{' '}
            <code className="bg-white/70 px-2 py-1 rounded text-sm">
              content/projects.json
            </code>
          </p>
        ) : (
          <div className="polaroid-grid">
            {[...projects].reverse().map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
