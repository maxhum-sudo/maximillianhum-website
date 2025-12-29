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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
        Projects
      </h1>
      {projects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No projects yet. Add your projects to{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            content/projects.json
          </code>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

