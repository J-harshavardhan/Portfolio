export async function downloadResumePdf(data) {
  if (typeof window === "undefined") {
    throw new Error("Resume PDF generation is only available in the browser.");
  }

  const [{ jsPDF }] = await Promise.all([import("jspdf")]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 34;
  const contentWidth = pageWidth - margin * 2;
  const brand = [15, 139, 141];
  const ink = [16, 22, 35];
  const slate = [52, 65, 86];
  let cursorY = 42;

  const addPageIfNeeded = (requiredSpace = 0) => {
    if (cursorY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
  };

  const drawSectionTitle = (title) => {
    addPageIfNeeded(28);
    doc.setTextColor(...brand);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin, cursorY);
    cursorY += 12;
    doc.setDrawColor(185, 220, 220);
    doc.setLineWidth(1);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 13;
  };

  const addWrappedText = (text, options = {}) => {
    const lines = doc.splitTextToSize(String(text || ""), options.width || contentWidth);
    const lineHeight = options.lineHeight || 13;
    addPageIfNeeded(lines.length * lineHeight + 4);
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size || 10);
    doc.setTextColor(...(options.color || slate));
    doc.text(lines, options.x || margin, cursorY);
    cursorY += lines.length * lineHeight + (options.after || 4);
  };

  doc.setFillColor(247, 251, 252);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(...brand);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.profile?.name || "Portfolio Resume", margin, cursorY);
  cursorY += 18;

  doc.setTextColor(...ink);
  doc.setFontSize(11);
  doc.text(data.profile?.role || "", margin, cursorY);
  cursorY += 12;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...slate);
  doc.setFontSize(9);
  const contactLine = [data.profile?.email, data.profile?.location, "Generated from portfolio JSON"].filter(Boolean).join("   •   ");
  addWrappedText(contactLine, { size: 9, color: slate, after: 8 });

  addWrappedText(data.resume?.summary || data.profile?.summary, { size: 10, color: slate, lineHeight: 14, after: 8 });

  const stats = (data.stats || []).slice(0, 4);
  const statGap = 10;
  const statWidth = (contentWidth - statGap * (stats.length - 1)) / Math.max(stats.length, 1);
  const statHeight = 42;
  addPageIfNeeded(statHeight + 10);
  stats.forEach((stat, index) => {
    const x = margin + index * (statWidth + statGap);
    doc.setFillColor(232, 246, 245);
    doc.setDrawColor(185, 220, 220);
    doc.roundedRect(x, cursorY, statWidth, statHeight, 7, 7, "FD");
    doc.setTextColor(...brand);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(String(stat.value || ""), x + 8, cursorY + 17);
    doc.setTextColor(...slate);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(String(stat.label || ""), x + 8, cursorY + 31);
  });
  cursorY += statHeight + 16;

  const coreStrengths = data.resume?.sections?.find((section) => section.heading === "Core Strengths")?.items || [];
  const focusAreas = data.resume?.sections?.find((section) => section.heading === "Focus Areas")?.items || [];

  const renderBullets = (items) => {
    items.forEach((item) => {
      addWrappedText(`• ${item}`, { size: 9.5, color: slate, lineHeight: 12, after: 1 });
    });
  };

  const renderMiniSection = (title, items) => {
    drawSectionTitle(title);
    renderBullets(items);
  };

  const renderCardList = (title, items) => {
    drawSectionTitle(title);
    items.forEach((item) => {
      addPageIfNeeded(70);
      const cardTop = cursorY;
      const textLines = doc.splitTextToSize(item.description || "", contentWidth - 16);
      const bulletLines = (item.items || []).map((bullet) => doc.splitTextToSize(`• ${bullet}`, contentWidth - 22));
      const tags = item.tags || [];
      const cardHeight = 24 + textLines.length * 12 + bulletLines.reduce((sum, lines) => sum + lines.length * 11, 0) + (tags.length ? 20 : 0);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(214, 222, 234);
      doc.roundedRect(margin, cardTop, contentWidth, cardHeight, 8, 8, "FD");

      let innerY = cardTop + 12;
      doc.setTextColor(...ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(String(item.title || ""), margin + 8, innerY);
      innerY += 11;

      if (item.meta) {
        doc.setTextColor(...brand);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.2);
        doc.text(String(item.meta), margin + 8, innerY);
        innerY += 10;
      }

      if (item.description) {
        doc.setTextColor(...slate);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(textLines, margin + 8, innerY);
        innerY += textLines.length * 12;
      }

      if (Array.isArray(item.items) && item.items.length) {
        item.items.forEach((bullet) => {
          const bulletLinesLocal = doc.splitTextToSize(`• ${bullet}`, contentWidth - 22);
          doc.text(bulletLinesLocal, margin + 12, innerY);
          innerY += bulletLinesLocal.length * 11;
        });
      }

      if (tags.length) {
        innerY += 2;
        tags.forEach((tag, tagIndex) => {
          const tagWidth = doc.getTextWidth(String(tag)) + 12;
          const tagX = margin + 8 + tagIndex * (tagWidth + 6);
          if (tagX + tagWidth > margin + contentWidth) return;
          doc.setFillColor(237, 241, 248);
          doc.roundedRect(tagX, innerY, tagWidth, 15, 7, 7, "F");
          doc.setTextColor(...slate);
          doc.setFontSize(7.5);
          doc.text(String(tag), tagX + 6, innerY + 10.5);
        });
        innerY += 18;
      }

      cursorY = cardTop + cardHeight + 6;
    });
  };

  renderMiniSection("Core Strengths", coreStrengths);
  renderMiniSection("Focus Areas", focusAreas);

  const experience = (data.achievements || []).slice(0, 4).map((item) => ({
    title: item.title,
    meta: `${item.organization} | ${item.period}`,
    description: item.details,
    items: item.impact || [],
  }));

  const skills = (data.skillGroups || []).map((group) => ({
    title: group.title,
    meta: group.summary,
    description: group.details,
    items: group.items,
  }));

  const projects = (data.projects || []).slice(0, 4).map((project) => ({
    title: project.name,
    meta: `${project.tag} | ${project.difficulty}`,
    description: project.shortDescription,
    tags: project.stack,
  }));

  renderCardList("Experience", experience);
  renderCardList("Skills", skills);
  renderCardList("Projects", projects);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "J_Harshavardhan_Resume.pdf";
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}