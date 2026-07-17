---
title: Badges
description: Display small status labels inside your documentation using SimpleWiki MDC components.
navigation:
  title: Badges
  order: 5
---

# Badges

The `badge` component displays small inline labels to indicate the status of content.

Badges can be placed anywhere inside normal Markdown text.

---

## Examples

### Weston-Yamada

```md
:badge{type="weya"}
```

:badge{type="weya"}

---

### Three Sun Empire

```md
:badge{type="tse"}
```

:badge{type="tse"}

---

### Socialist People's Protectorate

```md
:badge{type="spp"}
```

:badge{type="spp"}

---

### United Nations Marine Corps

```md
:badge{type="unmc"}
```

:badge{type="unmc"}

---

### Colonial Liberation Front

```md
:badge{type="clf"}
```

:badge{type="clf"}

---

### Civilian

```md
:badge{type="civ"}
```

:badge{type="civ"}

---

## Custom Text

You can override the default label by placing text inside the component.

```md
:badge{type="unmc"}[Experimental]
```

Result:

:badge{type="unmc"}[Experimental]

---