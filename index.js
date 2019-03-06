(function () {
    //設定常數
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const data = []
    const dataPanel = document.getElementById('data-panel')
    const searchInput = document.getElementById('search')
    const searchBtn = document.getElementById('submit-search')
    const pagination = document.getElementById('pagination')
    const ITEM_PER_PAGE = 15

    //取得api
    axios.get(INDEX_URL)
        .then((response) => {
            data.push(...response.data.results)
            displayDataList(data)
            getTotalpages(data)
            getPageData(1, data)
        }).catch((err) => console.log(err))

    //searchbar
    searchBtn.addEventListener('click', event => {
        event.preventDefault()
        let results = []
        const regex = new RegExp(searchInput.value, 'i')
        results = data.filter(user => user.name.match(regex))
        getTotalpages(results)
        getPageData(1, results)
    })

    //顯示主頁面
    function displayDataList(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
     <div class="col-sm-4">
          <div class="card mb-2 text-center">
            <div class="card" data-toggle="modal" data-id="${item.id}">
              <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h5 class="card-title">${item.name} ${item.surname}</h5>
                
                 <!-- "More" button -->
                <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More</button>

                <!-- favorite button -->
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>  
    `
        })
        dataPanel.innerHTML = htmlContent
        console.log(htmlContent)
    }

    //點擊事件
    dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-user')) {
            showUser(event.target.dataset.id)
        } else if (event.target.matches('.btn-add-favorite')) {
            addFavoriteItem(event.target.dataset.id)
        }
    })

    //點擊視窗
    function showUser(id) {
        const modalTitle = document.getElementById('show-user-title')
        const modalImage = document.getElementById('show-user-image')
        const modalGender = document.getElementById('show-user-gender')
        const modalBirthday = document.getElementById('show-user-birthday')
        const modalAge = document.getElementById('show-user-age')
        const modalRegion = document.getElementById('show-user-region')
        const modalEmail = document.getElementById('show-user-email')

        const url = INDEX_URL + id
        axios.get(url).then(response => {
            const data = response.data
            modalTitle.textContent = data.name + ' ' + data.surname
            modalImage.innerHTML = `<img src="${data.avatar}" alt="">`
            modalGender.textContent = data.gender
            modalBirthday.textContent = data.birthday
            modalAge.textContent = data.age
            modalRegion.textContent = data.region
            modalEmail.textContent = data.email
        })
    }

    //收藏頁面到localStorage
    function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
        const user = data.find(item => item.id === Number(id))

        if (list.some(item => item.id === Number(id))) {
            alert(`${user.name} ${user.surname} is already in your favorite list.`)
        } else {
            list.push(user)
            alert(`Added ${user.name} ${user.surname} to your favorite list!`)
        }
        localStorage.setItem('favoriteUsers', JSON.stringify(list))
    }

    //顯示分頁號碼
    function getTotalpages(data) {
        totalpages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
        let pageItemContent = ''
        for (let i = 0; i < totalpages; i++) {
            pageItemContent += `
        <li class="page-item">
                    <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
                </li>
        `
        }
        pagination.innerHTML = pageItemContent
    }

    //設定分頁監聽事件
    pagination.addEventListener('click', event => {
        if (event.target.tagName === 'A') {
            getPageData(event.target.dataset.page)
        }
    })

    //取得分頁資料
    let paginationData = []

    function getPageData(pageNum, data) {
        paginationData = data || paginationData
        let offset = (pageNum - 1) * ITEM_PER_PAGE
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
        displayDataList(pageData)
    }



})()

