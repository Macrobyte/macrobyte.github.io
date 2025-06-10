export function openProjectModal(project) {
    
    const modal = document.getElementById('project-modal');
    const modalInfo = project.modal || {};

    // Set title and description
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-detailed-description').innerHTML = marked.parse(modalInfo.detailedDescription || '');

    // Clear media containers
    const videoContainer = document.getElementById('modal-video-container');
    videoContainer.innerHTML = '';

    const slideshowWrapper = document.querySelector('.modal-slideshow-wrapper');
    const slideshowContainer = document.getElementById('modal-slideshow');
    slideshowContainer.innerHTML = '';
    slideshowWrapper.style.display = 'none';

    // Show either slideshow or video
    if (modalInfo.slideshow && modalInfo.slideshow.length > 0) {
        // Show slideshow
        slideshowWrapper.style.display = 'block';
        modalInfo.slideshow.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = project.title + ' screenshot';
            slideshowContainer.appendChild(img);
        });
    } else if (modalInfo.youtube) {
        // Show YouTube iframe
        const iframe = document.createElement('iframe');
        iframe.src = getEmbedFromYoutubeUrl(modalInfo.youtube);
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videoContainer.appendChild(iframe);
    } else if (project.video) {
        // Show video element
        const video = document.createElement('video');
        video.src = project.video;
        video.controls = true;
        videoContainer.appendChild(video);
    }

    // Set meta info
    document.getElementById('modal-duration').textContent = project.duration ? `Duration: ${project.duration}` : '';
    document.getElementById('modal-team-size').textContent = project.people ? `Team size: ${project.people}` : '';

    // Technologies
    const techContainer = document.getElementById('modal-technologies');
    techContainer.innerHTML = '';
    if (project.technologies) {
        project.technologies.split(',').forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech.trim();
            techContainer.appendChild(span);
        });
    }

    // Main link button
    const mainLink = document.getElementById('modal-link');
    if (project.link) {
        mainLink.href = project.link;
        mainLink.style.display = 'inline-block';
    } else {
        mainLink.style.display = 'none';
    }

    // Extra links
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

    modal.style.display = 'flex';
    disableScroll();
}

// Close modal when clicking the close button
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('project-modal').style.display = 'none';
    enableScroll();
    
});

// Close modal when clicking outside modal-content (on overlay)
document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.style.display = 'none';
        enableScroll();
    }
});

// Slideshow scroll buttons
document.getElementById('slideshow-left-arrow').addEventListener('click', () => {
    scrollSlideshow(-1);
});

document.getElementById('slideshow-right-arrow').addEventListener('click', () => {
    scrollSlideshow(1);
});

// Scroll slideshow by clicking arrows
function scrollSlideshow(direction) {
    const slideshow = document.getElementById('modal-slideshow');
    const img = slideshow.querySelector('img');
    if (!img) return;

    const imgWidth = img.getBoundingClientRect().width;

    const style = window.getComputedStyle(slideshow);
    const gap = parseFloat(style.gap) || 0;

    const scrollAmount = imgWidth + gap;

    slideshow.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
    });
}

function getEmbedFromYoutubeUrl(url) {
    const videoIdMatch = url.match(/[?&]v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    if (url.includes('youtube.com/embed')) {
        return url.includes('?') ? url + '&rel=0' : url + '?rel=0';
    }
    return url;
}

//#region Scroll Lock/Unlock // TODO - Move somewhere else
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
//#endregion