// This script dynamically generates project cards for a portfolio page
async function fetchProjects() {
  const res = await fetch('./projects.json');
  const data = await res.json();
  return data;
}

const durationSVG = `<svg viewBox="0 0 16 16" width="16" height="16" fill="#ccc">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7 3V8.41421L10.2929 11.7071L11.7071 10.2929L9 7.58579V3H7Z"/>
</svg>
`;
const peopleSVG = `<svg viewBox="0 0 16 16" width="16" height="16" fill="#ccc">
  <path d="M8 3.5C8 4.88071 6.88071 6 5.5 6C4.11929 6 3 4.88071 3 3.5C3 2.11929 4.11929 1 5.5 1C6.88071 1 8 2.11929 8 3.5Z"/>
  <path d="M3 8C1.34315 8 0 9.34315 0 11V15H8V8H3Z"/>
  <path d="M13 8H10V15H16V11C16 9.34315 14.6569 8 13 8Z"/>
  <path d="M12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6Z"/>
</svg>
`;
const techSVG = `<svg viewBox="0 0 16 16" width="16" height="16" fill="#ccc"><path d="M10 3.5L13.0581 0.441881C12.4304 0.15802 11.7337 0 11 0C8.23858 0 6 2.23858 6 5C6 5.45802 6.06158 5.90165 6.17692 6.32308L0 12.5L3.5 16L9.67692 9.82308C10.0983 9.93842 10.542 10 11 10C13.7614 10 16 7.76142 16 5C16 4.26633 15.842 3.56956 15.5581 2.94188L12.5 6H10V3.5Z"/></svg>`;

function createProjectCard(project) {
  const link = document.createElement('a');
  link.href = 'javascript:void(0)';
  link.className = "project-card";
  link.style.textDecoration = "none";

  const imageDiv = document.createElement('div');
  imageDiv.className = 'project-media';

  if (project.video) {
    const video = document.createElement('video');
    video.src = project.video;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    imageDiv.appendChild(video);
  } else if (project.image) {
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = `${project.title} Preview`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    imageDiv.appendChild(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'project-overlay';
  overlay.innerHTML = `
  <p class="project-meta">
    ${durationSVG} <span>${project.duration}</span> 
    <span class="sep">|</span> 
    ${peopleSVG} <span>${project.people}</span> 
    <span class="sep">|</span> 
    ${techSVG} <span>${project.technologies}</span>
  </p>
`;
  imageDiv.appendChild(overlay);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'project-description';
  descriptionDiv.innerHTML = `
  <h3 class="project-title">${project.title}</h3>
  <p class="project-text">${project.description}</p>
`;

  link.appendChild(imageDiv);
  link.appendChild(descriptionDiv);

  link.addEventListener('click', (e) => {
    e.preventDefault();
    openProjectModal(project);
  });


  return link;
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


function openProjectModal(project) {
  const modal = document.getElementById('project-modal');
  document.getElementById('modal-title').textContent = project.title;
  
  // Modal info nested inside project.modal
  const modalInfo = project.modal || {};

  document.getElementById('modal-detailed-description').textContent = modalInfo.detailedDescription || '';

  const videoContainer = document.getElementById('modal-video-container');
  videoContainer.innerHTML = ''; // clear previous content

  if (modalInfo.youtube) {
    const iframe = document.createElement('iframe');
    iframe.src = modalInfo.youtube;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);
  } else if (project.video) {
    const video = document.createElement('video');
    video.src = project.video;
    video.controls = true;
    videoContainer.appendChild(video);
  }

  // Clear old extra links container if you add one
  const extraLinksContainer = document.getElementById('modal-extra-links');
  extraLinksContainer.innerHTML = '';
  if (modalInfo.extraLinks) {
    modalInfo.extraLinks.forEach(linkObj => {
      const a = document.createElement('a');
      a.href = linkObj.url;
      a.textContent = linkObj.label;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = 'modal-extra-link';
      extraLinksContainer.appendChild(a);
    });
  }

  // Main link shown separately if exists
  const mainLink = document.getElementById('modal-link');
  if (project.link) {
    mainLink.href = project.link;
    mainLink.style.display = 'inline-block';
  } else {
    mainLink.style.display = 'none';
  }

  modal.style.display = 'flex';
}
