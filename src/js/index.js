$(document).ready(function() {
  /*****************************
   *  MOBILE NAV
   *****************************/

  /* Elements */
  const menuToggler = document.querySelector(".menu-toggler");
  const mobileNav = document.querySelector(".mobile-nav");

  /* Functions */
  function toggleMobileNav() {
    if (mobileNav.classList.contains("hidden")) {
      mobileNav.classList.remove("hidden");
      mobileNav.classList.add("mobile-nav-active");
      menuToggler.classList.add("mobile-nav-open");
    } else {
      mobileNav.classList.add("hidden");
      mobileNav.classList.remove("mobile-nav-active");
      menuToggler.classList.remove("mobile-nav-open");
    }
  }

  function hideMobileNav(e) {
    const windowWidth = e.currentTarget.innerWidth;
    const breakpoint = 1024;
    if (windowWidth > breakpoint) {
      mobileNav.style.display = "none";
    } else {
      mobileNav.style.display = "block";
    }
  }

  /* Attach Event Handlers */
  menuToggler.addEventListener("click", toggleMobileNav);
  window.addEventListener("resize", hideMobileNav);

  /* init */
  $(".hero-slider").slick({
    cssEase: "ease-in-out",
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  });

  /* Removes slider from stuttering when resizing browser */
  $(window).resize(function() {
    $(".hero-slider")[0].slick.refresh();
  });

  /*****************************
   *  SMOOTH SCROLL
   *****************************/

  var html = document.documentElement;
  var body = document.body;

  var scroller = {
    target: document.querySelector(".page-content"),
    ease: 0.1, // <= scroll speed
    endY: 0,
    y: 0,
    resizeRequest: 1,
    scrollRequest: 0
  };

  var requestId = null;

  TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
  });

  window.addEventListener("load", onLoad);

  function onLoad() {
    updateScroller();
    window.focus();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll);
  }

  function updateScroller() {
    var resized = scroller.resizeRequest > 0;

    if (resized) {
      var height = scroller.target.clientHeight;
      body.style.height = height + "px";
      scroller.resizeRequest = 0;
    }

    var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

    scroller.endY = scrollY;
    scroller.y += (scrollY - scroller.y) * scroller.ease;

    if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
      scroller.y = scrollY;
      scroller.scrollRequest = 0;
    }

    TweenLite.set(scroller.target, {
      y: -scroller.y
    });

    requestId =
      scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
  }

  function onScroll() {
    scroller.scrollRequest++;
    if (!requestId) {
      requestId = requestAnimationFrame(updateScroller);
    }
  }

  function onResize() {
    scroller.resizeRequest++;
    if (!requestId) {
      requestId = requestAnimationFrame(updateScroller);
    }
  }
});
