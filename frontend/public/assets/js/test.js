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

// $.fn.shapeMockup = function () {
//   var $shape = $(this);
//   $shape.each(function () {
//     var $currentShape = $(this),
//       shapeTop = $currentShape.data("top"),
//       shapeRight = $currentShape.data("right"),
//       shapeBottom = $currentShape.data("bottom"),
//       shapeLeft = $currentShape.data("left");
//     $currentShape
//       .css({
//         top: shapeTop,
//         right: shapeRight,
//         bottom: shapeBottom,
//         left: shapeLeft,
//       })
//       .removeAttr("data-top")
//       .removeAttr("data-right")
//       .removeAttr("data-bottom")
//       .removeAttr("data-left")
//       .parent()
//       .addClass("shape-mockup-wrap");
//   });
// };

// if ($(".shape-mockup")) {
//   $(".shape-mockup").shapeMockup();
// }

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
// $.fn.thmobilemenu = function (options) {
//   var opt = $.extend(
//     {
//       menuToggleBtn: ".th-menu-toggle",
//       bodyToggleClass: "th-body-visible",
//       subMenuClass: "th-submenu",
//       subMenuParent: "menu-item-has-children",
//       thSubMenuParent: "th-item-has-children",
//       subMenuParentToggle: "th-active",
//       meanExpandClass: "th-mean-expand",
//       // appendElement: '<span class="th-mean-expand"></span>',
//       subMenuToggleClass: "th-open",
//       toggleSpeed: 400,
//     },
//     options
//   );

//   return this.each(function () {
//     var menu = $(this); // Select menu

//     // Menu Show & Hide
//     function menuToggle() {
//       menu.toggleClass(opt.bodyToggleClass);

//       // collapse submenu on menu hide or show
//       var subMenu = "." + opt.subMenuClass;
//       $(subMenu).each(function () {
//         if ($(this).hasClass(opt.subMenuToggleClass)) {
//           $(this).removeClass(opt.subMenuToggleClass);
//           $(this).css("display", "none");
//           $(this).parent().removeClass(opt.subMenuParentToggle);
//         }
//       });
//     }

//     // Class Set Up for every submenu
//     menu.find("." + opt.subMenuParent).each(function () {
//       var submenu = $(this).find("ul");
//       submenu.addClass(opt.subMenuClass);
//       submenu.css("display", "none");
//       $(this).addClass(opt.subMenuParent);
//       $(this).addClass(opt.thSubMenuParent); // Add th-item-has-children class
//       $(this).children("a").append(opt.appendElement);
//     });

//     // Toggle Submenu
//     function toggleDropDown($element) {
//       var submenu = $element.children("ul");
//       if (submenu.length > 0) {
//         $element.toggleClass(opt.subMenuParentToggle);
//         submenu.slideToggle(opt.toggleSpeed);
//         submenu.toggleClass(opt.subMenuToggleClass);
//       }
//     }

//     // Submenu toggle Button
//     var itemHasChildren = "." + opt.thSubMenuParent + " > a";
//     $(itemHasChildren).each(function () {
//       $(this).on("click", function (e) {
//         e.preventDefault();
//         toggleDropDown($(this).parent());
//       });
//     });

//     // Menu Show & Hide On Toggle Btn click
//     $(opt.menuToggleBtn).each(function () {
//       $(this).on("click", function () {
//         menuToggle();
//       });
//     });

//     // Hide Menu On outside click
//     menu.on("click", function (e) {
//       e.stopPropagation();
//       menuToggle();
//     });

//     // Stop Hide full menu on menu click
//     menu.find("div").on("click", function (e) {
//       e.stopPropagation();
//     });
//   });
// };

// $(".th-menu-wrapper").thmobilemenu();
