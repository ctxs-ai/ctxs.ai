┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                         FLY.IO                               │
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │                                                  │        │
│  │             Astro Application Server             │        │
│  │                                                  │        │
│  └───────────────┬──────────────────┬───────────────┘        │
│                  │                  │                        │
└──────────────────┼──────────────────┼────────────────────────┘
                   │                  │
                   │                  │   Triggers jobs
                   │                  │   ┌──────────────┐
                   │                  └───►              │
                   │                      │  Trigger.dev │
┌──────────────────▼───────────────┐      │              │
│                                  │      │  Background  │
│                                  │      │    Jobs      │
│           Neon Postgres          │◄─────┤              │
│                                  │      │              │
│                                  │      └──────────────┘
│                                  │
└──────────────────────────────────┘

Database connections:
 - Astro Application Server → Neon Postgres
 - Trigger.dev Background Jobs → Neon Postgres

User requests flow:
 1. Client requests → FLY.IO → Astro Application Server
 2. Astro Application Server interacts with Neon Postgres
 3. Astro Application Server triggers background jobs via Trigger.dev
 4. Trigger.dev jobs access Neon Postgres as needed
