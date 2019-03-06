(function () {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const dataPanel = document.getElementById('data-panel')
    const data = JSON.parse(localStorage.getItem('favoriteUsers')) || []

    //將localStorage存的資料傳到favroite裡
    displayDataList(data)
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
                <!-- remove button -->
                <button class="btn btn-info btn-remove-favorite btn-danger"" data-id="${item.id}">X</button>
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
        if (event.target.matches('.btn-remove-favorite')) {
            removeFavoriteItem(event.target.dataset.id)
        }
    })

    //刪除頁面
    function removeFavoriteItem(id) {
        const index = data.findIndex(item => item.id === Number(id))
        if (index === -1) return
        data.splice(index, 1)
        localStorage.setItem('favoriteUsers', JSON.stringify(data))
        displayDataList(data)
    }

})()