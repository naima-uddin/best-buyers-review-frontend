const applyAnchorTags = (text, anchors) => {
  if (!text) return text;

  let updatedText = text;

  anchors.forEach(anchor => {
    const wordRegex = new RegExp(`\\b${anchor.word}\\b`, "gi");
    const linkTag = `<a href="${anchor.link}" ${anchor.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-blue-600 underline">${anchor.word}</a>`;
    updatedText = updatedText.replace(wordRegex, linkTag);
  });

  return updatedText;
};
