# README image prompts

## 0. Global specification

Project: Qiyu Live, an educational live-streaming microservices system.

Visual direction: deep ocean blue, cyan data paths, restrained live-red accents, flat technical illustration, clean negative space, no gradients, no glass effects, no brand logos, no readable text.

Naming contract: save final files under `assets/images/readme/` using the exact filenames below.

### System instruction for GPT Image

```text
Create a clean technical illustration for a GitHub README. Follow the requested aspect ratio and composition exactly. Use a deep ocean blue base, cyan signal paths, neutral light surfaces, and at most one restrained live-red accent. Keep the design flat and precise. Do not add readable text, logos, gradients, glassmorphism, screenshots, watermarks, or decorative clutter.
```

## 1. banner.png

- Ratio: 3:1 preferred; generator used 20:9 (closest supported wide ratio)
- Purpose: README header
- Composition: a live video frame on the left, a service-node topology in the center, and a WebSocket signal wave on the right.
- Status: generated → `assets/images/readme/banner.png`

```text
A wide 3:1 GitHub README banner for Qiyu Live, an educational live-streaming microservices system. Show a minimal live video frame connected to a precise network of backend service nodes, message queues, databases, and a WebSocket signal wave. Deep ocean blue and cyan palette with one small live-red status dot. Flat technical illustration, generous negative space, no readable text, no logos, no gradients, no 3D.
```

## 2. features.png

- Ratio: 16:9
- Purpose: summarize business capabilities
- Elements: login, live rooms, chat, gifts, virtual currency, PK, red packets, commerce.

```text
A 16:9 feature map for a live-streaming platform. Arrange eight distinct but connected visual symbols: phone login, live room, chat stream, animated gift, virtual currency wallet, two-host PK, red packet rain, and live commerce cart. Use a clear left-to-right information hierarchy, deep ocean blue and cyan, one restrained red accent, flat vector style, no text or logos.
```

## 3. architecture.png

- Ratio: 16:9
- Purpose: system topology
- Layers: Web, Gateway, API BFF, Dubbo providers, RocketMQ, Redis, MySQL, Nacos, IM Router, Netty IM Core.

```text
A 16:9 technical architecture diagram without labels. Top layer: browser web client. Entry layer: gateway and API aggregation node. Service layer: grouped microservice nodes for user, account, living room, gift, bank, messaging, and ID generation. Infrastructure layer: registry, configuration center, message queue, cache, and sharded databases. A separate real-time path connects the browser through an IM router to multiple Netty connection servers. Use consistent node shapes and directional cyan paths on deep ocean blue. No readable text, no invented components, no gradients.
```

## 4. tech-stack.png

- Ratio: 16:9
- Purpose: technology layers

```text
A 16:9 layered technology stack illustration for a Java live-streaming system. Represent browser UI at the top, Java microservices and RPC in the middle, real-time networking beside them, and database, cache, message queue, service registry, and containers at the bottom. Use abstract recognizable shapes without product logos or text. Deep ocean blue, cyan connectors, neutral panels, flat editorial technical style.
```

## 5. workflow.png

- Ratio: 16:9
- Purpose: gift delivery workflow

```text
A 16:9 sequence-style illustration of a gift delivery flow in a live-streaming platform. A viewer sends a gift from the browser, an API emits an asynchronous message, a gift service charges a virtual wallet, looks up the live room, routes the event to the correct real-time server, and pushes an animation back to viewers. Show retries and asynchronous boundaries through visual line styles, but use no readable text. Flat deep ocean blue and cyan technical design with one red gift accent.
```

## 6. structure.png

- Ratio: 16:9
- Purpose: repository structure

```text
A 16:9 repository structure illustration with four primary branches: backend source, web demo, structured documentation, and reusable assets, plus a smaller read-only upstream reference branch. Show backend as many service modules and web as several static pages. Use a precise tree layout, deep ocean blue and cyan, flat vector style, no file names, no text, no gradients.
```

## 7. preview-shell.png

This is not generated art. Capture the running Web static Preview after missing assets and backend dependencies are understood. Target URL: `http://web.qiyu.live.com:5500/html/living_room_list.html`.

## 8. showcase slots

- `showcase-home.png`: login and living room list.
- `showcase-living-room.png`: chat, gifts, wallet and commerce.
- `showcase-pk-room.png`: two-host PK and progress.

These files must be real browser screenshots, not generated mockups.
