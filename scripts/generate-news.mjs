import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Builds news.html & news-detail.html reusing the shared header/footer shell from about.html.
const ROOT = new URL('..', import.meta.url).pathname;
const shell = readFileSync(join(ROOT, 'about.html'), 'utf8');

const headStart = shell.indexOf('<div data-barba="container"');
const footerStart = shell.indexOf('<footer');
const before = shell.slice(0, headStart);
const footer = shell.slice(footerStart);

const posts = [
  { cat: 'menu', catLabel: 'Thực đơn', date: '27 Thg 11, 2026', title: 'HAI COFE ra mắt Thực đơn Thu Đông — Kiều Mạch Rang & Cacao Barry', img: 'seasonal-collection.jpg' },
  { cat: 'season', catLabel: 'Theo mùa', date: '06 Thg 10, 2026', title: 'Mùa Hoa Quế: Nốt hương mộc tê dịu ngọt đánh thức chiều thu', img: 'craft-roast.jpg' },
  { cat: 'season', catLabel: 'Theo mùa', date: '21 Thg 09, 2026', title: 'Bưởi Hồng Muối Hoa Pháp — Thanh tao vị trăng rằm', img: 'fruit-harvest.jpg' },
  { cat: 'craft', catLabel: 'Nghệ thuật pha chế', date: '28 Thg 06, 2026', title: 'Chạm vị mùa hạ: Khi bánh ngọt Pháp hóa thân thành thức uống mát lành', img: 'craft-cream.jpg' },
  { cat: 'store', catLabel: 'Cửa hàng', date: '14 Thg 03, 2026', title: 'Không gian Flagship Đồng Khởi — Kiến trúc đường cong tối giản', img: 'store-interior.jpg' },
  { cat: 'craft', catLabel: 'Nghệ thuật pha chế', date: '02 Thg 02, 2026', title: 'Từ đồi Cầu Đất đến ly cold brew: Hành trình 16 giờ ủ lạnh', img: 'banner-terroir.jpg' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const cats = [
  ['all', 'Tất cả', 'ALL'],
  ['menu', 'Thực đơn', 'MENU'],
  ['season', 'Theo mùa', 'SEASONAL'],
  ['craft', 'Nghệ thuật pha chế', 'CRAFT'],
  ['store', 'Cửa hàng', 'STORE'],
];

const newsMain = `<div data-barba="container" data-barba-namespace="blog">
        <main class="page_blog">
          <div data-scroll data-scroll-section>
            <div class="eswrap blog_wrap">
              <aside>
                <div class="cate_titledeco bellfont">
                  NEWS
                  <h1>Bản tin &amp; Sự kiện</h1>
                </div>
                <nav class="post_cate" aria-label="Lọc chuyên mục">
                  <ul>
${cats.map(([key, vi, en], i) => `                    <li class="blognav${i === 0 ? ' current' : ''}"><button type="button" data-filter-cat="${key}"><span class="bellfont">${en}</span>${vi}</button></li>`).join('\n')}
                  </ul>
                </nav>
              </aside>
              <article>
                <div class="posts_wrap">
${posts.map((p) => `                  <div class="the_post" data-cat="${p.cat}">
                    <div class="the_post_thumb" data-scroll>
                      <figure class="img_scalin" data-scroll><a href="./news-detail.html"><img src="/assets/img/scenes/${p.img}" alt="${esc(p.title)}" /></a></figure>
                    </div>
                    <div class="the_post_text">
                      <div class="post_date bellfont">${p.date}</div>
                      <h3><a href="./news-detail.html">${esc(p.title)}</a></h3>
                    </div>
                    <div class="the_post_btm">
                      <span>${p.catLabel}</span>
                      <a href="./news-detail.html">Đọc tiếp <i class="icon-arrowright"></i></a>
                    </div>
                  </div>`).join('\n')}
                </div>
                <div class="espagination">
                  <div class="page-numbers">
                    <span class="current bellfont" aria-current="page">1</span>
                    <a class="bellfont" href="./news.html" aria-label="Trang 2">2</a>
                    <a class="bellfont" href="./news.html" aria-label="Trang kế tiếp">Next</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </main>

        `;

const related = posts.slice(1, 4);
const detailMain = `<div data-barba="container" data-barba-namespace="blogSingle">
        <main class="page_blog">
          <div data-scroll data-scroll-section>
            <div class="eswrap blog_wrap">
              <aside>
                <div class="cate_titledeco bellfont">
                  NEWS
                  <h1>Bản tin &amp; Sự kiện</h1>
                </div>
                <nav class="post_cate" aria-label="Chuyên mục">
                  <ul>
                    <li class="blognav"><a href="./news.html"><span class="bellfont">ALL</span>Tất cả</a></li>
                    <li class="blognav current"><a href="./news.html"><span class="bellfont">MENU</span>Thực đơn</a></li>
                    <li class="blognav"><a href="./news.html"><span class="bellfont">SEASONAL</span>Theo mùa</a></li>
                  </ul>
                </nav>
              </aside>
              <article>
                <div class="single_title">
                  <div class="date"><i class="icon-brand-4"></i><span class="bellfont">27 Thg 11, 2026</span> · <a href="./news.html">Thực đơn</a></div>
                  <h1>HAI COFE ra mắt Thực đơn Thu Đông — Kiều Mạch Rang &amp; Cacao Barry</h1>
                </div>
                <figure class="img_scalin" data-scroll><img src="/assets/img/scenes/seasonal-collection.jpg" alt="Bộ sưu tập Thu Đông HAI COFE" /></figure>
                <div class="edit_style">
                  <p>Khi những cơn gió heo may đầu tiên ghé qua Sài Gòn, HAI COFE giới thiệu bộ sưu tập Thu Đông với ba thức uống mới, lấy cảm hứng từ những buổi chiều ấm áp bên tách trà và chiếc bánh quy vừa ra lò.</p>
                  <h3>Cacao Macchiato Bánh Quy</h3>
                  <p>Cacao Barry nguyên bản hòa cùng sữa tươi nông trại Đà Lạt, phủ lớp macchiato bông mịn và vụn bánh quy cacao giòn rụm. Mỗi ngụm là một tầng bất ngờ: giòn, mịn, rồi đậm sâu.</p>
                  <blockquote>Chúng tôi muốn mùa lạnh không chỉ được cảm nhận bằng thời tiết, mà còn bằng vị giác.</blockquote>
                  <h3>Kiều Mạch Trân Châu</h3>
                  <p>Kiều mạch rang thơm mùi ngũ cốc, kết hợp sữa tươi và trân châu nấu mới mỗi giờ. Thức uống dành cho những ai yêu vị béo thanh, ngọt nhẹ và hậu vị ấm áp.</p>
                  <figure class="img_scalin" data-scroll><img src="/assets/img/scenes/craft-cream.jpg" alt="Rót kem tươi Pháp vào ly trà" /></figure>
                  <h3>Yuzu Muối Hoa Pháp</h3>
                  <p>Trà Xuân lá nhỏ, mứt yuzu mật ong và chút muối hoa Fleur de Sel vùng Bretagne — một nốt tươi sáng giữa những ngày se lạnh. Bộ sưu tập phục vụ tại tất cả cửa hàng từ 27/11 đến hết tháng 2/2027.</p>
                </div>
                <div class="single_meta_bar">
                  <div class="single_tags">
                    <span class="bellfont">TAGS</span>
                    <a href="./news.html">#ThuDong</a>
                    <a href="./news.html">#CacaoBarry</a>
                    <a href="./news.html">#KemMuoi</a>
                  </div>
                  <div class="social_media">
                    <a class="icon-fb" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên Facebook"></a>
                    <button type="button" data-copy-link aria-label="Sao chép liên kết bài viết"><i class="icon-link"></i></button>
                  </div>
                </div>
                <section class="related_news">
                  <h2 class="bellfont">Bài viết liên quan</h2>
                  <ul class="listpost_style">
${related.map((p) => `                    <li class="listpost">
                      <a href="./news-detail.html" title="${esc(p.title)}">
                        <div class="date">${p.date}</div>
                        <div class="posttitle">${esc(p.title)}</div>
                        <div class="linkto"><div class="arrow"><i class="line"></i><i class="icon-arrowright"></i></div></div>
                        <div class="post_image"><figure><img src="/assets/img/scenes/${p.img}" alt="${esc(p.title)}" /></figure></div>
                      </a>
                    </li>`).join('\n')}
                  </ul>
                </section>
              </article>
            </div>
          </div>
        </main>

        `;

const withTitle = (html, title, desc) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`);

writeFileSync(
  join(ROOT, 'news.html'),
  withTitle(before, 'Bản tin — NEWS | HAI COFE', 'Bản tin, sự kiện và câu chuyện mới nhất từ HAI COFE.') + newsMain + footer
);
writeFileSync(
  join(ROOT, 'news-detail.html'),
  withTitle(before, 'Thực đơn Thu Đông — NEWS | HAI COFE', 'HAI COFE ra mắt thực đơn Thu Đông với Kiều Mạch Rang, Cacao Barry và Yuzu Muối Hoa Pháp.') + detailMain + footer
);

console.log('Generated news.html and news-detail.html');
