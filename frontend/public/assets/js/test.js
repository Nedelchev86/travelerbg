$(document).ready(function () {
  $(".categorySlider").each(function () {
    const multiplier = {
      translate: 0.1,
      rotate: 0.01,
    };

    // new Swiper(".categorySlider", {
    //   slidesPerView: 5,
    //   spaceBetween: 60,
    //   centeredSlides: true,
    //   loop: true,
    //   grabCursor: true,
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    //   breakpoints: {
    //     300: {
    //       slidesPerView: 1,
    //       spaceBetween: 10,
    //     },
    //     600: {
    //       slidesPerView: 2,
    //       spaceBetween: 30,
    //     },
    //     768: {
    //       slidesPerView: 3,
    //       spaceBetween: 30,
    //     },
    //     1024: {
    //       slidesPerView: 4,
    //       spaceBetween: 40,
    //     },
    //     1280: {
    //       slidesPerView: 5,
    //       spaceBetween: 60,
    //     },
    //   },
    // });

    function calculateWheel() {
      const slides = document.querySelectorAll(".single");
      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
        let ty =
          Math.abs(r) * multiplier.translate -
          rect.width * multiplier.translate;

        if (ty < 0) {
          ty = 0;
        }
        const transformOrigin = r < 0 ? "left top" : "right top";
        slide.style.transform = `translate(0, ${ty}px) rotate(${
          -r * multiplier.rotate
        }deg)`;
        slide.style.transformOrigin = transformOrigin;
      });
    }

    function raf() {
      requestAnimationFrame(raf);
      calculateWheel();
    }

    raf();
  });
});

$.fn.shapeMockup = function () {
  var $shape = $(this);
  $shape.each(function () {
    var $currentShape = $(this),
      shapeTop = $currentShape.data("top"),
      shapeRight = $currentShape.data("right"),
      shapeBottom = $currentShape.data("bottom"),
      shapeLeft = $currentShape.data("left");
    $currentShape
      .css({
        top: shapeTop,
        right: shapeRight,
        bottom: shapeBottom,
        left: shapeLeft,
      })
      .removeAttr("data-top")
      .removeAttr("data-right")
      .removeAttr("data-bottom")
      .removeAttr("data-left")
      .parent()
      .addClass("shape-mockup-wrap");
  });
};

if ($(".shape-mockup")) {
  $(".shape-mockup").shapeMockup();
}

/*----------- 16. Progress Bar Animation ----------*/
// $(".progress-bar").waypoint(
//   function () {
//     $(".progress-bar").css({
//       animation: "animate-positive 1.8s",
//       opacity: "1",
//     });
//   },
//   {
//     offset: "75%",
//   }
// );
