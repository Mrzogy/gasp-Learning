// ==========================================
// 1. GSAP
// ==========================================

gsap.registerPlugin(ScrollTrigger);


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
window.addEventListener(
    "resize",
    resizeCanvas
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

            // عرض أول Frame
            render();

            // تشغيل الموقع
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

    // نحول رقم الفريم إلى Integer
    const frameIndex =
        Math.round(playhead.frame);


    const image =
        images[frameIndex];


    // حماية
    if (
        !image ||
        !image.complete ||
        image.naturalWidth === 0
    ) {
        return;
    }


    // ======================================
    // object-fit: cover
    // ======================================

    const canvasRatio =
        canvas.width / canvas.height;


    const imageRatio =
        image.naturalWidth /
        image.naturalHeight;


    let width;
    let height;

    let x;
    let y;


    if (imageRatio > canvasRatio) {

        // الصورة أعرض من الشاشة

        height =
            canvas.height;

        width =
            image.naturalWidth *
            (canvas.height / image.naturalHeight);


        x =
            (canvas.width - width) / 2;

        y = 0;

    } else {

        // الصورة أطول من الشاشة

        width =
            canvas.width;

        height =
            image.naturalHeight *
            (canvas.width / image.naturalWidth);


        x = 0;

        y =
            (canvas.height - height) / 2;
    }


    // تنظيف Canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // رسم الفريم
    ctx.drawImage(
        image,
        x,
        y,
        width,
        height
    );
}


// ==========================================
// 7. Start Animation
// ==========================================

function startAnimation() {

    setupFrameAnimation();

    setupNavbar();

    setupContactButton();

    setupHeroAnimations();

    setupStoryTwo();

    setupStoryThree();

    setupAboutAnimations();


    // بعد إنشاء جميع ScrollTriggers
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


    ScrollTrigger.create({

        trigger: document.body,

        start: "top top",
        end: "bottom bottom",

        onUpdate: () => {

            const scrollY = window.scrollY;

            const aboutRect =
                about.getBoundingClientRect();


            // =====================================
            // 1. ABOUT
            // Navbar أبيض + كلام أسود
            // =====================================

            if (aboutRect.top <= 110) {

                navbar.classList.add("scrolled");
                navbar.classList.add("light");

            }


            // =====================================
            // 2. HERO أثناء السكرول
            // Navbar أسود Glass + كلام أبيض
            // =====================================

            else if (scrollY > 50) {

                navbar.classList.add("scrolled");
                navbar.classList.remove("light");

            }


            // =====================================
            // 3. أعلى الصفحة
            // Navbar شفاف + كلام أبيض
            // =====================================

            else {

                navbar.classList.remove("scrolled");
                navbar.classList.remove("light");

            }

        }

    });


    // تحديث الحالة مباشرة عند تحميل الصفحة
    ScrollTrigger.refresh();
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