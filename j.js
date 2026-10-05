// ==========================================
// 1. GSAP
// ==========================================

gsap.registerPlugin(ScrollTrigger);


// ==========================================
// NAVBAR - مستقل عن تحميل الـ Frames
// ==========================================

const navbar = document.querySelector(".navbar");
const aboutSection = document.querySelector(".about-section");


function updateNavbarState() {

    if (!navbar) return;


    const navbarBottom =
        navbar.getBoundingClientRect().bottom;


    // ==========================================
    // الأقسام الفاتحة
    // ==========================================

    const lightSections = [
        document.querySelector(".about-section"),
        document.querySelector(".services-section")
    ];


    // هل الـ Navbar فوق قسم فاتح الآن؟
    const isOverLightSection =
        lightSections.some((section) => {

            if (!section) return false;

            const rect =
                section.getBoundingClientRect();

            return (
                rect.top <= navbarBottom &&
                rect.bottom > navbarBottom
            );

        });


    // ==========================================
    // LIGHT SECTION
    // About / Services
    // ==========================================

    if (isOverLightSection) {

        navbar.classList.add("scrolled");
        navbar.classList.add("light");

        return;
    }


    // ==========================================
    // DARK SECTION
    // Hero / Work
    // ==========================================

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");
        navbar.classList.remove("light");

        return;
    }


    // ==========================================
    // TOP OF PAGE
    // Transparent
    // ==========================================

    navbar.classList.remove("scrolled");
    navbar.classList.remove("light");
}


// ==========================================
// تشغيل مباشر
// ==========================================

updateNavbarState();


// ==========================================
// Scroll
// ==========================================

window.addEventListener(
    "scroll",
    updateNavbarState,
    { passive: true }
);


// ==========================================
// Refresh / Reload
// ==========================================

window.addEventListener("load", () => {

    // ننتظر المتصفح يرجع Scroll Position
    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            updateNavbarState();

        });

    });

});


// ==========================================
// Back / Forward
// ==========================================

window.addEventListener("pageshow", () => {

    requestAnimationFrame(() => {

        updateNavbarState();

    });

});


// ==========================================
// 2. Canvas
// ==========================================

const canvas = document.querySelector("#hero-canvas");
const ctx = canvas.getContext("2d");


// ==========================================
// 3. Frames Settings
// ==========================================

const frameCount = 241;

const images = [];

let loadedImages = 0;


// الفريم الحالي
const playhead = {
    frame: 0
};


// ==========================================
// 4. Canvas Size
// ==========================================

function resizeCanvas() {

    // Retina Display
    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;


    // الحجم الظاهر في الصفحة
    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";


    // لا نحاول الرسم إلا بعد تحميل الصور
    if (loadedImages === frameCount) {
        render();
    }
}


// أول تشغيل
resizeCanvas();


// إذا تغير حجم الشاشة
let lastWidth =
    window.innerWidth;


window.addEventListener(
    "resize",
    () => {

        const currentWidth =
            window.innerWidth;


        // على الجوال نتجاهل تغير الارتفاع فقط
        // الناتج من Browser UI
        if (
            window.innerWidth <= 768 &&
            currentWidth === lastWidth
        ) {
            return;
        }


        lastWidth =
            currentWidth;


        resizeCanvas();


        ScrollTrigger.refresh();

    }
);


// ==========================================
// 5. Load All Frames
// ==========================================

for (let i = 1; i <= frameCount; i++) {

    const img = new Image();


    // 1 → 0001
    // 10 → 0010
    // 100 → 0100

    const frameNumber =
        String(i).padStart(4, "0");


    img.src =
        `./assets/frames/frame_${frameNumber}.jpg`;


    img.onload = () => {

        loadedImages++;


        // إذا انتهى تحميل كل الفريمات
        if (loadedImages === frameCount) {

            console.log("ALL FRAMES LOADED 🔥");

            render();

            startAnimation();
        }
    };


    img.onerror = () => {

        console.error(
            `Failed to load frame: ${frameNumber}`
        );
    };


    images.push(img);
}


// ==========================================
// 6. Render Frame
// ==========================================

function render() {

    const frameIndex =
        Math.round(playhead.frame);

    const image =
        images[frameIndex];


    if (
        !image ||
        !image.complete ||
        image.naturalWidth === 0
    ) {
        return;
    }


    const canvasWidth =
        canvas.width;

    const canvasHeight =
        canvas.height;


    const imageWidth =
        image.naturalWidth;

    const imageHeight =
        image.naturalHeight;


    const isMobile =
        window.innerWidth <= 768;


    // ======================================
    // COVER SCALE
    // ======================================

    const scale =
        Math.max(
            canvasWidth / imageWidth,
            canvasHeight / imageHeight
        );


    const drawWidth =
        imageWidth * scale;

    const drawHeight =
        imageHeight * scale;


    // ======================================
    // IMAGE POSITION
    // ======================================

    let positionX = 0.5;
    let positionY = 0.5;


    /*
        Desktop:
        center center

        Mobile:
        نقدر نغير هذه القيمة لاحقًا
        حسب مكان العنصر المهم في الفيديو
    */

    if (isMobile) {

        positionX = 0.5;
        positionY = 0.5;

    }


    const x =
        (canvasWidth - drawWidth) *
        positionX;


    const y =
        (canvasHeight - drawHeight) *
        positionY;


    // ======================================
    // CLEAR
    // ======================================

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    // ======================================
    // DRAW
    // ======================================

    ctx.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
    );

}

// ==========================================
// 7. Start Animation
// ==========================================

function startAnimation() {

    setupFrameAnimation();

    setupContactButton();

    setupHeroAnimations();

    setupStoryTwo();

    setupStoryThree();

    setupAboutAnimations();

    setupWorkAnimations();

    setupServicesAnimations();

    setupContactAnimations();

    ScrollTrigger.refresh();
}


// ==========================================
// 8. Frame Sequence Animation
// ==========================================

function setupFrameAnimation() {

    let currentFrame = -1;


    // Render Loop مستقل عن ScrollTrigger
    function animationLoop() {

        const frameIndex =
            Math.round(playhead.frame);


        // لا نعيد الرسم إلا إذا تغير الفريم
        if (frameIndex !== currentFrame) {

            currentFrame = frameIndex;

            render();
        }


        requestAnimationFrame(
            animationLoop
        );
    }


    requestAnimationFrame(
        animationLoop
    );


    // GSAP يتحكم بقيمة الفريم
    gsap.to(
        playhead,
        {

            frame:
                frameCount - 1,

            ease:
                "none",

            scrollTrigger: {

                trigger:
                    ".video-section",

                start:
                    "top top",

                end:
                    "bottom bottom",

                scrub:
                    true
            }

        }
    );
}


// ==========================================
// 9. Navbar
// ==========================================

function setupNavbar() {

    const navbar = document.querySelector(".navbar");
    const about = document.querySelector(".about-section");

    if (!navbar || !about) return;


    // ==========================================
    // Update Navbar State
    // ==========================================

    function updateNavbar() {

        const scrollY = window.scrollY;

        const aboutRect =
            about.getBoundingClientRect();


        // ======================================
        // ABOUT
        // أبيض + كلام أسود
        // ======================================

        if (aboutRect.top <= 110) {

            navbar.classList.add("scrolled");
            navbar.classList.add("light");

        }


        // ======================================
        // HERO
        // Glass داكن + كلام أبيض
        // ======================================

        else if (scrollY > 50) {

            navbar.classList.add("scrolled");
            navbar.classList.remove("light");

        }


        // ======================================
        // TOP
        // شفاف + كلام أبيض
        // ======================================

        else {

            navbar.classList.remove("scrolled");
            navbar.classList.remove("light");

        }
    }


    // ==========================================
    // ScrollTrigger
    // ==========================================

    ScrollTrigger.create({

        trigger: document.body,

        start: "top top",
        end: "bottom bottom",

        onUpdate: updateNavbar,

        onRefresh: updateNavbar

    });


    // ==========================================
    // مهم جدًا
    // لو المستخدم عمل Refresh وهو داخل About
    // ==========================================

    updateNavbar();


    // المتصفح أحيانًا يسترجع Scroll Position
    // بعد اكتمال تحميل الصفحة
    window.addEventListener(
        "load",
        () => {

            updateNavbar();

            ScrollTrigger.refresh();

        }
    );


    // ==========================================
    // Back / Forward Cache
    // ==========================================

    window.addEventListener(
        "pageshow",
        () => {

            updateNavbar();

        }
    );
}


// ==========================================
// 10. Contact Button
// ==========================================

function setupContactButton() {

    const contactButton =
        document.querySelector(
            ".nav-contact"
        );


    if (!contactButton) {
        return;
    }


    contactButton.addEventListener(
        "mouseenter",
        (event) => {

            const rect =
                contactButton
                    .getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            contactButton.style
                .setProperty(
                    "--x",
                    `${x}px`
                );


            contactButton.style
                .setProperty(
                    "--y",
                    `${y}px`
                );
        }
    );
}


// ==========================================
// 11. Hero Animations
// ==========================================

function setupHeroAnimations() {

    // Hero Title
    gsap.to(
        ".hero-title",
        {

            y:
                -120,

            opacity:
                0,

            ease:
                "none",

            scrollTrigger: {

                trigger:
                    ".video-section",

                start:
                    "top top",

                end:
                    "15% top",

                scrub:
                    true
            }

        }
    );


    // Hero Subtitle
    gsap.to(
        ".hero-subtitle",
        {

            y:
                -50,

            opacity:
                0,

            ease:
                "none",

            scrollTrigger: {

                trigger:
                    ".video-section",

                start:
                    "top top",

                end:
                    "10% top",

                scrub:
                    true
            }

        }
    );
}


// ==========================================
// 12. Story Two
// ==========================================

function setupStoryTwo() {

    const storyTwo =
        gsap.timeline({

            scrollTrigger: {

                trigger:
                    ".video-section",

                start:
                    "25% top",

                end:
                    "55% top",

                scrub:
                    true
            }

        });


    // دخول
    storyTwo.fromTo(

        ".story-two",

        {
            opacity:
                0,

            y:
                80,

            visibility:
                "visible"
        },

        {
            opacity:
                1,

            y:
                0,

            duration:
                1,

            ease:
                "power2.out"
        }

    );


    // يبقى ظاهر
    storyTwo.to(

        ".story-two",

        {
            opacity:
                1,

            duration:
                2
        }

    );


    // خروج
    storyTwo.to(

        ".story-two",

        {
            opacity:
                0,

            y:
                -80,

            duration:
                1,

            ease:
                "power2.in"
        }

    );
}


// ==========================================
// 13. Story Three
// ==========================================

function setupStoryThree() {

    const storyThree =
        gsap.timeline({

            scrollTrigger: {

                trigger:
                    ".video-section",

                start:
                    "60% top",

                end:
                    "85% top",

                scrub:
                    true
            }

        });


    // دخول
    storyThree.fromTo(

        ".story-three",

        {
            opacity:
                0,

            scale:
                0.8,

            visibility:
                "visible"
        },

        {
            opacity:
                1,

            scale:
                1,

            duration:
                1,

            ease:
                "power2.out"
        }

    );


    // يبقى ظاهر
    storyThree.to(

        ".story-three",

        {
            opacity:
                1,

            scale:
                1,

            duration:
                2
        }

    );


    // خروج
    storyThree.to(

        ".story-three",

        {
            opacity:
                0,

            scale:
                1.15,

            duration:
                1,

            ease:
                "power2.in"
        }

    );
}


// ==========================================
// 14. About Section
// ==========================================

function setupAboutAnimations() {

    // ======================================
    // About Section Reveal
    // ======================================

    gsap.fromTo(

        ".about-section",

        {
            y:
                150
        },

        {
            y:
                0,

            ease:
                "none",

            scrollTrigger: {

                trigger:
                    ".about-section",

                start:
                    "top bottom",

                end:
                    "top 85%",

                scrub:
                    true
            }
        }

    );


    // ======================================
    // About Title
    // ======================================

    gsap.from(

        ".about-title",

        {
            y:
                100,

            opacity:
                0,

            ease:
                "power3.out",

            duration:
                1.2,

            scrollTrigger: {

                trigger:
                    ".about-section",

                start:
                    "top 70%",

                toggleActions:
                    "play none none reverse"
            }
        }

    );


    // ======================================
    // About Bottom
    // ======================================

    gsap.from(

        ".about-bottom",

        {
            y:
                50,

            opacity:
                0,

            ease:
                "power3.out",

            duration:
                1,

            scrollTrigger: {

                trigger:
                    ".about-section",

                start:
                    "top 60%",

                toggleActions:
                    "play none none reverse"
            }
        }

    );
}

// ==========================================
// WORK ANIMATIONS
// ==========================================

function setupWorkAnimations() {

    // ======================================
    // WORK TITLE
    // ======================================

    gsap.from(
        ".work-title h2",
        {
            y: 120,
            opacity: 0,

            duration: 1.2,

            ease: "power4.out",

            scrollTrigger: {
                trigger: ".work-title",

                start: "top 85%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // EACH PROJECT
    // ======================================

    gsap.utils
        .toArray(".project")
        .forEach((project) => {

            const image =
                project.querySelector(
                    ".project-image img"
                );

            const info =
                project.querySelector(
                    ".project-info"
                );


            // Project Reveal
            gsap.from(
                project,
                {
                    y: 100,
                    opacity: 0,

                    duration: 1,

                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: project,

                        start: "top 90%",

                        toggleActions:
                            "play none none reverse"
                    }
                }
            );


            // ==================================
            // IMAGE PARALLAX
            // ==================================

            gsap.fromTo(
                image,

                {
                    yPercent: 8
                },

                {
                    yPercent: 8,

                    ease: "none",

                    scrollTrigger: {
                        trigger: project,

                        start: "top bottom",

                        end: "bottom top",

                        scrub: true
                    }
                }
            );


            // ==================================
            // PROJECT INFO
            // ==================================

            gsap.from(
                info,
                {
                    y: 30,
                    opacity: 0,

                    duration: 0.8,

                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: info,

                        start: "top 95%",

                        toggleActions:
                            "play none none reverse"
                    }
                }
            );

        });


}


// ==========================================
// SERVICES ANIMATIONS
// ==========================================

function setupServicesAnimations() {

    // ======================================
    // BIG TITLE
    // ======================================

    gsap.from(
        ".services-heading h2",
        {
            y: 120,
            opacity: 0,

            duration: 1.2,

            ease: "power4.out",

            scrollTrigger: {
                trigger: ".services-heading",

                start: "top 85%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // HEADER
    // ======================================

    gsap.from(
        ".services-header",
        {
            y: 30,
            opacity: 0,

            duration: 0.8,

            ease: "power3.out",

            scrollTrigger: {
                trigger: ".services-header",

                start: "top 90%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // SERVICE ITEMS
    // ======================================

    gsap.utils
        .toArray(".service-item")
        .forEach((item, index) => {

            gsap.from(
                item,
                {
                    y: 60,
                    opacity: 0,

                    duration: 0.9,

                    delay:
                        index * 0.03,

                    ease:
                        "power3.out",

                    scrollTrigger: {
                        trigger: item,

                        start: "top 92%",

                        toggleActions:
                            "play none none reverse"
                    }
                }
            );

        });

}

// ==========================================
// CONTACT ANIMATIONS
// ==========================================

function setupContactAnimations() {

    // ======================================
    // TOP
    // ======================================

    gsap.from(
        ".contact-top",
        {
            opacity: 0,
            y: 30,

            duration: 0.8,

            ease: "power3.out",

            scrollTrigger: {
                trigger: ".contact-section",

                start: "top 80%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // FIRST LINE
    // من اليسار
    // ======================================

    gsap.from(
        ".contact-line-left span",
        {
            xPercent: -40,
            opacity: 0,

            duration: 1.3,

            ease: "power4.out",

            scrollTrigger: {
                trigger: ".contact-heading",

                start: "top 85%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // SECOND LINE
    // من اليمين
    // ======================================

    gsap.from(
        ".contact-line-right span",
        {
            xPercent: 40,
            opacity: 0,

            duration: 1.3,

            ease: "power4.out",

            scrollTrigger: {
                trigger: ".contact-heading",

                start: "top 85%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // CIRCLE
    // ======================================

    gsap.from(
        ".contact-circle",
        {
            scale: 0.5,
            opacity: 0,

            duration: 1,

            ease: "back.out(1.4)",

            scrollTrigger: {
                trigger: ".contact-action",

                start: "top 90%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );


    // ======================================
    // FOOTER
    // ======================================

    gsap.from(
        ".contact-footer",
        {
            y: 40,
            opacity: 0,

            duration: 1,

            ease: "power3.out",

            scrollTrigger: {
                trigger: ".contact-footer",

                start: "top 95%",

                toggleActions:
                    "play none none reverse"
            }
        }
    );

}

// ==========================================
// SMOOTH ANCHOR SCROLL
// ==========================================

function setupSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (!targetId) {
                    return;
                }


                // ======================================
                // LOGO / HOME
                // href="#"
                // ======================================

                if (targetId === "#") {

                    event.preventDefault();


                    smoothScrollTo(
                        0,
                        1.6
                    );


                    return;
                }


                // ======================================
                // NORMAL SECTIONS
                // ======================================

                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const targetY =
                    target
                        .getBoundingClientRect()
                        .top +
                    window.scrollY;


                const navbarOffset =
                    110;


                smoothScrollTo(
                    targetY -
                    navbarOffset,

                    1.4
                );

            }
        );

    });

}

// ==========================================
// CUSTOM SMOOTH SCROLL
// ==========================================

function smoothScrollTo(
    targetY,
    duration = 1.4
) {

    const startY =
        window.scrollY;


    const distance =
        targetY - startY;


    const startTime =
        performance.now();


    function easeInOutCubic(t) {

        return t < 0.5

            ? 4 * t * t * t

            : 1 -
            Math.pow(
                -2 * t + 2,
                3
            ) / 2;

    }


    function animation(
        currentTime
    ) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed /
                (duration * 1000),
                1
            );


        const easedProgress =
            easeInOutCubic(
                progress
            );


        window.scrollTo(
            0,
            startY +
            distance *
            easedProgress
        );


        if (progress < 1) {

            requestAnimationFrame(
                animation
            );

        } else {

            ScrollTrigger.update();

        }

    }


    requestAnimationFrame(
        animation
    );

}


// ==========================================
// CUSTOM CURSOR
// ==========================================


// ==========================================
// MAGNETIC ELEMENTS
// ==========================================


// ==========================================
// CUSTOM CURSOR
// ==========================================


// ==========================================
// MAGNETIC ELEMENTS
// ==========================================
// ==========================================
// CUSTOM CURSOR
// ==========================================

function setupCustomCursor() {

    const cursor =
        document.querySelector(".custom-cursor");


    if (!cursor) {

        console.error(
            "Custom Cursor element not found!"
        );

        return;
    }


    // ======================================
    // Desktop Only
    // ======================================

    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (!supportsHover) {

        console.log(
            "Custom Cursor disabled on touch device"
        );

        return;
    }


    // ======================================
    // Mouse Position
    // ======================================

    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;


    let cursorX =
        mouseX;

    let cursorY =
        mouseY;


    window.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            cursor.classList.add(
                "visible"
            );

        }
    );


    // ======================================
    // Mouse Leave
    // ======================================

    document.addEventListener(
        "mouseleave",
        () => {

            cursor.classList.remove(
                "visible"
            );

        }
    );


    document.addEventListener(
        "mouseenter",
        () => {

            cursor.classList.add(
                "visible"
            );

        }
    );


    // ======================================
    // Smooth Movement
    // ======================================

    function cursorLoop() {

        cursorX +=
            (mouseX - cursorX) * 0.22;


        cursorY +=
            (mouseY - cursorY) * 0.22;


        cursor.style.left =
            `${cursorX}px`;


        cursor.style.top =
            `${cursorY}px`;


        requestAnimationFrame(
            cursorLoop
        );

    }


    cursorLoop();


    // ======================================
    // Interactive Elements
    // ======================================

    const interactiveElements =
        document.querySelectorAll(
            `
            a,
            button,
            .service-item
            `
        );


    interactiveElements.forEach(
        (element) => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursor.classList.add(
                        "cursor-hover"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursor.classList.remove(
                        "cursor-hover"
                    );

                }
            );

        }
    );


    // ======================================
    // Projects
    // ======================================

    document
        .querySelectorAll(".project-image")
        .forEach((project) => {

            project.addEventListener(
                "mouseenter",
                () => {

                    cursor.classList.remove(
                        "cursor-hover"
                    );

                    cursor.classList.add(
                        "cursor-project"
                    );

                }
            );


            project.addEventListener(
                "mouseleave",
                () => {

                    cursor.classList.remove(
                        "cursor-project"
                    );

                }
            );

        });

}
function setupMagneticElements() {

    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (!supportsHover) {
        return;
    }


    const elements =
        document.querySelectorAll(
            ".nav-contact, .contact-circle"
        );


    elements.forEach((element) => {

        element.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    element.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;


                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                gsap.to(
                    element,
                    {
                        x: x * 0.18,
                        y: y * 0.18,

                        duration: 0.35,

                        ease: "power3.out",

                        overwrite: true
                    }
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                gsap.to(
                    element,
                    {
                        x: 0,
                        y: 0,

                        duration: 0.7,

                        ease:
                            "elastic.out(1, 0.4)",

                        overwrite: true
                    }
                );

            }
        );

    });

}


// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {

    const menu =
        document.querySelector(
            ".mobile-menu"
        );


    const menuButton =
        document.querySelector(
            ".mobile-menu-button"
        );


    const menuText =
        document.querySelector(
            ".mobile-menu-text"
        );


    const links =
        document.querySelectorAll(
            ".mobile-menu-link"
        );


    if (
        !menu ||
        !menuButton
    ) {
        return;
    }


    let isOpen = false;


    // ======================================
    // GSAP TIMELINE
    // ======================================

    const timeline =
        gsap.timeline({
            paused: true
        });


    timeline
        .set(
            menu,
            {
                visibility:
                    "visible"
            }
        )

        .to(
            menu,
            {
                clipPath:
                    "inset(0 0 0% 0)",

                duration:
                    0.8,

                ease:
                    "power4.inOut"
            }
        )

        .from(
            ".mobile-menu-top",
            {
                y: 20,

                opacity: 0,

                duration:
                    0.5,

                ease:
                    "power3.out"
            },

            "-=0.35"
        )

        .from(
            ".mobile-link-text",
            {
                yPercent: 120,

                duration:
                    0.8,

                stagger:
                    0.07,

                ease:
                    "power4.out"
            },

            "-=0.35"
        )

        .from(
            ".mobile-link-number",
            {
                opacity: 0,

                x: -10,

                duration:
                    0.5,

                stagger:
                    0.07,

                ease:
                    "power3.out"
            },

            "-=0.65"
        )

        .from(
            ".mobile-menu-bottom",
            {
                y: 20,

                opacity: 0,

                duration:
                    0.5,

                ease:
                    "power3.out"
            },

            "-=0.5"
        );


    // ======================================
    // OPEN
    // ======================================

    function openMenu() {

        if (isOpen) return;

        isOpen = true;


        menu.classList.add(
            "is-open"
        );


        menuButton.classList.add(
            "is-open"
        );


        navbar.classList.add(
            "menu-open"
        );


        if (menuText) {
            menuText.textContent =
                "Close";
        }


        // وقف Scroll الصفحة

        document.body.style.overflow =
            "hidden";


        timeline.play();

    }


    // ======================================
    // CLOSE
    // ======================================

    function closeMenu() {

        if (!isOpen) return;

        isOpen = false;


        menuButton.classList.remove(
            "is-open"
        );


        navbar.classList.remove(
            "menu-open"
        );


        if (menuText) {
            menuText.textContent =
                "Menu";
        }


        document.body.style.overflow =
            "";


        timeline.reverse();


        timeline.eventCallback(
            "onReverseComplete",
            () => {

                menu.classList.remove(
                    "is-open"
                );


                gsap.set(
                    menu,
                    {
                        visibility:
                            "hidden"
                    }
                );

            }
        );

    }


    // ======================================
    // BUTTON
    // ======================================

    menuButton.addEventListener(
        "click",
        () => {

            if (isOpen) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    // ======================================
    // CLICK LINK
    // ======================================

    links.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu();

                }
            );

        }
    );


    // ======================================
    // ESC
    // ======================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();

            }

        }
    );


    // ======================================
    // RESIZE
    // ======================================

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                768 &&
                isOpen
            ) {

                closeMenu();

            }

        }
    );

}

setupSmoothScroll();

setupCustomCursor();

setupMagneticElements();

setupMobileMenu();