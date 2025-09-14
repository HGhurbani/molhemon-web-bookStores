We pinned `firebase` to ^10.0.0 to satisfy the peer dependency of `@firebase/rules-unit-testing` (which requires firebase ^10.x).

Why:
- `@firebase/rules-unit-testing@3.x` has a peerDependency on `firebase@^10.0.0`.
- The project previously used `firebase@^11.10.0`, which caused npm ERESOLVE dependency conflicts during install.

Next steps:
- When `@firebase/rules-unit-testing` releases a version that supports firebase 11, or when tests are migrated, we can upgrade `firebase` back to ^11.x.
- Alternatively, if you prefer firebase 11 now, you can run `npm install --legacy-peer-deps` or `npm install --force`, but that may result in runtime incompatibilities with the testing package.

How to upgrade safely:
1. Check for a newer `@firebase/rules-unit-testing` that supports firebase 11.
2. Run `npm install firebase@^11.0.0` and then run the test suite and emulator-based tests.
3. Address any runtime/test failures caused by API changes between firebase 10 and 11.

This file was added automatically to explain the dependency pin and avoid confusion in future PRs.