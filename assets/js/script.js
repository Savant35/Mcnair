/*=================== Show Menu and Hide Menu when button is clicked ===============*/

  const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navMenu = document.getElementById("nav-menu");

if (navToggle){
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  })
}

if (navClose){
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  })
}

/*====================== Hide Menu Mobile when link is clicked ==========*/
  const nav = document.querySelectorAll('.nav__link');
const action = () => {
  navMenu.classList.remove('show-menu');
}
nav.forEach(n => n.addEventListener('click', action));


/*======================= side bar ====================================*/
  const sidebarToggle = document.getElementById("sidebar-open");
const sidebar       = document.getElementById("student-sidebar");

// Toggle the sidebar open/close and update the arrow
if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("show-sidebar"); // Toggle the class

    // Flip the arrow direction
    if (isOpen) {
      sidebarToggle.classList.add("flipped"); // Add a class for flipped icon
    } else {
      sidebarToggle.classList.remove("flipped");
    }
  });
}
document.addEventListener('click', (event) => {
  // 1) Check if the sidebar is currently open
if (sidebar.classList.contains('show-sidebar')) {

  // 2) Check if the user clicked inside the sidebar OR on the toggle
const clickedInsideSidebar = sidebar.contains(event.target);
const clickedToggleButton = sidebarToggle.contains(event.target);

// 3) If they did NOT click inside or on the toggle, close the sidebar
if (!clickedInsideSidebar && !clickedToggleButton) {
  sidebar.classList.remove('show-sidebar');
}
}
});

/*
/*=============== SCROLL SECTIONS ACTIVE LINK ===============
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute('id');
    const linkSelector = `.nav__menu a[href*="${sectionId}"]`;
    const sectionLink = document.querySelector(linkSelector);

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionLink?.classList.add('active-link');
    } else {
      sectionLink?.classList.remove('active-link');
    }
  });
};
*/

// ====================== Globe ================================

  // Select the container
const container = document.getElementById('globe-container');

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 2.5; // Move the camera away from the origin along z-axis

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Add ambient light for basic illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Add directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Load external images as textures
const textureLoader = new THREE.TextureLoader();

// Array of image URLs    
const imageUrls = [
  'assets/img/brain.webp',
  'https://picsum.photos/id/1011/512/512',
  'https://picsum.photos/id/1012/512/512',
  'https://picsum.photos/id/1015/512/512',
  'https://picsum.photos/id/1016/512/512',
  'https://picsum.photos/id/1018/512/512',
  'https://picsum.photos/id/1020/512/512',
  'https://picsum.photos/id/1024/512/512',
  'https://picsum.photos/id/1025/512/512',
  'https://picsum.photos/id/1027/512/512',
  'https://picsum.photos/id/1033/512/512',
  'https://picsum.photos/id/1035/512/512',
  'https://picsum.photos/id/1039/512/512',
  'https://picsum.photos/id/1040/512/512',
  'https://picsum.photos/id/1041/512/512',
  'https://picsum.photos/id/1043/512/512'
];

// Group to hold all image sprites
const globeGroup = new THREE.Group();
scene.add(globeGroup);

/**
  * Function to generate positions on a sphere using Fibonacci sphere algorithm
  * @param {number} samples - Number of images
  * @param {number} radius - Radius of the globe
  * @returns {Array} - Array of position objects {x, y, z}
  */
  function generateGlobePositions(samples, radius) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phi * i; // Golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({ x: x * radius, y: y * radius, z: z * radius });
    }

    return points;
  }

// Generate positions for all images
const totalImages = 100; // Increased number for tighter coverage
const globeRadius = 1; // Adjust based on desired size
const positions = generateGlobePositions(totalImages, globeRadius);

// Create and position each image as a sprite
for (let i = 0; i < totalImages; i++) {
  // Use a random image from the array or repeat them
  const texture = textureLoader.load(
    imageUrls[i % imageUrls.length],
    () => {
      // Texture loaded successfully
    },
    undefined,
    (err) => {
      console.error('Error loading texture:', err);
    }
  );

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.35, 0.35, 1); // Reduced size for tighter coverage

  // Position the sprite
  const pos = positions[i];
  sprite.position.set(pos.x, pos.y, pos.z);

  // Make the sprite face outward from the center
  sprite.lookAt(new THREE.Vector3(0, 0, 0));

  globeGroup.add(sprite);
}

// Automatic rotation parameters
const autoRotateSpeed = 0.0015; // Increased speed for better visibility

// Variables for user interaction
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
const inertiaDecay = 0.95; // Friction factor for inertia

// Event listeners for mouse interactions
renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = {
    x: e.clientX,
    y: e.clientY
  };
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    const rotationFactor = 0.005;
    globeGroup.rotation.y += deltaMove.x * rotationFactor;
    globeGroup.rotation.x += deltaMove.y * rotationFactor;

    // Update rotation velocity for inertia
    rotationVelocity = {
      x: deltaMove.x * rotationFactor,
      y: deltaMove.y * rotationFactor
    };

    previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Event listeners for touch interactions
renderer.domElement.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  previousMousePosition = {
    x: touch.clientX,
    y: touch.clientY
  };
}, { passive: false });

renderer.domElement.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault(); // Prevent default scrolling

    const touch = e.touches[0];
    const deltaMove = {
      x: touch.clientX - previousMousePosition.x,
      y: touch.clientY - previousMousePosition.y
    };

    const rotationFactor = 0.005;
    globeGroup.rotation.y += deltaMove.x * rotationFactor;
    globeGroup.rotation.x += deltaMove.y * rotationFactor;

    // Update rotation velocity for inertia
    rotationVelocity = {
      x: deltaMove.x * rotationFactor,
      y: deltaMove.y * rotationFactor
    };

    previousMousePosition = {
      x: touch.clientX,
      y: touch.clientY
    };
  }
}, { passive: false });

window.addEventListener('touchend', () => {
  isDragging = false;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    // Automatic rotation
    globeGroup.rotation.y += autoRotateSpeed;

    // Apply inertia
    globeGroup.rotation.y += rotationVelocity.x;
    globeGroup.rotation.x += rotationVelocity.y;

    // Apply friction
    rotationVelocity.x *= inertiaDecay;
    rotationVelocity.y *= inertiaDecay;
  }

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

