const blockedPatterns = [
  /несовершеннолетн/i,
  /детск(?:ий|ая|ое).*(?:эрот|секс)/i,
  /изнасил/i,
  /суицид\s+инструкц/i,
  /реальные\s+личные\s+данные/i
];

export function checkContentSafety(input: string) {
  const normalized = input.trim();

  if (!normalized) {
    return { allowed: false, reason: "Пустой запрос не может быть отправлен в генерацию." };
  }

  const matched = blockedPatterns.find((pattern) => pattern.test(normalized));

  if (matched) {
    return {
      allowed: false,
      reason:
        "Запрос не прошел правила Rolea 16+. Измени сцену так, чтобы она оставалась безопасной для ролевой истории."
    };
  }

  return { allowed: true, reason: null };
}
