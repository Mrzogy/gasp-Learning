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


        console.log(
            `Loaded ${loadedImages}/${frameCount}`
        );


        // إذا انتهى تحميل كل الفريمات
        if (loadedImages === frameCount) {

            console.log(
                "ALL FRAMES LOADED 🔥"
            );

            // عرض أول Frame
            render();

            // تشغيل Animation
            startAnimation();
        }
    };


    images.push(img);
}


// ==========================================
// 6. Render Frame
// ==========================================

function render() {

    // نحول الرقم إلى integer
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
        image.width / image.height;


    let width;
    let height;

    let x;
    let y;


    if (imageRatio > canvasRatio) {

        // الصورة أعرض من الشاشة

        height = canvas.height;

        width =
            image.width *
            (canvas.height / image.height);


        x =
            (canvas.width - width) / 2;

        y = 0;

    } else {

        // الصورة أطول من الشاشة

        width = canvas.width;

        height =
            image.height *
            (canvas.width / image.width);


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
// 7. GSAP Scroll Animation
// ==========================================

function startAnimation() {

    let currentFrame = -1;

    // Render Loop مستقل عن ScrollTrigger
    function animationLoop() {

        const frameIndex = Math.round(playhead.frame);

        // لا نعيد الرسم إذا ما تغير الفريم
        if (frameIndex !== currentFrame) {

            currentFrame = frameIndex;

            render();
        }

        requestAnimationFrame(animationLoop);
    }


    // تشغيل Render Loop
    requestAnimationFrame(animationLoop);


    // GSAP يتحكم فقط بقيمة الـ Frame
    gsap.to(playhead, {
        frame: frameCount - 1,
        ease: "none",

        scrollTrigger: {
            trigger: ".video-section",
            start: "top top",
            end: "bottom bottom",
            scrub: true,

            onUpdate: (self) => {
                console.log(
                    "progress:", self.progress.toFixed(4),
                    "frame:", Math.round(playhead.frame)
                );
            }
        }
    });

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });

    const contactButton = document.querySelector(".nav-contact");

    contactButton.addEventListener("mouseenter", (event) => {

        const rect = contactButton.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        contactButton.style.setProperty("--x", `${x}px`);
        contactButton.style.setProperty("--y", `${y}px`);
    });

    gsap.to(".hero-title", {
        y: -120,
        opacity: 0,

        scrollTrigger: {
            trigger: ".video-section",
            start: "top top",
            end: "15% top",
            scrub: true
        }
    });

    gsap.to(".hero-subtitle", {
        y: -50,
        opacity: 0,

        scrollTrigger: {
            trigger: ".video-section",
            start: "top top",
            end: "10% top",
            scrub: true
        }
    });

    const storyTwo = gsap.timeline({
        scrollTrigger: {
            trigger: ".video-section",

            // يبدأ تقريبًا عند 25% من الرحلة
            start: "25% top",

            // وينتهي عند 55%
            end: "55% top",

            scrub: true
        }
    });

    storyTwo
        // دخول
        .fromTo(
            ".story-two",
            {
                opacity: 0,
                y: 80,
                visibility: "visible"
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }
        )

        // يبقى ظاهر فترة
        .to(
            ".story-two",
            {
                opacity: 1,
                duration: 2
            }
        )

        // خروج
        .to(
            ".story-two",
            {
                opacity: 0,
                y: -80,
                duration: 1,
                ease: "power2.in"
            }
        );
}