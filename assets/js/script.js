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

/*====================== Hide Menu Mobile when link is clicked =====================*/
  const nav = document.querySelectorAll('.nav__link');
const action = () => {
  navMenu.classList.remove('show-menu');
}
nav.forEach(n => n.addEventListener('click', action));


/*======================= side bar =================================================*/
  const sidebarClose = document.getElementById("sidebar-close");
const sidebarToggle = document.getElementById("sidebar-students");
const sidebar       = document.getElementById("student-sidebar");



if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add("show-sidebar");
  });
}

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove("show-sidebar"); 
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

