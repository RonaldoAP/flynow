(function () {
  "use strict";

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* O <base> da página mantém os assets na rota /pv-cupom, mas faria os
     links de âncora perderem UTMs e rtkcid. Reaplicamos a query atual. */
  function preserveQueryOnHashLinks() {
    var pathAndQuery = window.location.pathname + window.location.search;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      link.setAttribute("href", pathAndQuery + hash);
    });
  }

  preserveQueryOnHashLinks();

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

  /* Faixa de relatos reais com post detalhado em modal. */
  var customerReviews = [
    {
      name: "Mariana A. S.",
      text: "Estou amando, é meu segundo frasco e eu estou amando 🫶🏻🩷🩷🩷",
      media: [
        {
          type: "video",
          src: "media/depoimentos/fernanda.mp4",
          poster: "img/depoimentos/poster-fernanda.webp",
          thumb: "img/depoimentos/poster-fernanda.webp",
        },
      ],
    },
    {
      name: "Patrícia M. F.",
      text: "O meu GHK-Cu da Divessence chegou hj, junto com o meu sérum de vitamina C e o protetor solar, tenho certeza que vou amar!",
      media: [
        {
          type: "video",
          src: "media/depoimentos/bruna.mp4",
          poster: "img/depoimentos/poster-bruna.webp",
          thumb: "img/depoimentos/poster-bruna.webp",
        },
      ],
    },
    {
      name: "Renata C.",
      text: "Amei que veio a escovinha junto, que linda. Já tô usando todo dia, mudou muito minha pele.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-3-1.webp",
          thumb: "img/reviews/review-3-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-3-2.webp",
          thumb: "img/reviews/review-3-2-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-3-3.webp",
          thumb: "img/reviews/review-3-3-thumb.webp",
        },
      ],
    },
    {
      name: "Juliana P. S.",
      text: "Comprei pela primeira vez e tô gostando mto. Tô me sentindo ótima, me olhando no espelho e me achando bonita de novo. Vou comprar novamente, vou virar cliente fixa.",
      media: [
        {
          type: "video",
          src: "media/depoimentos/claudia.mp4",
          poster: "img/depoimentos/poster-claudia.webp",
          thumb: "img/depoimentos/poster-claudia.webp",
        },
      ],
    },
    {
      name: "Adriana L.",
      text: "Quero compartilhar minha experiência com o GHK-Cu da Divessence. Estou muito satisfeita com o produto! Além de ter uma textura leve e de rápida absorção, ele me ajudou a recuperar a firmeza e o viço da minha pele. Tenho percebido as linhas de expressão mais suaves e o rosto visivelmente mais descansado, e estou gostando bastante dos resultados. O GHK-Cu da Divessence se tornou parte da minha rotina de cuidados, e a praticidade de usar em casa, sem precisar de procedimentos caros, é um grande diferencial. Recomendo para quem busca um produto de qualidade e quer cuidar mais da pele e da autoestima. Estou adorando a experiência e continuarei usando. Super aprovado! ⭐⭐⭐⭐⭐ 💖 GHK-Cu Divessence: firmeza, viço e autoestima renovada para a sua pele.",
      media: [
        {
          type: "video",
          src: "media/reviews/review-5.mp4",
          poster: "img/reviews/review-5-poster.webp",
          thumb: "img/reviews/review-5-thumb.webp",
        },
      ],
    },
    {
      name: "Camila R.",
      text: "Muitoooooo bom, eu amei demais 😍💙 Inclusive estou aguardando retorno da marca pra começar a divulgar 🫶🏻🥹",
      media: [
        {
          type: "video",
          src: "media/reviews/review-6.mp4",
          poster: "img/reviews/review-6-poster.webp",
          thumb: "img/reviews/review-6-thumb.webp",
        },
      ],
    },
    {
      name: "Vanessa M.",
      text: "Um produto maravilhoso, completo, tudo que eu precisava pra cuidar das minhas rugas, machas e flacidez.",
      media: [
        {
          type: "video",
          src: "media/reviews/review-7.mp4",
          poster: "img/reviews/review-7-poster.webp",
          thumb: "img/reviews/review-7-thumb.webp",
        },
      ],
    },
    {
      name: "Simone A.",
      text: "Estou amando muito, já fiz a minha segunda compra, mas não vou ficar só no GHK-Cu, vou querer os outros produtos da Divessence.",
      media: [
        {
          type: "video",
          src: "media/reviews/review-8.mp4",
          poster: "img/reviews/review-8-poster.webp",
          thumb: "img/reviews/review-8-thumb.webp",
        },
      ],
    },
    {
      name: "Luciana F.",
      text: "Chegou antes do prazo, realmente boa textura, comprare nuevamente!!",
      media: [
        {
          type: "image",
          src: "img/reviews/review-9.webp",
          thumb: "img/reviews/review-9-thumb.webp",
        },
      ],
    },
    {
      name: "Bruna S.",
      text: "Muito bom! chegou rapidinho.",
      media: [
        {
          type: "video",
          src: "media/reviews/review-10.mp4",
          poster: "img/reviews/review-10-poster.webp",
          thumb: "img/reviews/review-10-thumb.webp",
        },
      ],
    },
    {
      name: "Fabiana C.",
      text: "Textura: A textura é leve, absorve rápido, eu gostei. Desempenho: Fácil de aplicar, amei. Se eu te ajudei, curte meu comentário 🙏🏻💙",
      media: [
        {
          type: "image",
          src: "img/reviews/review-11-1.webp",
          thumb: "img/reviews/review-11-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-11-2.webp",
          thumb: "img/reviews/review-11-2-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-11-3.webp",
          thumb: "img/reviews/review-11-3-thumb.webp",
        },
      ],
    },
    {
      name: "Débora M.",
      text: "Chegou certinho igual o anúncio, espero cumprir cm o q diz…",
      media: [
        {
          type: "image",
          src: "img/reviews/review-12-1.webp",
          thumb: "img/reviews/review-12-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-12-2.webp",
          thumb: "img/reviews/review-12-2-thumb.webp",
        },
      ],
    },
    {
      name: "Tatiane R.",
      text: "Acabou de chegar, veio bem embalado e conforme o anúncio. Bom, vou começar a usar amanhã.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-13-1.webp",
          thumb: "img/reviews/review-13-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-13-2.webp",
          thumb: "img/reviews/review-13-2-thumb.webp",
        },
      ],
    },
    {
      name: "Priscila A.",
      text: "Chegou agora, ainda não usei mas parece muito bom, depois volto pra contar.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-14-1.webp",
          thumb: "img/reviews/review-14-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-14-2.webp",
          thumb: "img/reviews/review-14-2-thumb.webp",
        },
      ],
    },
    {
      name: "Elaine S.",
      text: "Desempenho surreal, gente do céu, maravilhoso. Eu usei e me surpreendeu, funciona 100%, nota 1.000,00.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-15-1.webp",
          thumb: "img/reviews/review-15-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-15-2.webp",
          thumb: "img/reviews/review-15-2-thumb.webp",
        },
      ],
    },
    {
      name: "Rosângela M.",
      text: "Chegou tudo dinheiro e bem rápido. Vou testa e depois volto pra contar, mais muita gente me falaram muito bem sobre ele.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-16-1.webp",
          thumb: "img/reviews/review-16-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-16-2.webp",
          thumb: "img/reviews/review-16-2-thumb.webp",
        },
      ],
    },
    {
      name: "Cristina L.",
      text: "Chegou super rápido, bem embalado e a embalagem original. Ainda não experimentei, mais ja estou ansiosa pra breve ver resultados dessa bb aqui.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-17-1.webp",
          thumb: "img/reviews/review-17-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-17-2.webp",
          thumb: "img/reviews/review-17-2-thumb.webp",
        },
      ],
    },
    {
      name: "Michele P.",
      text: "Kit: escolhe o de 3 potes. Ainda não testei, espero resultado como vejo nos vídeos.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-18-1.webp",
          thumb: "img/reviews/review-18-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-18-2.webp",
          thumb: "img/reviews/review-18-2-thumb.webp",
        },
      ],
    },
    {
      name: "Aline G.",
      text: "Super amei, resultados são incríveis, ver a diferença no primeiro uso, pele de bebê. Quem ainda não pediu seu peça já. Tenho certeza, assim como eu, vocês não vão arrepender.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-19-1.webp",
          thumb: "img/reviews/review-19-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-19-2.webp",
          thumb: "img/reviews/review-19-2-thumb.webp",
        },
      ],
    },
    {
      name: "Sandra R.",
      text: "Estou gostando do produto, chegou rápido, ainda não tem 1 mês q estou usando, mais já sinto a pele mais macia e o cheirinho é uma delícia.",
      media: [
        {
          type: "image",
          src: "img/reviews/review-20-1.webp",
          thumb: "img/reviews/review-20-1-thumb.webp",
        },
      ],
    },
    {
      name: "Carla D.",
      text: "Estou usando tem 2 meses e já vejo diferença, principalmente nas linhas da testa. Já tentei retinol e minha pele descascava toda, esse foi o único que não me irritou, tenho pele muito sensível 😓",
      media: [
        {
          type: "image",
          src: "img/reviews/review-21-1.webp",
          thumb: "img/reviews/review-21-1-thumb.webp",
        },
        {
          type: "image",
          src: "img/reviews/review-21-2.webp",
          thumb: "img/reviews/review-21-2-thumb.webp",
        },
      ],
    },
  ];

  var reviewShowcase = document.querySelector("[data-review-showcase]");
  var customerReviewModal = document.querySelector(
    "[data-customer-review-modal]",
  );

  if (reviewShowcase && customerReviewModal) {
    var reviewRows = Array.prototype.slice.call(
      reviewShowcase.querySelectorAll("[data-review-row]"),
    );
    var modalName = customerReviewModal.querySelector(
      "[data-customer-review-name]",
    );
    var modalText = customerReviewModal.querySelector(
      "[data-customer-review-text]",
    );
    var modalImage = customerReviewModal.querySelector(
      "[data-customer-review-image]",
    );
    var modalVideo = customerReviewModal.querySelector(
      "[data-customer-review-video]",
    );
    var modalThumbnails = customerReviewModal.querySelector(
      "[data-customer-review-thumbnails]",
    );
    var activeReviewIndex = 0;
    var activeMediaIndex = 0;
    var lastReviewTrigger = null;

    function createReviewCard(review, index) {
      var card = document.createElement("button");
      var media = document.createElement("span");
      var avatar = document.createElement("img");
      var body = document.createElement("span");
      var meta = document.createElement("span");
      var name = document.createElement("strong");
      var verified = document.createElement("span");
      var stars = document.createElement("span");
      var excerpt = document.createElement("p");
      var primaryMedia = review.media[0];

      card.type = "button";
      card.className = "mini-review";
      card.setAttribute("aria-label", "Abrir depoimento de " + review.name);
      card.dataset.customerReviewIndex = String(index);

      media.className = "mini-review__media";
      avatar.className = "mini-review__avatar";
      avatar.src = primaryMedia.thumb || primaryMedia.poster || primaryMedia.src;
      avatar.alt = "";
      avatar.width = 68;
      avatar.height = 68;
      avatar.loading = "lazy";
      media.appendChild(avatar);

      if (primaryMedia.type === "video") {
        var play = document.createElement("span");
        play.className = "mini-review__play";
        play.setAttribute("aria-hidden", "true");
        play.textContent = "▶";
        media.appendChild(play);
      }

      body.className = "mini-review__body";
      meta.className = "mini-review__meta";
      name.textContent = review.name;
      verified.className = "mini-review__verified";
      verified.setAttribute("aria-label", "Cliente verificada");
      verified.textContent = "✓";
      meta.appendChild(name);
      meta.appendChild(verified);

      stars.className = "stars";
      stars.setAttribute("aria-hidden", "true");
      stars.textContent = "★★★★★";
      excerpt.textContent = review.text;
      body.appendChild(meta);
      body.appendChild(stars);
      body.appendChild(excerpt);

      card.appendChild(media);
      card.appendChild(body);
      return card;
    }

    var reviewRowIndexes = [
      customerReviews.map(function (_, index) {
        return index;
      }).slice(0, 11),
      customerReviews.map(function (_, index) {
        return index;
      }).slice(11),
    ];

    reviewRows.forEach(function (row, rowIndex) {
      var group = document.createElement("div");
      group.className = "reviews-strip__loop-group";

      reviewRowIndexes[rowIndex].forEach(function (reviewIndex) {
        group.appendChild(
          createReviewCard(customerReviews[reviewIndex], reviewIndex),
        );
      });

      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("button").forEach(function (button) {
        button.tabIndex = -1;
      });

      row.appendChild(group);
      row.appendChild(clone);
    });

    function stopModalVideo() {
      if (!modalVideo) return;
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.removeAttribute("poster");
      modalVideo.load();
    }

    function renderReviewMedia() {
      var review = customerReviews[activeReviewIndex];
      var item = review.media[activeMediaIndex];
      if (!item || !modalImage || !modalVideo) return;

      stopModalVideo();
      modalImage.hidden = true;
      modalVideo.hidden = true;

      if (item.type === "video") {
        modalVideo.poster = item.poster || item.thumb || "";
        modalVideo.src = item.src;
        modalVideo.hidden = false;
      } else {
        modalImage.src = item.src;
        modalImage.alt =
          "Imagem " +
          String(activeMediaIndex + 1) +
          " do depoimento de " +
          review.name;
        modalImage.hidden = false;
      }

      Array.prototype.slice
        .call(modalThumbnails.querySelectorAll("button"))
        .forEach(function (button, index) {
          button.classList.toggle("is-active", index === activeMediaIndex);
          button.setAttribute(
            "aria-pressed",
            index === activeMediaIndex ? "true" : "false",
          );
        });
    }

    function renderReviewThumbnails(review) {
      modalThumbnails.replaceChildren();

      review.media.forEach(function (item, index) {
        var button = document.createElement("button");
        var image = document.createElement("img");
        button.type = "button";
        button.className = "customer-review-modal__thumbnail";
        button.setAttribute(
          "aria-label",
          "Abrir mídia " + String(index + 1) + " de " + String(review.media.length),
        );
        image.src = item.thumb || item.poster || item.src;
        image.alt = "";
        image.loading = "lazy";
        button.appendChild(image);

        if (item.type === "video") {
          var play = document.createElement("b");
          play.setAttribute("aria-hidden", "true");
          play.textContent = "▶";
          button.appendChild(play);
        }

        button.addEventListener("click", function () {
          activeMediaIndex = index;
          renderReviewMedia();
        });
        modalThumbnails.appendChild(button);
      });
    }

    function renderCustomerReview(index) {
      activeReviewIndex =
        (index + customerReviews.length) % customerReviews.length;
      activeMediaIndex = 0;

      var review = customerReviews[activeReviewIndex];
      modalName.textContent = review.name;
      modalText.textContent = review.text;
      renderReviewThumbnails(review);
      renderReviewMedia();
    }

    function openCustomerReview(index, trigger) {
      lastReviewTrigger = trigger || document.activeElement;
      renderCustomerReview(index);
      customerReviewModal.hidden = false;
      document.body.classList.add("customer-review-modal-open");

      window.requestAnimationFrame(function () {
        var closeButton = customerReviewModal.querySelector(
          "[data-customer-review-close]:not(.customer-review-modal__backdrop)",
        );
        if (closeButton) closeButton.focus();
      });
    }

    function closeCustomerReview() {
      stopModalVideo();
      customerReviewModal.hidden = true;
      document.body.classList.remove("customer-review-modal-open");
      if (lastReviewTrigger && typeof lastReviewTrigger.focus === "function") {
        lastReviewTrigger.focus({ preventScroll: true });
      }

      /* O foco retorna ao card por acessibilidade, mas a esteira deve continuar. */
      reviewLoopFocused = false;
      reviewLoopPauseUntil = 0;
      reviewLoopLastFrame = 0;
    }

    reviewShowcase.addEventListener("click", function (event) {
      var card = event.target.closest("[data-customer-review-index]");
      if (!card) return;
      openCustomerReview(
        Number(card.getAttribute("data-customer-review-index")),
        card,
      );
    });

    reviewShowcase
      .querySelectorAll("[data-review-scroll]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          reviewLoopPauseUntil = Date.now() + 2200;
          var direction = Number(button.getAttribute("data-review-scroll")) || 1;
          reviewRows.forEach(function (row) {
            row.scrollBy({
              left: direction * 346,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          });
        });
      });

    var reviewLoopPauseUntil = 0;
    var reviewLoopFocused = false;
    var reviewLoopLastFrame = 0;
    var reviewLoopSpeed = 29 / 1000;
    var reviewLoopWidths = [];

    function getReviewLoopWidth(row) {
      var group = row.querySelector(".reviews-strip__loop-group");
      if (!group) return 0;
      var styles = window.getComputedStyle(row);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return group.getBoundingClientRect().width + gap;
    }

    function prepareReviewLoop() {
      reviewRows.forEach(function (row, index) {
        var loopWidth = getReviewLoopWidth(row);
        reviewLoopWidths[index] = loopWidth;
        if (index === 1 && loopWidth > 0 && row.scrollLeft < 1) {
          row.scrollLeft = loopWidth;
        }
      });
    }

    function moveReviewLoop(timestamp) {
      if (!reviewLoopLastFrame) reviewLoopLastFrame = timestamp;
      var elapsed = Math.min(64, timestamp - reviewLoopLastFrame);
      reviewLoopLastFrame = timestamp;

      var shouldPause =
        reviewLoopFocused ||
        Date.now() < reviewLoopPauseUntil ||
        !customerReviewModal.hidden ||
        document.hidden;

      if (!shouldPause) {
        reviewRows.forEach(function (row, index) {
          var loopWidth = reviewLoopWidths[index];
          if (!loopWidth) return;

          var direction = index === 0 ? 1 : -1;
          row.scrollLeft += direction * elapsed * reviewLoopSpeed;

          if (direction > 0 && row.scrollLeft >= loopWidth) {
            row.scrollLeft -= loopWidth;
          } else if (direction < 0 && row.scrollLeft <= 0) {
            row.scrollLeft += loopWidth;
          }
        });
      }

      window.requestAnimationFrame(moveReviewLoop);
    }

    if (!reducedMotion) {
      reviewShowcase.classList.add("is-auto-scrolling");
      window.requestAnimationFrame(function () {
        prepareReviewLoop();
        window.requestAnimationFrame(moveReviewLoop);
      });

      reviewShowcase.addEventListener("focusin", function () {
        reviewLoopFocused = true;
      });
      reviewShowcase.addEventListener("focusout", function (event) {
        reviewLoopFocused = reviewShowcase.contains(event.relatedTarget);
      });
      reviewShowcase.addEventListener("pointerdown", function () {
        reviewLoopPauseUntil = Date.now() + 3000;
      });
      window.addEventListener("pointerup", function () {
        reviewLoopPauseUntil = Math.max(
          reviewLoopPauseUntil,
          Date.now() + 1800,
        );
      });
      window.addEventListener("resize", function () {
        reviewLoopPauseUntil = Date.now() + 300;
        prepareReviewLoop();
      });
    }

    customerReviewModal
      .querySelectorAll("[data-customer-review-close]")
      .forEach(function (button) {
        button.addEventListener("click", closeCustomerReview);
      });

    customerReviewModal
      .querySelector("[data-customer-review-previous]")
      .addEventListener("click", function () {
        renderCustomerReview(activeReviewIndex - 1);
      });

    customerReviewModal
      .querySelector("[data-customer-review-next]")
      .addEventListener("click", function () {
        renderCustomerReview(activeReviewIndex + 1);
      });

    customerReviewModal
      .querySelector("[data-customer-review-cta]")
      .addEventListener("click", closeCustomerReview);

    document.addEventListener("keydown", function (event) {
      if (customerReviewModal.hidden) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeCustomerReview();
      } else if (event.key === "ArrowLeft" && event.target !== modalVideo) {
        renderCustomerReview(activeReviewIndex - 1);
      } else if (event.key === "ArrowRight" && event.target !== modalVideo) {
        renderCustomerReview(activeReviewIndex + 1);
      }
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
    var unlockRatio = 0.6;

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
      if (!scratched && hitCount / totalCells >= unlockRatio) unlockScratch();
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
