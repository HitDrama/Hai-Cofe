# Kế hoạch triển khai: Langdi Page — tái hiện hệ hiệu ứng của andtea.com

> [!IMPORTANT]
> **Nguyên tắc pháp lý (bắt buộc):** Ta **viết lại code hiệu ứng** từ những gì đã phân tích (cơ chế, timing, easing, layout). Logo `&TEA`, ảnh sản phẩm, GIF, icon font `fontello` riêng của họ và nội dung chữ thuộc **&TEA / ES Design**, nên **không đưa lên site public**. Bản build dùng ảnh/chữ placeholder có ghi nhãn rõ ràng, sau đó thay bằng tài nguyên thương hiệu Langdi của bạn.

Tài liệu tham chiếu: [andtea_ui_analysis.md](./andtea_ui_analysis.md)

---

## 0. Cần bạn quyết định trước khi code

| # | Câu hỏi | Mặc định nếu bạn không chọn |
|---|---|---|
| D1 | Thương hiệu/nội dung: Langdi bán gì? (trà, cà phê, F&B khác…) | Thương hiệu đồ uống, dùng nội dung placeholder |
| D2 | Stack | **Vite + HTML/CSS/JS thuần**, Locomotive Scroll v4 + `@barba/core` cài qua npm (cả hai đều giấy phép MIT) |
| D3 | Phạm vi trang | Home + About + Drinks + News (danh sách + bài chi tiết) |
| D4 | Có sửa các lỗi UX của bản gốc không | **Có** (độ tương phản, vùng chạm, giảm chuyển động, thu ngắn sticky trên mobile) |
| D5 | Ngôn ngữ nội dung | Tiếng Việt + phụ đề tiếng Anh viết bằng font serif |

---

## 1. Cấu trúc thư mục dự kiến

```text
Langdi-page/
├── andtea_ui_analysis.md          # tài liệu tham chiếu (đã có)
├── index.html                     # Home   (barba namespace: home)
├── about.html                     # About  (namespace: about)
├── drinks.html                    # Drinks (namespace: drinks)
├── news.html / news-detail.html   # News   (namespace: blog / blogSingle)
├── package.json  vite.config.js
├── public/assets/
│   ├── img/          # placeholder và ảnh thương hiệu Langdi
│   ├── icons/        # bộ icon SVG tự vẽ (lá, mũi tên, sóng, social)
│   └── svg/          # arrow-line.svg, arrow-line-ver.svg (tự vẽ)
└── src/
    ├── styles/
    │   ├── tokens.css        # màu, chữ, khoảng cách, easing (Mục 3 của báo cáo)
    │   ├── base.css          # reset + typography
    │   ├── motifs.css        # elip, đường kẻ dọc 1px, dấu ngã, mũi tên
    │   ├── components/*.css  # header, nav, loader, leaf-btn, list-post…
    │   ├── pages/*.css       # home, about, drinks, news
    │   └── responsive.css    # breakpoint 1600 / 768 / 550
    └── js/
        ├── main.js           # khởi tạo: loader → scroll → barba → các view
        ├── core/scroll.js    # bọc LocomotiveScroll + phát scrollY/speed/direction
        ├── core/router.js    # chuyển trang barba + vòng đời màn hình loader
        ├── core/raf.js       # một vòng rAF dùng chung, có IntersectionObserver để tạm dừng
        ├── effects/          # circleTrack, railTrack, followCursorInSec, followCursorPara, curvedText
        └── views/            # home.js, about.js, drinks.js, blog.js
```

---

## 2. Các giai đoạn triển khai

### Giai đoạn 1 — Khung dự án và design token (≈0,5 ngày)
- Khởi tạo Vite đa trang, cài `locomotive-scroll@4`, `@barba/core`, `imagesloaded`.
- Viết `tokens.css` từ bảng token đã trích xuất (`#F8F8F8`, `#DDBB99`, `#C1A387`, font Bellefair + font sans, các easing `cubic-bezier(.76,0,.24,1)` / `(.25,1,.5,1)`).
- Vẽ lại bộ icon SVG (lá/dấu ngã, mũi tên, sóng, social) để thay `fontello`.
- **Hoàn thành khi:** `npm run dev` chạy được 4 trang rỗng dùng chung token.

### Giai đoạn 2 — Lõi chuyển động dùng chung (≈1 ngày)
| Hiệu ứng | Thông số cần khớp |
|---|---|
| Loader `LOADING` | khối tròn `scale(0)→2.3` trong 1s, rồi trượt ra `translateY(100%) scale(.5)` |
| Cuộn mượt + parallax | lerp của Locomotive, `data-scroll-speed`, class `esin` khi phần tử vào khung nhìn |
| Chuyển trang SPA | barba `leave` 1s → hủy scroll → `after` khởi tạo lại |
| Header | logo `scale(.6)` khi cuộn quá 50px; logo hover chuyển từ fill sang chỉ viền |
| Nút menu sóng | sóng trượt `-400px` trong 5s khi hover; mở menu thì xoay `±15°` thành dấu X |
| Menu trượt | nền `scaleX(0→1)` 1s, các mục hiện lệch nhịp `.3/.4/.5s` |
| Mũi tên nét vẽ | `horiLineAni` / `verLineAni` 3s khi hover |
- **Hoàn thành khi:** chuyển qua lại 4 trang không lỗi console và không rò rỉ listener (dọn dẹp ở `barba.hooks.leave`).

### Giai đoạn 3 — Trang Home (≈1,5 ngày)
1. **Hero chia đôi 50/50**: ảnh trái phóng theo `1 + scrollY/2000`; ly nước bên phải trượt theo cuộn; vòng chữ SVG `textPath` xoay, tăng tốc theo `scrollSpeed`.
2. **Vòng xoay sản phẩm ghim màn hình**: N sản phẩm cách nhau `360/N`° (mặc định 5 → 72°), góc = `(y - top) * (360 - 360/N) / chiềuCao`; vùng hoạt động `-50°…30°`; đổi màu nền; tiêu đề trượt; con trỏ lá di chuyển; mô tả mờ ra/vào; dải chữ chạy; nút "Bỏ qua"; tự bắt điểm dừng khi cuộn chậm lại. **Viết N động, không cố định 5.**
3. **Giới thiệu dạng chữ Z**: 3 hàng xen kẽ, trục dọc giữa, ảnh `img_scalin` (`scale 1.2→1` trong 2s).
4. **Banner parallax + chữ cong** `startOffset` chạy theo cuộn.
5. **Danh sách tin tức**: ảnh elip bám con trỏ (lerp 0.1, `scale 0→1`).
6. **Footer**: logo kèm đường kẻ dọc, social tròn, nút TOP hình elip.

### Giai đoạn 4 — About, Drinks, News (≈1,5 ngày)
- **About:** tiêu đề tách đôi trượt vào từ hai phía; khung tuyên ngôn elip nghiêng `-5°` kèm ngôi sao; dải chữ chạy ngang `railTrack`; thư viện ảnh cửa hàng; chữ "Core DNA" lộ dần (`from_down/left/right`).
- **Drinks:** slider ly nước tự chạy 3s (ảnh nền `widthIn`, `cupMnOut/In`, đổi màu nền); slider kem có con trỏ lá; menu accordion `height` 0.7s kèm ảnh ghim màn hình đổi theo mục đang mở.
- **News:** lưới bài viết 2 cột so le, phân trang có vòng elip, trang chi tiết bài viết.

### Giai đoạn 5 — Sửa lỗi UX của bản gốc (≈0,5 ngày)
| Lỗi ở bản gốc | Cách xử lý |
|---|---|
| Chữ ngày `#CCC` chỉ đạt 1.51:1, nhãn `#DDBB99` chỉ đạt 1.70:1 | Chữ chức năng dùng `#8C6D4F` / `#757575` (≥4.5:1); giữ `#DDBB99` cho trang trí và chữ cực lớn |
| Vùng chạm nhỏ hơn 44px trên mobile | `min-width/height: 44px` cho mọi link/nút |
| Vùng ghim cao 1000vh trên mobile | Giảm còn ~`N×80vh`, thêm chấm điều hướng |
| rAF chạy liên tục, không hỗ trợ giảm chuyển động | Một vòng rAF dùng chung, tạm dừng khi ra khỏi khung nhìn; `prefers-reduced-motion` tắt xoay/parallax |
| Nút làm bằng `<div>`, `alt` để trống | Dùng `<button>` + `aria-label`, `alt` có ý nghĩa, focus-visible |

### Giai đoạn 6 — Kiểm thử và bàn giao (≈0,5 ngày)
- Chạy `render-check.mjs` ở `375×812`, `768×1024`, `1440×900` cho từng trang: **0 error**.
- So sánh ảnh chụp với bản gốc theo thứ tự: bố cục → khoảng cách → chữ → màu → chuyển động.
- Kiểm tra thủ công bảng hiệu ứng (Mục 3), điều hướng bằng bàn phím, Safari + Chrome, `npm run build` sạch.

---

## 3. Bảng nghiệm thu hiệu ứng (Definition of Done)

- [ ] Loader và chuyển trang SPA
- [ ] Cuộn mượt + parallax + kích hoạt khi vào khung nhìn
- [ ] Logo thu nhỏ khi cuộn, hover chuyển sang chỉ viền
- [ ] Nút menu sóng chuyển thành X + menu trượt
- [ ] Vòng chữ Hero tăng tốc theo lực cuộn
- [ ] Vòng xoay sản phẩm ghim màn hình (N động, đổi màu, bắt điểm dừng, nút bỏ qua)
- [ ] Ảnh phóng nhỏ dần khi lộ ra
- [ ] Chữ cong chạy theo cuộn
- [ ] Ảnh elip bám con trỏ trong danh sách tin tức
- [ ] Dải chữ chạy ngang (About) + chữ lộ dần
- [ ] Slider ly nước + slider kem + menu accordion (Drinks)
- [ ] Mũi tên nét vẽ, nút elip, đường kẻ dọc 1px
- [ ] Đạt chuẩn tương phản / vùng chạm / giảm chuyển động / bàn phím
- [ ] `render-check` 0 error ở cả 3 khung nhìn

**Tổng ước lượng:** ~5,5 ngày công (agent có thể làm liên tục; con số này dùng để chia giai đoạn).

> [!NOTE]
> Toàn bộ code thư viện bên thứ ba lấy từ npm chính chủ (MIT), không sao chép file `support.js` hay các file đã minify của andtea. Code hiệu ứng được viết lại theo dạng module ES.
