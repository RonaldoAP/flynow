/*
  PENDÊNCIA EXTERNA — preencher apenas com o dado oficial:
  - BACK_REDIRECT_URL: link da página de backredirect, se houver.
*/
const VSL_SCRIPT_URL =
  "https://scripts.converteai.net/7519d23b-8afe-41cb-99c7-d411e4dcdb71/players/6a8f40f10f7f24254099cf0e/v4/player.js";
const OFFER_REVEAL_DELAY_SECONDS = 36 * 60 + 17;
const OFFER_TIMER_DURATION_SECONDS = 20 * 60;
const REDTRACK_ORIGIN = "https://red.track.divessencebeauty.com.br";

const CHECKOUT_URLS = {
  six: `${REDTRACK_ORIGIN}/click/3`,
  three: `${REDTRACK_ORIGIN}/click/2`,
  one: `${REDTRACK_ORIGIN}/click/1`,
};

const BACK_REDIRECT_URL = ""; // link backredirect aqui
const BACK_REDIRECT_PRESERVE_QUERY = true;

let pitchStateHandled = false;
let offerTimerInterval = null;

function mergeCurrentQueryParams(rawUrl) {
  if (!rawUrl) return "";

  try {
    const target = new URL(rawUrl, window.location.href);
    const currentParams = new URLSearchParams(window.location.search);

    currentParams.forEach((value, key) => {
      if (key === "preview" || key === "reveal") return;
      if (!target.searchParams.has(key)) target.searchParams.append(key, value);
    });

    return target.toString();
  } catch (error) {
    return rawUrl;
  }
}

function initVideoPlayer() {
  if (!VSL_SCRIPT_URL) return;

  const playerShell = document.querySelector("#vsl-player");
  const playerIdMatch = VSL_SCRIPT_URL.match(/\/players\/([^/]+)\//);
  const playerId = playerIdMatch ? playerIdMatch[1] : "";

  if (playerShell && playerId) {
    playerShell.classList.add("has-vturb-player");
    playerShell.innerHTML = "";

    const player = document.createElement("vturb-smartplayer");
    player.id = `vid-${playerId}`;
    player.setAttribute("original-id", `vid-${playerId}`);
    player.setAttribute("vturb-player-intersection-element", "");
    player.style.cssText =
      "display:block;margin:0 auto;width:100%;max-width:400px;";

    const preloadSlot = document.createElement("div");
    preloadSlot.className = "vturb-player-placeholder";
    preloadSlot.style.cssText =
      "position:relative;width:100%;padding:133.33333333333331% 0 0;z-index:0;background:#000;";
    player.appendChild(preloadSlot);
    playerShell.appendChild(player);
  }

  const script = document.createElement("script");
  script.src = VSL_SCRIPT_URL;
  script.async = true;
  document.head.appendChild(script);
}

function isElementVisible(element) {
  if (!element) return false;
  const styles = window.getComputedStyle(element);
  return styles.display !== "none" && styles.visibility !== "hidden";
}

function hideInitialEditorialElements() {
  const comments = document.querySelector("#viewer-comments");
  const footer = document.querySelector("#program-footer");
  const activeElement = document.activeElement;
  const focusWasInComments = Boolean(
    comments && activeElement && comments.contains(activeElement),
  );

  if (comments) comments.hidden = true;
  if (footer) footer.hidden = true;

  return focusWasInComments;
}

function renderOfferTimer(timer, remainingSeconds) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const minutesNode = timer.querySelector("[data-countdown-minutes]");
  const secondsNode = timer.querySelector("[data-countdown-seconds]");
  const timerHeading = timer
    .closest(".offer-timer")
    ?.querySelector(".offer-timer__copy strong");

  if (minutesNode) minutesNode.textContent = String(minutes).padStart(2, "0");
  if (secondsNode) secondsNode.textContent = String(seconds).padStart(2, "0");

  timer.setAttribute(
    "aria-label",
    remainingSeconds > 0
      ? `${minutes} minutos e ${seconds} segundos restantes`
      : "Tempo encerrado",
  );
  timer.classList.toggle("is-expired", remainingSeconds === 0);
  if (timerHeading) {
    timerHeading.textContent =
      remainingSeconds > 0 ? "Tempo restante" : "Sessão encerrada";
  }
}

function startOfferTimer() {
  const timer = document.querySelector("#offer-countdown");
  if (!timer || timer.dataset.started === "true") return;

  timer.dataset.started = "true";
  const endTime = Date.now() + OFFER_TIMER_DURATION_SECONDS * 1000;

  const tick = () => {
    const remainingSeconds = Math.max(
      0,
      Math.ceil((endTime - Date.now()) / 1000),
    );

    renderOfferTimer(timer, remainingSeconds);

    if (remainingSeconds === 0 && offerTimerInterval) {
      window.clearInterval(offerTimerInterval);
      offerTimerInterval = null;
    }
  };

  tick();
  offerTimerInterval = window.setInterval(tick, 1000);
}

function handlePitchRevealed({ scroll = true } = {}) {
  const gate = document.querySelector("#pitch-gate");
  if (!isElementVisible(gate)) return;

  gate.removeAttribute("aria-hidden");
  document.body.classList.add("pitch-revealed", "offer-revealed");
  const focusWasInComments = hideInitialEditorialElements();
  const kitsTitle = document.querySelector("#kits-title");
  const pitchStatus = document.querySelector("#pitch-status");
  startOfferTimer();

  if (pitchStatus && !pitchStateHandled) {
    pitchStatus.textContent = "A oferta e os kits foram liberados.";
  }

  if (focusWasInComments && kitsTitle instanceof HTMLElement) {
    kitsTitle.focus({ preventScroll: true });
  }

  if (!pitchStateHandled && scroll) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gate.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  pitchStateHandled = true;
  window.setTimeout(refreshRevealAnimations, 60);
}

function revealPitch({ scroll = true } = {}) {
  const gate = document.querySelector("#pitch-gate");
  if (!gate) return;

  gate.hidden = false;
  gate.classList.remove("esconder");
  gate.style.removeProperty("display");
  gate.removeAttribute("aria-hidden");
  handlePitchRevealed({ scroll });
}

function connectPlayerReveal(player) {
  if (!player || typeof player.displayHiddenElements !== "function") {
    return false;
  }

  player.displayHiddenElements(
    OFFER_REVEAL_DELAY_SECONDS,
    [".esconder"],
    {
      persist: true,
      callback: () => revealPitch({ scroll: true }),
    },
  );

  return true;
}

function attachPlayerReveal() {
  if (!OFFER_REVEAL_DELAY_SECONDS) return;

  const isVturbPlayer = /\/players\/[^/]+\//.test(VSL_SCRIPT_URL);

  if (!isVturbPlayer) {
    window.setTimeout(
      () => revealPitch({ scroll: true }),
      OFFER_REVEAL_DELAY_SECONDS * 1000,
    );
    return;
  }

  const connectCurrentPlayer = () => {
    const player = document.querySelector("vturb-smartplayer");
    if (!player) return false;
    if (connectPlayerReveal(player)) return true;

    player.addEventListener(
      "player:ready",
      () => connectPlayerReveal(player),
      { once: true },
    );
    return true;
  };

  if (connectCurrentPlayer()) return;

  const playerObserver = new MutationObserver(() => {
    if (connectCurrentPlayer()) playerObserver.disconnect();
  });

  playerObserver.observe(document.body, { childList: true, subtree: true });
}

function attachPitchObserver() {
  const gate = document.querySelector("#pitch-gate");
  if (!gate) return;

  const checkState = () => {
    if (!gate.classList.contains("esconder")) {
      revealPitch({ scroll: true });
      return;
    }

    if (isElementVisible(gate)) {
      handlePitchRevealed({ scroll: true });
    }
  };

  new MutationObserver(checkState).observe(gate, {
    attributes: true,
    attributeFilter: ["class", "style", "aria-hidden", "hidden"],
  });
}

function initCheckoutLinks() {
  document.querySelectorAll("[data-checkout]").forEach((link) => {
    const checkoutUrl = CHECKOUT_URLS[link.dataset.checkout];

    if (!checkoutUrl) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
      link.setAttribute("title", "Link de compra ainda não configurado");
      link.classList.add("is-disabled");
      link.addEventListener("click", (event) => event.preventDefault());
      return;
    }

    link.href = mergeCurrentQueryParams(checkoutUrl);
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
    link.removeAttribute("title");
    link.classList.remove("is-disabled");
  });
}

function initRedTrackCheckoutTracking() {
  const clickId = new URLSearchParams(window.location.search).get("rtkcid");
  if (!clickId) return;

  const postbackUrl = new URL("/postback", REDTRACK_ORIGIN);
  postbackUrl.searchParams.set("clickid", clickId);
  postbackUrl.searchParams.set("type", "InitiateCheckout");

  document.querySelectorAll(".smartplayer-click-event").forEach((link) => {
    link.addEventListener("click", () => {
      window
        .fetch(postbackUrl.toString(), {
          method: "GET",
          keepalive: true,
          mode: "no-cors",
        })
        .catch(() => {
          // O redirecionamento do checkout não deve ser bloqueado pelo postback.
        });
    });
  });
}

function setCommentStatus(message) {
  const status = document.querySelector("#comments-status");
  if (!status) return;

  status.textContent = "";
  window.setTimeout(() => {
    status.textContent = message;
  }, 20);
}

function updateReplyCharacterCount(form) {
  const textarea = form?.querySelector("textarea");
  const counter = form?.querySelector("[data-character-count]");
  if (!textarea || !counter) return;

  counter.textContent = `${textarea.value.length}/280`;
}

function setReplyFormExpanded(form, expanded) {
  if (!form) return;

  form.hidden = !expanded;
  document.querySelectorAll("[data-comment-reply]").forEach((button) => {
    if (button.dataset.commentReply === form.id) {
      button.setAttribute("aria-expanded", String(expanded));
    }
  });
}

function closeReplyForm(
  form,
  { reset = false, restoreFocus = false } = {},
) {
  if (!form) return;

  const returnFocus = form._replyTrigger;

  if (reset) {
    form.reset();
    delete form.dataset.replyMention;
  }
  setReplyFormExpanded(form, false);
  updateReplyCharacterCount(form);

  if (restoreFocus && returnFocus instanceof HTMLElement) {
    window.requestAnimationFrame(() => returnFocus.focus());
  }
}

function openReplyForm(form, replyAuthor = "", trigger = null) {
  if (!form) return;

  document.querySelectorAll("[data-comment-reply-form]").forEach((otherForm) => {
    if (otherForm !== form) closeReplyForm(otherForm);
  });

  const textarea = form.querySelector("textarea");
  const mention = replyAuthor ? `@${replyAuthor} ` : "";
  const previousMention = form.dataset.replyMention || "";

  if (trigger instanceof HTMLElement) form._replyTrigger = trigger;

  setReplyFormExpanded(form, true);

  if (textarea && mention) {
    if (previousMention && textarea.value.startsWith(previousMention)) {
      textarea.value = `${mention}${textarea.value.slice(previousMention.length)}`;
    } else if (!textarea.value.trim()) {
      textarea.value = mention;
    } else if (!textarea.value.startsWith(mention)) {
      textarea.value = `${mention}${textarea.value}`;
    }

    form.dataset.replyMention = mention;
  }

  updateReplyCharacterCount(form);
  window.requestAnimationFrame(() => {
    if (!textarea) return;
    textarea.focus({ preventScroll: true });
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  });
}

function createUserReply(text, formId) {
  const article = document.createElement("article");
  article.className = "viewer-comment viewer-comment--reply viewer-comment--user";
  article.dataset.comment = "";

  const avatar = document.createElement("span");
  avatar.className = "viewer-comment__avatar viewer-comment__avatar--you";
  avatar.setAttribute("role", "img");
  avatar.setAttribute("aria-label", "Sua foto de perfil ilustrativa");

  const content = document.createElement("div");
  content.className = "viewer-comment__content";

  const bubble = document.createElement("div");
  bubble.className = "viewer-comment__bubble";

  const name = document.createElement("strong");
  name.textContent = "Você";

  const message = document.createElement("p");
  message.textContent = text;

  const actions = document.createElement("div");
  actions.className = "viewer-comment__actions";
  actions.setAttribute("aria-label", "Ações da sua resposta");

  const likeButton = document.createElement("button");
  likeButton.type = "button";
  likeButton.dataset.commentLike = "";
  likeButton.setAttribute("aria-pressed", "false");

  const likeLabel = document.createElement("span");
  likeLabel.dataset.likeLabel = "";
  likeLabel.textContent = "Curtir";
  likeButton.appendChild(likeLabel);

  const firstSeparator = document.createElement("span");
  firstSeparator.setAttribute("aria-hidden", "true");
  firstSeparator.textContent = "·";

  const replyButton = document.createElement("button");
  replyButton.type = "button";
  replyButton.dataset.commentReply = formId;
  replyButton.dataset.replyAuthor = "Você";
  replyButton.setAttribute("aria-expanded", "false");
  replyButton.setAttribute("aria-controls", formId);
  replyButton.textContent = "Responder";

  const secondSeparator = document.createElement("span");
  secondSeparator.setAttribute("aria-hidden", "true");
  secondSeparator.textContent = "·";

  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = "Agora";

  const reaction = document.createElement("span");
  reaction.className = "comment-reaction";
  reaction.dataset.reactionCount = "";
  reaction.hidden = true;

  bubble.append(name, message);
  actions.append(
    likeButton,
    firstSeparator,
    replyButton,
    secondSeparator,
    time,
    reaction,
  );
  content.append(bubble, actions);
  article.append(avatar, content);

  return article;
}

function initCommentInteractions() {
  const comments = document.querySelector("#viewer-comments");
  if (!comments) return;

  comments.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const likeButton = target.closest("[data-comment-like]");
    if (likeButton) {
      const willLike = likeButton.getAttribute("aria-pressed") !== "true";
      const actions = likeButton.closest(".viewer-comment__actions");
      const label = likeButton.querySelector("[data-like-label]");
      const reaction = actions?.querySelector("[data-reaction-count]");

      likeButton.setAttribute("aria-pressed", String(willLike));
      if (label) label.textContent = willLike ? "Curtido" : "Curtir";

      if (reaction) {
        reaction.hidden = !willLike;
        reaction.textContent = willLike ? "1 curtida" : "";
      }

      setCommentStatus(
        willLike ? "Comentário marcado como curtido." : "Curtida removida.",
      );
      return;
    }

    const replyButton = target.closest("[data-comment-reply]");
    if (replyButton) {
      const form = document.getElementById(replyButton.dataset.commentReply || "");
      if (!form) return;

      const replyAuthor = replyButton.dataset.replyAuthor || "";
      const shouldClose = !form.hidden && !replyAuthor;

      if (shouldClose) {
        closeReplyForm(form, { restoreFocus: true });
      } else {
        openReplyForm(form, replyAuthor, replyButton);
      }
      return;
    }

    const cancelButton = target.closest("[data-comment-cancel]");
    if (cancelButton) {
      const form = cancelButton.closest("[data-comment-reply-form]");
      closeReplyForm(form, { reset: true, restoreFocus: true });
      setCommentStatus("Resposta cancelada.");
    }
  });

  comments.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;

    updateReplyCharacterCount(target.closest("[data-comment-reply-form]"));
  });

  comments.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.matches("[data-comment-reply-form]")) return;

    event.preventDefault();

    const textarea = form.querySelector("textarea");
    const replies = form.parentElement?.querySelector(
      ":scope > [data-comment-replies]",
    );
    const message = textarea?.value.trim() || "";

    if (!textarea || !replies || !message) {
      textarea?.focus();
      setCommentStatus("Escreva uma mensagem antes de publicar.");
      return;
    }

    const reply = createUserReply(message, form.id);
    reply.tabIndex = -1;
    replies.appendChild(reply);
    closeReplyForm(form, { reset: true });
    setCommentStatus("Sua resposta foi adicionada à conversa.");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    reply.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    });
    reply.focus({ preventScroll: true });
  });
}

function initFaq() {
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item?.querySelector(".faq-answer");
      if (!item || !answer) return;

      const willOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willOpen));
      answer.hidden = !willOpen;
      item.classList.toggle("is-open", willOpen);
    });
  });
}

let revealObserver;

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal-up");

  if (
    !items.length ||
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  items.forEach((item) => revealObserver.observe(item));
}

function refreshRevealAnimations() {
  if (!revealObserver) return;
  document.querySelectorAll(".reveal-up:not(.is-visible)").forEach((item) => {
    revealObserver.observe(item);
  });
}

function initBackRedirect() {
  if (!BACK_REDIRECT_URL) return;

  const destination = BACK_REDIRECT_PRESERVE_QUERY
    ? mergeCurrentQueryParams(BACK_REDIRECT_URL)
    : BACK_REDIRECT_URL;

  if (!destination) return;

  window.history.replaceState({ pvDivessence: true }, "", window.location.href);
  window.history.pushState({ pvDivessence: true }, "", window.location.href);

  window.addEventListener("popstate", () => {
    window.location.assign(destination);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initVideoPlayer();
  attachPitchObserver();
  attachPlayerReveal();
  initCheckoutLinks();
  initRedTrackCheckoutTracking();
  initCommentInteractions();
  initFaq();
  initRevealAnimations();
  initBackRedirect();
});
