import { ref, onMounted, onUnmounted } from "vue";

export function useHorizontalScroll(scrollAmount?: number) {
  const scrollRef = ref<HTMLElement | null>(null);

  const canScrollLeft = ref(false);
  const canScrollRight = ref(true);

  const checkScroll = () => {
    const el = scrollRef.value;
    if (!el) return;

    canScrollLeft.value = el.scrollLeft > 0;
    canScrollRight.value =
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
  };

  const scroll = (dir: number) => {
    const el = scrollRef.value;
    if (!el) return;

    const width = scrollAmount ?? el.clientWidth;

    el.scrollBy({
      left: dir * width,
      behavior: "smooth",
    });
  };

  const handleWheel = (e: WheelEvent) => {
    const el = scrollRef.value;
    if (!el) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  onMounted(() => {
    const el = scrollRef.value;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll);
    el.addEventListener("wheel", handleWheel, { passive: false });
  });

  onUnmounted(() => {
    const el = scrollRef.value;
    if (!el) return;

    el.removeEventListener("scroll", checkScroll);
    el.removeEventListener("wheel", handleWheel);
  });

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
  };
}
