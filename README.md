# tmp-shared-web

Temporary repo for r2-shared-web – shared models, starting with types.

## Abstract

This temporary repo is meant as a way to share and communicate on early developments with other stakeholders of the Readium Web project.

Its goal is to define state of the art shared models for Readium Web and, insofar as possible, enforce consistency with other projects in the Readium workspace (Kotlin, Swift, etc.).

## References

- [Readium Web](https://github.com/readium/readium-web)
- [Readium Web Publication Manifest](https://github.com/readium/webpub-manifest)
- [Readium Architecture](https://github.com/readium/architecture)
- [R2-shared-kotlin](https://github.com/readium/r2-shared-kotlin)
- [R2-shared-js](https://github.com/readium/r2-shared-js)

## Notes

The initial commit is a dumbed-down version of what shared models should be. In particular:
  - it starts with types/interfaces in order to find and provide a solid foundation for further developments;
  - it’s not using more advanced features of TypeScript at this point;
  - it attempts to incorporate the latest changes.

In theory, this should also help discuss shared models with developers who are not familiar with JS/TS, in order to enforce consistency accross projects.

## Questions

- How does the [Composite Fetcher proposal](https://github.com/mickael-menu/architecture/blob/proposal/composite-fetcher-layer/proposals/002-composite-fetcher-layer.md) impacts Readium Web?
- More generally, how/where does Readium Web differ from the other Readium’s project?
- How is r2-shared-kotlin going to evolve?
- Existing alternatives to consider and update/reuse? Or ways to improve the process + maintenance?
- Is there anything missing or, on the opposite, useless in the Readium Web context?
- What should be a class, and which methods should it have?