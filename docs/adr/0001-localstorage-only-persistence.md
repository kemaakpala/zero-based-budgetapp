# localStorage as the sole persistence layer

All budget data is persisted exclusively in the browser's `localStorage` via a `StorageAdapter` abstraction. There is no backend, no database, and no server-side state.

This was chosen because the app is a personal budgeting tool with no multi-user requirements. It eliminates deployment complexity, hosting costs, and authentication — the user opens the page and their data is already there. The `StorageAdapter` interface (`get`/`set`) exists so that tests can swap in an `InMemoryStorageAdapter` without touching `localStorage`.

The trade-off is real: there's no multi-device sync, no data recovery if the user clears browser storage, and localStorage is capped at ~5-10MB per origin. If any of these become blockers, the `StorageAdapter` abstraction makes migration to a backend feasible without rewriting the reducer or helpers — only a new adapter implementation is needed.
