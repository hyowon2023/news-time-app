//const API_KEY = 'mCQmjtyrRM-BfZWxIlrxCHsraHfGPcCmsdwbyb3S28s';
let articles = [];
let page = 1;
let totalPage = 1;
let url = new URL(
  `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR`
);
let menus = document.querySelectorAll('#menu-list button');
menus.forEach((menus) => {
  menus.addEventListener('click', (e) => getNewsByTopic(e));
});

const getNews = async () => {
  try {
    let header = new Headers();
    header.append('x-api-key', API_KEY);
    url.searchParams.set('page', page); // page를 달아준다
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        console.log('A', data);
        page = 0;
        totalPage = 0;
        renderPagenation();
        throw new Error(data.status);
      }
      console.log('B', data);
      articles = data.articles;
      console.log('articles', articles);
      totalPage = data.total_pages;
      render();
      renderPagenation();
    } else {
      page = 0;
      totalPage = 0;
      renderPagenation();
      throw new Error(data.message);
    }
  } catch (e) {
    console.log('에러객체', e.name);
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagenation();
  }
};
const getLatesNews = async () => {
  page = 1; // 새로운 거 search마다 1로 리셋
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  getNews();
};

const getNewsByTopic = (event) => {
  let topic = event.target.textContent.toLowerCase();
  page = 1;

  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById('input-area');
  inputArea.style.display === 'inline'
    ? (inputArea.style.display = 'none')
    : (inputArea.style.display = 'inline');
};

const searchNews = () => {
  let keyword = document.getElementById('search-input').value;
  page = 1;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let resultHTML = articles
    .map((item) => {
      return ` <div class="row">
        <div class="col-lg-4">
          <img
            class="news-image-size"
            src="${
              item.media ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'
            }"
            alt="기사 사진"
          />
        </div>
        <div class="col-lg-8">
          <a class="title" target="_blank" href="${item.link}">${item.title}</a>
          <p>${
            item.summary == null || item.summary == ''
              ? '내용없음'
              : item.summary.length > 200
              ? item.summary.substring(0, 200) + '...'
              : item.summary
          }</p>
          <div>${item.rights || 'no source'} ${item.published_date}</div>
        </div>
      </div>`;
    })
    .join('');

  document.getElementById('news-board').innerHTML = resultHTML;
};

const renderPagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    // 마지막 그룹이 5개 이하라면
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4; // 첫 그룹이 5이하라면
  if (first >= 6) {
    pagenationHTML = `<li class="page-item" onclick="pageClick(1)">
    <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
  </li>
  <li class="page-item" onclick="pageClick(${page - 1})">
    <a class="page-link" href='#js-bottom'>&lt;</a>
  </li>`;
  }
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${i == page ? 'active' : ''}" >
    <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
   </li>`;
  }
  if (last < totalPage) {
    pagenationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
       </li>
       <li class="page-item" onclick="pageClick(${totalPage})">
        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
       </li>`;
  }

  document.querySelector('.pagination').innerHTML = pagenationHTML;
};

const pageClick = (pageNum) => {
  // 클릭 이벤트 세팅
  page = pageNum;
  window.scrollTo({ top: 0, behavior: 'auto' });
  getNews();
};
const errorRender = (message) => {
  document.getElementById(
    'news-board'
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

getLatesNews();

const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
};

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
};
