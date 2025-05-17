// Centralized image configuration for menu items - now as array for flexibility
const MENU_IMAGES = [
  "./assets/images/menu/menu-1.jpg",

  "./assets/images/menu/menu-2.jpg",
  
  "./assets/images/menu/menu-3.jpg",
  
  "./assets/images/menu/menu-4.jpg",
  
  "./assets/images/menu/menu-5.jpg",
  
  "./assets/images/menu/menu-6.jpg",
  
  "./assets/images/menu/menu-7.jpg",
  
  "./assets/images/menu/menu-8.jpg",
  
  "./assets/images/menu/menu-9.jpg",
];


// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function () {
  initScrollTopButton();
  initGallery();
  initFancybox();
});

// Handle scroll to top button visibility
function initScrollTopButton() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", function () {
    scrollBtn.style.display = window.scrollY > 200 ? "flex" : "none";
  });

  scrollBtn.style.display = "none";
}

// Initialize gallery with main image and thumbnails
function initGallery() {
  const mainMenuImage = document.getElementById("mainMenuImage");
  const mainMenuLink = document.getElementById("mainMenuLink");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  // Generate thumbnails and gallery links dynamically
  generateGalleryLinks();
  generateThumbnails();

  const thumbnails = document.querySelectorAll(".menu-thumbnail-item");
  const galleryLinks = document.querySelectorAll(".hidden-gallery-item");
  let currentIndex = 0;

  // Set initial main image
  if (mainMenuImage && mainMenuLink && MENU_IMAGES.length > 0) {
    mainMenuImage.src = MENU_IMAGES[0];
    mainMenuLink.href = MENU_IMAGES[0];
    
    // Remove data-fancybox attribute from mainMenuLink to prevent duplicate in gallery
    // Instead, use data-trigger-gallery attribute
    mainMenuLink.removeAttribute("data-fancybox");
    mainMenuLink.setAttribute("data-trigger-gallery", "menu-gallery");
    
    // Add click event to open gallery via JavaScript instead
    mainMenuLink.addEventListener("click", (e) => {
      e.preventDefault();
      Fancybox.show(
        MENU_IMAGES.map(url => ({ src: url, type: "image" })),
        { startIndex: currentIndex }
      );
    });
  }

  // Set thumbnail click events
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => selectImage(index));
  });

  // Navigation button event listeners
  if (prevBtn) prevBtn.addEventListener("click", () => navigateGallery(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateGallery(1));

  // Add drag functionality to main image
  addDragCapability();

  // Navigate to previous or next image
  function navigateGallery(direction) {
    currentIndex = (currentIndex + direction + MENU_IMAGES.length) % MENU_IMAGES.length;
    selectImage(currentIndex);
  }

  // Select image by index
  function selectImage(index) {
    if (index >= MENU_IMAGES.length) return;

    currentIndex = index;

    // Update thumbnails
    thumbnails.forEach((t) => t.querySelector(".menu-thumbnail").classList.remove("active"));
    thumbnails[index].querySelector(".menu-thumbnail").classList.add("active");

    // Update main image
    updateMainImage(index);

    // Scroll thumbnail into view
    thumbnails[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  // Update the main menu image
  function updateMainImage(index) {
    if (index < MENU_IMAGES.length && mainMenuImage) {
      mainMenuImage.style.opacity = "0.5";
      setTimeout(() => {
        mainMenuImage.src = MENU_IMAGES[index];
        mainMenuLink.href = MENU_IMAGES[index];
        mainMenuImage.style.opacity = "1";
      }, 200);
    }
  }
  
  // Add drag capability to the main menu image
  function addDragCapability() {
    const mainImageContainer = document.querySelector(".menu-main-image");
    if (!mainImageContainer) return;
    
    let isDragging = false;
    let startX = 0;
    let currentDragX = 0;
    let dragThreshold = 50; // Minimum drag distance to trigger navigation
    
    // Visual feedback helper
    function updateDragVisualFeedback(diffX) {
      if (Math.abs(diffX) > 20) {
        mainMenuImage.style.transform = `translateX(${diffX * 0.2}px)`;
        
        // Show directional hint
        if (diffX > 0) {
          mainImageContainer.classList.add("dragging-right");
          mainImageContainer.classList.remove("dragging-left");
        } else if (diffX < 0) {
          mainImageContainer.classList.add("dragging-left");
          mainImageContainer.classList.remove("dragging-right");
        }
      }
    }
    
    // Reset visual feedback
    function resetDragVisualFeedback() {
      mainMenuImage.style.transform = "";
      mainImageContainer.classList.remove("dragging-left", "dragging-right");
    }
    
    // Touch events for mobile
    mainImageContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      currentDragX = startX;
      isDragging = true;
      mainImageContainer.classList.add("dragging");
    });
    
    mainImageContainer.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling while dragging
      
      currentDragX = e.touches[0].clientX;
      const diffX = currentDragX - startX;
      updateDragVisualFeedback(diffX);
    });
    
    mainImageContainer.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      
      if (Math.abs(diffX) > dragThreshold) {
        if (diffX > 0) {
          navigateGallery(-1); // Drag right -> previous image
        } else {
          navigateGallery(1); // Drag left -> next image
        }
      }
      
      isDragging = false;
      mainImageContainer.classList.remove("dragging");
      resetDragVisualFeedback();
    });
    
    // Mouse events for desktop
    mainImageContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX;
      currentDragX = startX;
      isDragging = true;
      mainImageContainer.style.cursor = "grabbing";
      mainImageContainer.classList.add("dragging");
    });
    
    mainImageContainer.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      currentDragX = e.clientX;
      const diffX = currentDragX - startX;
      updateDragVisualFeedback(diffX);
    });
    
    mainImageContainer.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      
      const endX = e.clientX;
      const diffX = endX - startX;
      
      if (Math.abs(diffX) > dragThreshold) {
        if (diffX > 0) {
          navigateGallery(-1); // Drag right -> previous image
        } else {
          navigateGallery(1); // Drag left -> next image
        }
      }
      
      isDragging = false;
      mainImageContainer.style.cursor = "grab";
      mainImageContainer.classList.remove("dragging");
      resetDragVisualFeedback();
    });
    
    mainImageContainer.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        mainImageContainer.style.cursor = "grab";
        mainImageContainer.classList.remove("dragging");
        resetDragVisualFeedback();
      }
    });
    
    // Set initial cursor style
    mainImageContainer.style.cursor = "grab";
  }
  
  // Generate hidden gallery links dynamically
  function generateGalleryLinks() {
    const container = document.getElementById('gallery-links-container');
    if (!container) return;
    
    // Clear existing gallery links
    container.innerHTML = '';
    
    // Create new gallery links based on array length - we don't actually need these anymore
    // since we're using JavaScript to start the gallery, but keeping for compatibility
    MENU_IMAGES.forEach((url, index) => {
      const galleryLink = document.createElement("a");
      galleryLink.href = url;
      galleryLink.className = "hidden-gallery-item";
      galleryLink.style.display = "none"; // Make sure they're not clickable
      
      container.appendChild(galleryLink);
    });
  }

  // Generate thumbnails based on image array
  function generateThumbnails() {
    const container = document.querySelector(".menu-thumbnails-container");
    if (!container) return;

    // Clear existing thumbnails
    container.innerHTML = "";

    // Create new thumbnails based on array
    MENU_IMAGES.forEach((url, index) => {
      const thumbnailItem = document.createElement("div");
      thumbnailItem.className = "menu-thumbnail-item";
      thumbnailItem.setAttribute("data-index", index);

      const thumbnail = document.createElement("div");
      thumbnail.className = "menu-thumbnail";
      if (index === 0) thumbnail.classList.add("active");

      const img = document.createElement("img");
      img.src = url;
      img.className = "img-fluid";
      img.alt = `Menu page ${index + 1}`;

      thumbnail.appendChild(img);
      thumbnailItem.appendChild(thumbnail);
      container.appendChild(thumbnailItem);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") navigateGallery(-1);
    else if (e.key === "ArrowRight") navigateGallery(1);
  });
}

// Initialize Fancybox lightboxes
function initFancybox() {
  // Setup Fancybox for menu gallery
  Fancybox.bind("[data-fancybox='menu-gallery']", {
    animationEffect: "fade",
    transitionEffect: "fade",
    buttons: ["zoom", "slideShow", "fullScreen", "close"],
    thumbs: {
      autoStart: true,
      hideOnClose: true,
    },
    touch: {
      vertical: false,
    },
    clickContent: "next",
    clickSlide: "close",
    loop: true,
  });

  // Setup Fancybox for food gallery
  Fancybox.bind("[data-fancybox='food-gallery']", {
    animationEffect: "zoom",
    transitionEffect: "fade",
    buttons: ["zoom", "slideShow", "fullScreen", "close"],
    loop: true,
    protect: true,
  });
}