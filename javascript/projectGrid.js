import { createProjectCard } from './projectCard.js';

// This script dynamically generates project cards for a portfolio page
async function fetchProjects() {
  const res = await fetch('./media/projects.json');
  const data = await res.json();
  return data;
}


export async function renderAllProjects() {
  const projects = await fetchProjects();

  projects.forEach(project => {
    const sectionId = `${project.category}Grid`;
    const container = document.getElementById(sectionId);
    if (container) {
      const card = createProjectCard(project);
      container.appendChild(card);
    }
  });
}

