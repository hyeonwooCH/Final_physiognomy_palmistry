/**
 * 리포트 HTML을 손금별 카드 배열로 파싱
 */
export interface LineCard {
  lineKey: string;
  label: string;
  contentHtml: string;
  fullCardHtml: string;
}

const TITLE_TO_LINE_KEY: Record<string, string> = {
  생명선: "life",
  두뇌선: "head",
  감정선: "heart",
  운명선: "fate",
};

export function parseReportToCards(html: string, lineOrder: string[]): LineCard[] {
  const cards: LineCard[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // palm-scroll-area, flex 컨테이너, 또는 palm-wrapper 내 카드 div 탐색
  const wrapper = doc.querySelector(".palm-wrapper") ?? doc.body;
  const scrollContainer =
    wrapper.querySelector(".palm-scroll-area") ??
    Array.from(wrapper.children).find(
      (el) =>
        el.tagName === "DIV" &&
        (el.getAttribute("style")?.includes("flex") ||
          el.getAttribute("style")?.includes("overflow"))
    ) ??
    wrapper;

  const childDivs = Array.from(scrollContainer.children).filter(
    (el) =>
      el.tagName === "DIV" &&
      (el.children.length >= 1 || el.querySelector("div"))
  );

  for (const div of childDivs) {
    const htmlEl = div as HTMLElement;
    const allDivs = Array.from(htmlEl.children).filter((c) => c.tagName === "DIV");
    const titleEl = allDivs[0];
    const contentEl = allDivs.length > 1 ? allDivs[1] : allDivs[0];

    const titleText = titleEl?.textContent?.trim() ?? htmlEl.textContent?.trim().slice(0, 50) ?? "";
    let lineKey = "";

    for (const [k, v] of Object.entries(TITLE_TO_LINE_KEY)) {
      if (titleText.includes(k)) {
        lineKey = v;
        break;
      }
    }

    if (!lineKey && titleText) {
      lineKey = `extra_${cards.length}`;
    }

    const contentHtml = contentEl ? contentEl.innerHTML : htmlEl.innerHTML;
    const label = titleText.replace(/^[^\s]+\s*/, "").trim() || titleText || lineKey;

    cards.push({
      lineKey,
      label: label || lineKey,
      contentHtml,
      fullCardHtml: htmlEl.outerHTML,
    });
  }

  // data.lines 순서에 맞게 재정렬 (있는 것만)
  const ordered: LineCard[] = [];
  for (const key of lineOrder) {
    const found = cards.find((c) => c.lineKey === key);
    if (found) ordered.push(found);
  }
  // 매칭 안 된 카드들 뒤에 추가
  for (const c of cards) {
    if (!ordered.some((o) => o.lineKey === c.lineKey)) {
      ordered.push(c);
    }
  }

  return ordered.length > 0 ? ordered : cards;
}
