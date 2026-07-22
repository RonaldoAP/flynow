(function () {
  "use strict";

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Entrada suave dos blocos editoriais. */
  var reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    reveals.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* Abas de depoimentos: midia enviada pelas clientes e relatos em texto. */
  document.querySelectorAll("[data-testimonial-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(
      root.querySelectorAll("[data-testimonial-tab]"),
    );
    var panels = Array.prototype.slice.call(
      root.querySelectorAll("[data-testimonial-panel]"),
    );

    function activateTestimonialTab(selectedTab, moveFocus) {
      var target = selectedTab.getAttribute("data-testimonial-tab");

      tabs.forEach(function (tab) {
        var active = tab === selectedTab;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });

      panels.forEach(function (panel) {
        var active = panel.getAttribute("data-testimonial-panel") === target;
        panel.hidden = !active;

        if (!active) {
          panel.querySelectorAll("video").forEach(function (video) {
            video.pause();
          });
        }

        if (active) {
          var viewport = panel.querySelector("[data-text-testimonials-viewport]");
          if (viewport) {
            window.requestAnimationFrame(function () {
              viewport.dispatchEvent(new Event("scroll"));
            });
          }
        }
      });

      if (moveFocus) selectedTab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTestimonialTab(tab, false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activateTestimonialTab(tabs[nextIndex], true);
      });
    });

    var testimonialVideos = Array.prototype.slice.call(
      root.querySelectorAll(".media-testimonial video"),
    );

    function loadTestimonialVideo(video, shouldPlay) {
      if (!video) return;

      var card = video.closest(".media-testimonial");
      var source = video.querySelector("source[data-src]");

      if (source) {
        source.src = source.getAttribute("data-src");
        source.removeAttribute("data-src");
        video.load();
      }

      if (card) card.classList.add("is-video-loaded");

      if (shouldPlay) {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            /* Os controles nativos continuam disponiveis se o autoplay for bloqueado. */
          });
        }
      }
    }

    root.querySelectorAll("[data-lazy-testimonial-play]").forEach(function (button) {
      button.addEventListener("click", function () {
        var card = button.closest(".media-testimonial");
        loadTestimonialVideo(
          card && card.querySelector("[data-lazy-testimonial-video]"),
          true,
        );
      });
    });

    testimonialVideos.forEach(function (selectedVideo) {
      selectedVideo.addEventListener("play", function () {
        testimonialVideos.forEach(function (video) {
          if (video !== selectedVideo) video.pause();
        });
      });
    });
  });

  /* Galeria com as tres fotos enviadas pela mesma cliente. */
  document.querySelectorAll("[data-photo-testimonial-gallery]").forEach(function (gallery) {
    var mainImage = gallery.querySelector("[data-photo-testimonial-main]");
    var count = gallery.querySelector("[data-photo-testimonial-count]");
    var buttons = Array.prototype.slice.call(
      gallery.querySelectorAll("[data-photo-testimonial-src]"),
    );

    if (!mainImage || !buttons.length) return;

    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        mainImage.src = button.getAttribute("data-photo-testimonial-src");
        mainImage.alt = button.getAttribute("data-photo-testimonial-alt") || "";

        buttons.forEach(function (item) {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });

        if (count) {
          count.textContent =
            "Foto " + String(index + 1) + " de " + String(buttons.length);
        }
      });
    });
  });

  /* Carrossel dos 20 depoimentos em texto. */
  document.querySelectorAll("[data-text-testimonials]").forEach(function (carousel) {
    var viewport = carousel.querySelector("[data-text-testimonials-viewport]");
    var track = carousel.querySelector(".text-testimonials__track");
    var cards = Array.prototype.slice.call(
      carousel.querySelectorAll(".text-testimonial"),
    );
    var previousButton = carousel.querySelector("[data-text-testimonials-prev]");
    var nextButton = carousel.querySelector("[data-text-testimonials-next]");
    var status = carousel.querySelector("[data-text-testimonials-status]");
    var updateFrame = 0;

    if (!viewport || !track || !cards.length || !previousButton || !nextButton) return;

    function getGap() {
      var styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap || "0") || 0;
    }

    function getStep() {
      return cards[0].getBoundingClientRect().width + getGap();
    }

    function updateCarousel() {
      updateFrame = 0;
      if (!viewport.clientWidth) return;

      var step = getStep();
      if (!step) return;

      var visibleCards = Math.max(
        1,
        Math.round((viewport.clientWidth + getGap()) / step),
      );
      var currentIndex = Math.min(
        cards.length - 1,
        Math.max(0, Math.round(viewport.scrollLeft / step)),
      );
      var lastVisible = Math.min(cards.length, currentIndex + visibleCards);
      var maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);

      previousButton.disabled = viewport.scrollLeft <= 2;
      nextButton.disabled = viewport.scrollLeft >= maxScroll - 2;

      if (status) {
        status.textContent =
          String(currentIndex + 1) + "–" + String(lastVisible) + " de " + String(cards.length);
      }
    }

    function requestUpdate() {
      if (updateFrame) return;
      updateFrame = window.requestAnimationFrame(updateCarousel);
    }

    function moveCarousel(direction) {
      viewport.scrollBy({ left: direction * getStep(), behavior: "smooth" });
    }

    previousButton.addEventListener("click", function () {
      moveCarousel(-1);
    });
    nextButton.addEventListener("click", function () {
      moveCarousel(1);
    });
    viewport.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateCarousel();
  });

  /* Checkout incorporado: fica oculto ate o CTA de disponibilidade. */
  var inlineCheckout = document.querySelector("[data-inline-checkout]");
  var checkoutTrigger = document.querySelector("[data-reveal-checkout]");
  var checkoutEnhanced = false;
  var resizeInlineScratch = function () {};

  function enhanceInlineCheckout() {
    if (!inlineCheckout || checkoutEnhanced) return;
    checkoutEnhanced = true;

    inlineCheckout.querySelectorAll(".ocard").forEach(function (card) {
      var input = card.querySelector("input[data-img]");
      var radio = card.querySelector(".ocard__radio");
      if (!input || !radio || !input.dataset.img) return;

      var thumb = document.createElement("span");
      var image = document.createElement("img");
      thumb.className = "ocard__thumb";
      image.src = input.dataset.img;
      image.alt = "";
      image.loading = "lazy";
      thumb.appendChild(image);
      radio.insertAdjacentElement("afterend", thumb);
    });
  }

  function setupInlineScratch() {
    if (!inlineCheckout) return function () {};

    var scratch = inlineCheckout.querySelector("[data-inline-scratch]");
    var canvas = inlineCheckout.querySelector("[data-inline-scratch-cover]");
    if (!scratch || !canvas || !canvas.getContext) return function () {};

    var context = canvas.getContext("2d");
    var scratched = false;
    var pressing = false;
    var cssWidth = 0;
    var cssHeight = 0;
    var brushRadius = 30;
    var lastPoint = null;
    var activePointerId = null;
    var gridColumns = 10;
    var gridRows = 5;
    var hitCells = {};
    var hitCount = 0;
    var totalCells = gridColumns * gridRows;

    function paintCover(width, height) {
      var gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#8c949e");
      gradient.addColorStop(0.5, "#c4cbd3");
      gradient.addColorStop(1, "#98a0aa");
      context.globalCompositeOperation = "source-over";
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,0.18)";

      for (var index = 0; index < 60; index += 1) {
        var x = (index * 53) % Math.max(1, Math.floor(width));
        var y = (index * 97) % Math.max(1, Math.floor(height));
        context.beginPath();
        context.arc(x, y, 1.4, 0, Math.PI * 2);
        context.fill();
      }
    }

    function sizeCanvas() {
      if (scratched || inlineCheckout.hidden) return;
      var rect = scratch.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;

      cssWidth = rect.width;
      cssHeight = rect.height;
      brushRadius = Math.max(30, Math.min(42, rect.width * 0.09));
      hitCells = {};
      hitCount = 0;
      lastPoint = null;

      var density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * density);
      canvas.height = Math.round(rect.height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      paintCover(rect.width, rect.height);
      canvas.style.background = "transparent";
    }

    function markCells(x, y) {
      if (!cssWidth || !cssHeight) return;
      var cellWidth = cssWidth / gridColumns;
      var cellHeight = cssHeight / gridRows;
      var minColumn = Math.max(0, Math.floor((x - brushRadius) / cellWidth));
      var maxColumn = Math.min(
        gridColumns - 1,
        Math.floor((x + brushRadius) / cellWidth),
      );
      var minRow = Math.max(0, Math.floor((y - brushRadius) / cellHeight));
      var maxRow = Math.min(
        gridRows - 1,
        Math.floor((y + brushRadius) / cellHeight),
      );
      var reach = brushRadius + Math.max(cellWidth, cellHeight) * 0.35;

      for (var row = minRow; row <= maxRow; row += 1) {
        for (var column = minColumn; column <= maxColumn; column += 1) {
          var centerX = (column + 0.5) * cellWidth;
          var centerY = (row + 0.5) * cellHeight;
          var deltaX = centerX - x;
          var deltaY = centerY - y;
          if (deltaX * deltaX + deltaY * deltaY > reach * reach) continue;

          var key = row * gridColumns + column;
          if (!hitCells[key]) {
            hitCells[key] = 1;
            hitCount += 1;
          }
        }
      }
    }

    function eraseAt(x, y) {
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(x, y, brushRadius, 0, Math.PI * 2);
      context.fill();
      markCells(x, y);
    }

    function eraseLine(from, to) {
      var deltaX = to.x - from.x;
      var deltaY = to.y - from.y;
      var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var steps = Math.max(1, Math.ceil(distance / (brushRadius * 0.55)));

      for (var step = 1; step <= steps; step += 1) {
        eraseAt(
          from.x + (deltaX * step) / steps,
          from.y + (deltaY * step) / steps,
        );
      }
    }

    function unlockScratch() {
      if (scratched) return;
      scratched = true;
      pressing = false;
      lastPoint = null;
      scratch.classList.add("is-revealed");
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("tabindex", "-1");
      inlineCheckout.querySelectorAll(".prize").forEach(function (prize) {
        prize.classList.remove("is-locked");
      });
    }

    function maybeUnlock() {
      if (!scratched && hitCount / totalCells >= 0.28) unlockScratch();
    }

    function pointFromEvent(event) {
      var rect = canvas.getBoundingClientRect();
      var touch = (event.touches && event.touches[0]) || event;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    function onPointerDown(event) {
      if (scratched || (typeof event.button === "number" && event.button !== 0)) {
        return;
      }

      pressing = true;
      activePointerId =
        typeof event.pointerId === "number" ? event.pointerId : null;
      if (activePointerId !== null && canvas.setPointerCapture) {
        canvas.setPointerCapture(activePointerId);
      }
      canvas.classList.add("is-scratching");
      lastPoint = pointFromEvent(event);
      eraseAt(lastPoint.x, lastPoint.y);
      maybeUnlock();
      event.preventDefault();
    }

    function onPointerMove(event) {
      if (!pressing || scratched) return;
      var point = pointFromEvent(event);
      eraseLine(lastPoint || point, point);
      lastPoint = point;
      maybeUnlock();
      event.preventDefault();
    }

    function onPointerUp() {
      if (!pressing) return;
      pressing = false;
      lastPoint = null;
      canvas.classList.remove("is-scratching");
      if (
        activePointerId !== null &&
        canvas.hasPointerCapture &&
        canvas.hasPointerCapture(activePointerId)
      ) {
        canvas.releasePointerCapture(activePointerId);
      }
      activePointerId = null;
      maybeUnlock();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      unlockScratch();
    });
    window.addEventListener("resize", sizeCanvas);

    return sizeCanvas;
  }

  if (inlineCheckout) {
    resizeInlineScratch = setupInlineScratch();
  }

  if (inlineCheckout && checkoutTrigger) {
    checkoutTrigger.addEventListener("click", function (event) {
      event.preventDefault();

      var firstReveal = inlineCheckout.hidden;
      inlineCheckout.hidden = false;
      inlineCheckout.setAttribute("aria-hidden", "false");
      checkoutTrigger.setAttribute("aria-expanded", "true");

      if (firstReveal) {
        inlineCheckout.classList.add("is-revealed");
        enhanceInlineCheckout();
      }

      window.requestAnimationFrame(function () {
        resizeInlineScratch();
        inlineCheckout.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });

        window.setTimeout(function () {
          var title = document.getElementById("checkout-inline-title");
          if (title) title.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 650);
      });
    });
  }

  /* Countdown persistente: 30 minutos a partir da primeira visita. */
  var hoursNode = document.querySelector("[data-hours]");
  var minutesNode = document.querySelector("[data-minutes]");
  var secondsNode = document.querySelector("[data-seconds]");
  var countdownDuration = 30 * 60 * 1000;
  var countdownStorageKey = "divessence-7-motivos-deadline-v2";

  if (hoursNode && minutesNode && secondsNode) {
    var now = Date.now();
    var deadline = 0;

    try {
      deadline = Number(window.localStorage.getItem(countdownStorageKey)) || 0;
    } catch (error) {
      deadline = 0;
    }

    if (!deadline) {
      deadline = now + countdownDuration;
      try {
        window.localStorage.setItem(countdownStorageKey, String(deadline));
      } catch (error) {
        /* O timer continua na sessao quando o storage estiver indisponivel. */
      }
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function renderCountdown() {
      var remaining = Math.max(0, deadline - Date.now());
      var totalSeconds = Math.ceil(remaining / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      hoursNode.textContent = pad(hours);
      minutesNode.textContent = pad(minutes);
      secondsNode.textContent = pad(seconds);

      return remaining;
    }

    renderCountdown();
    var countdownInterval = window.setInterval(function () {
      if (renderCountdown() > 0) return;
      window.clearInterval(countdownInterval);
    }, 1000);
  }

  /* CTA compacto depois que o visitante avanca pelos primeiros motivos. */
  var stickyBuy = document.querySelector("[data-sticky-buy]");
  var offer = document.getElementById("comprar");

  function updateStickyBuy() {
    if (!stickyBuy || !offer) return;
    var offerTop = offer.getBoundingClientRect().top;
    var shouldShow = window.scrollY > 900 && offerTop > window.innerHeight * 0.45;
    stickyBuy.classList.toggle("is-visible", shouldShow);
  }

  window.addEventListener("scroll", updateStickyBuy, { passive: true });
  window.addEventListener("resize", updateStickyBuy);
  updateStickyBuy();
})();
