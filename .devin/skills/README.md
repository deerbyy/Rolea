# Devin Skills для Rolea

Папка содержит Devin-скиллы — переиспользуемые инструкции/чеклисты, которые Devin может активировать в любой сессии.

## Откуда

Скиллы взяты из публичной коллекции [mattpocock/skills](https://github.com/mattpocock/skills) и адаптированы под Devin (формат `name` + `description: "Use when …"` совпадает с тем, как Devin загружает скиллы из `.devin/skills/<name>/SKILL.md`).

## Что есть

- **`setup-pre-commit/`** — поставить Husky + lint-staged + Prettier + tsc + tests как pre-commit.
- **`tdd/`** — red→green→refactor по одному вертикальному срезу: один тест → одна реализация. Запрещает «horizontal slicing».
- **`to-issues/`** — резать план/спеку/PRD на независимые вертикальные срезы (HITL/AFK), создавать GitHub-issues с зависимостями.
- **`grill-me/`** — допрос Devin-ом по плану до полной ясности (по одному вопросу, каждый с рекомендацией). Идеально перед тем, как кодить «переделай главную / иконку / wordmark».

## Как использовать

В любой Devin-сессии в этом репо:

```
skill list                # показать все доступные
skill invoke grill-me     # активировать грилл перед началом дизайн-задачи
skill invoke tdd          # активировать TDD перед фичей в lib/search.ts
skill invoke to-issues    # порезать большой фидбек на issues
skill invoke setup-pre-commit
```

## Когда что брать

- Длинный фидбек со списком из 5+ правок → `to-issues`.
- «Улучши дизайн X / переделай Y» → сначала `grill-me`, потом кодить, иначе будут N итераций вслепую.
- Новая логика в `lib/` (поиск, store, репо) → `tdd`.
- Нет ещё pre-commit, хочется защититься от пушей с грязным форматом / типами → `setup-pre-commit`.
