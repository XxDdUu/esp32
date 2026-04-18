import { ref, onMounted } from "vue";

export function useVerticalScroll(scrollAmount = 200) {
  const scrollRef = ref<HTMLElement | null>(null);
  const canScrollUp = ref(false);
  const canScrollDown = ref(false);

  const updateScrollState = () => {
    const el = scrollRef.value;
    if (!el) return;

    canScrollUp.value = el.scrollTop > 0;
    canScrollDown.value =
      el.scrollTop + el.clientHeight < el.scrollHeight;
  };

  const scroll = (direction: "up" | "down") => {
    const el = scrollRef.value;
    if (!el) return;

    el.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  onMounted(updateScrollState);

  return {
    scrollRef,
    canScrollUp,
    canScrollDown,
    scroll,
    updateScrollState,
  };
}
