# System Patterns

## System Architecture
- Kiến trúc tĩnh (static site) kết hợp một số function động (Cloudflare Workers) cho sitemap, cập nhật title động
- Phân tách rõ: assets (ảnh, css, js), functions (backend nhỏ), các trang HTML riêng biệt
- Modular documentation system using Markdown files in `memory-bank/`
- Hierarchical structure: projectbrief.md → productContext.md, systemPatterns.md, techContext.md → activeContext.md → progress.md

## Key Technical Decisions
- Sử dụng Bootstrap cho layout, Swiper/Fancybox cho gallery, jQuery cho thao tác DOM động
- Tách biệt dữ liệu (menu, review) và giao diện, tận dụng schema.org cho SEO
- All context is stored in Markdown for portability and readability
- Documentation-first approach for all changes

## Design Patterns
- Separation of concerns: product, technical, and progress contexts are distinct
- Hierarchical context inheritance

## Component Relationships
- Each file builds on the previous, providing increasing specificity and recency 