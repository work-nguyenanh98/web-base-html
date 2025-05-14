document.addEventListener('DOMContentLoaded', () => {
    // Gallery swiper
    const gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        }
    });

    // Banner swiper
    const bannerSwiper = new Swiper('#slide-TRTD1ERvz', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        navigation: {
            nextEl: '.banner-button-next',
            prevEl: '.banner-button-prev',
        },
        pagination: {
            el: '.banner-pagination',
            clickable: true,
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
                centeredSlides: false
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20,
                centeredSlides: false
            }
        }
    });

    // Click handling for slides
    $("#slide-TRTD1ERvz").find('.swiper-slide').on('click', function () {
        let index = $(this).data('swiperSlideIndex');
        $(this).closest('.swiper-container').each(function () {
            this.swiper.slideToLoop(index);
        });
    });

    // Reviews functionality
    let currentPage = 1;
    let maxPages = 5; // Total number of pages in reviews.html
    let isLoading = false;

    // Initially hide the "View Less" button
    $('.review-section .less').hide();

    // Document-ready handler for dynamic elements
    $(document).ready(function() {
        // View More button handler
        $('.review-section .more').off('click').on('click', function(e) {
            e.preventDefault();
            
            const $reviewSection = $(this).closest('.review-section');
            const $moreBtn = $(this);
            const $lessBtn = $(this).closest('.show-more').find('.less');
            
            // Only proceed if not already loading
            if (!isLoading) {
                isLoading = true;
                
                // Show loading state
                $moreBtn.html('Loading... <i class="bi bi-hourglass-split"></i>');
                
                if (currentPage < maxPages) {
                    // Load the next page
                    $.ajax({
                        url: '/reviews.html',
                        data: {
                            page: currentPage + 1
                        },
                        success: function (data) {
                            isLoading = false;
                            currentPage++;
                            
                            if (data) {
                                // Create a container for the new reviews if it doesn't exist
                                if ($('.reviews-container .additional-reviews').length === 0) {
                                    $('.reviews-container').append('<div class="additional-reviews"></div>');
                                }
                                
                                // Parse the data and find the review-page element with the matching data-page attribute
                                let $data = $(data);
                                let $pageContent = $data.filter(`.review-page[data-page="${currentPage}"]`);
                                
                                // If the page content exists, append it
                                if ($pageContent.length > 0) {
                                    $('.reviews-container .additional-reviews').append($pageContent);
                                    $('.reviews-container .additional-reviews').css('display', 'block');
                                    
                                    // If we've reached the max pages, show "View Less" only
                                    if (currentPage >= maxPages) {
                                        $moreBtn.hide();
                                        $lessBtn.show();
                                        $reviewSection.addClass('show').addClass('end');
                                    } else {
                                        // Otherwise show both buttons
                                        $moreBtn.html('View more <i class="bi bi-arrow-down"></i>');
                                        $moreBtn.show();
                                        $lessBtn.hide();
                                    }
                                } else {
                                    // No more reviews to load
                                    $moreBtn.html('No more reviews <i class="bi bi-x-circle"></i>');
                                    setTimeout(() => {
                                        $moreBtn.hide();
                                        $lessBtn.show();
                                    }, 1500);
                                    $reviewSection.addClass('show').addClass('end');
                                }
                            } else {
                                // No data returned
                                $moreBtn.html('No more reviews <i class="bi bi-x-circle"></i>');
                                setTimeout(() => {
                                    $moreBtn.hide();
                                    $lessBtn.show();
                                }, 1500);
                                $reviewSection.addClass('show').addClass('end');
                            }
                        },
                        error: function () {
                            isLoading = false;
                            $moreBtn.html('Error loading. Try again <i class="bi bi-arrow-down"></i>');
                        }
                    });
                } else {
                    // We've already loaded everything
                    isLoading = false;
                    $moreBtn.hide();
                    $lessBtn.show();
                    $('.reviews-container .additional-reviews').css('display', 'block');
                    $reviewSection.addClass('show').addClass('end');
                }
            }
            return false;
        });
        
        // View Less button handler (using delegated event for dynamically added elements)
        $(document).off('click', '.review-section .less').on('click', '.review-section .less', function(e) {
            // Prevent any default actions
            e.preventDefault();
            e.stopPropagation();
            
            const $reviewSection = $(this).closest('.review-section');
            const $moreBtn = $(this).closest('.show-more').find('.more');
            const $lessBtn = $(this);
            
            // Reset page counter to first page
            currentPage = 1;
            
            // Remove classes that show expanded state
            $reviewSection.removeClass('show').removeClass('end');
            
            // Hide additional reviews with extra emphasis
            if ($('.reviews-container .additional-reviews').length > 0) {
                $('.reviews-container .additional-reviews').css('display', 'none');
                $('.reviews-container .additional-reviews').empty();
            }
            
            // Show the "View More" button and hide "View Less"
            $moreBtn.html('View more <i class="bi bi-arrow-down"></i>');
            $moreBtn.show();
            $lessBtn.hide();
            
            // Ensure we're not in loading state
            isLoading = false;
            
            console.log('View Less clicked: resetting reviews view');
            
            // Stay on current scroll position
            return false;
        });
    });

    // Scroll to top button functionality
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 200) scrollBtn.style.display = 'flex';
        else scrollBtn.style.display = 'none';
    });
    scrollBtn.style.display = 'none';

    // Map modal functionality
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
        mapModal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            const button = event.relatedTarget;

            // Extract info from data attributes
            const mapUrl = button.getAttribute('data-map-url');
            const location = button.getAttribute('data-location');
            const mapsLink = button.getAttribute('data-maps-link');

            // Update the modal's content
            const modalIframe = mapModal.querySelector('iframe');
            const modalLocation = mapModal.querySelector('.contact-info-small');
            const modalMapsLink = document.getElementById('modalMapsLink');

            if (modalIframe) modalIframe.src = mapUrl;
            if (modalLocation) modalLocation.innerHTML = '<small><i class="bi bi-geo-alt-fill"></i> ' + location + '</small>';
            if (modalMapsLink) modalMapsLink.href = mapsLink;
        });
    }

    // Location tabs functionality
    const locationBtns = document.querySelectorAll('.location-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Function to activate tab
    function activateTab(targetId) {
        // Hide all tab content
        tabPanes.forEach(pane => {
            pane.classList.remove('show', 'active');
        });

        // Show selected tab content
        const targetPane = document.querySelector(targetId);
        if (targetPane) {
            targetPane.classList.add('show', 'active');
        }
    }

    // Add click handlers
    locationBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Prevent default behavior
            e.preventDefault();

            // Remove active class from all buttons
            locationBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get target tab ID
            const targetId = this.getAttribute('data-bs-target');

            // Activate the tab
            activateTab(targetId);

            // Check the corresponding radio button
            const radioId = this.getAttribute('for');
            if (radioId) {
                const radio = document.getElementById(radioId);
                if (radio) radio.checked = true;
            }
        });
    });
});
