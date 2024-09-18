// USER INFO CHECK AND SHOW ACCORDINGLY
if (localStorage.getItem("userInfo") != null) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  document.querySelector(".user-avatar").src = userInfo.avatar;
  document.querySelector(".user-name-greet").innerHTML =
    "Hi, " + userInfo.name + "<i>!</i>";
  document.querySelector(".name-input-inner").value = userInfo.name;
  console.log('dd')
} else {
  document.querySelector(".user-info-modal-outer").style.display = "flex";
  document.querySelector(".search-page").style.display = "none";
}

// WEATHER INFO RETRIVING FROM LS
if (localStorage.getItem("weatherInfo") != null) {
  let weatherInfo = JSON.parse(localStorage.getItem("weatherInfo"));
  document.querySelector(".weather-city").innerHTML = weatherInfo?.weatherCity;
  document.querySelector(".weather-icon").src = weatherInfo?.weatherIconSrc;
  document.querySelector(".weather-icon").alt = weatherInfo?.weatherIconAlt;
  document.querySelector(".weather-temp").innerHTML = weatherInfo?.weatherTemp;
}

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  getWeather(position.coords.latitude, position.coords.longitude);
}

function error() {
  console.log("error getting location");
}

async function getWeather(lat, long) {
  const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat}%2C${long}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "b22f8f85b1msh57d3ae822a05374p192b61jsn1537209eaf0a",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    document.querySelector(".weather-city").innerHTML = result?.location?.name;
    document.querySelector(".weather-icon").src =
      result?.current?.condition?.icon;
    document.querySelector(".weather-icon").alt =
      result?.current?.condition?.text;
    document.querySelector(
      ".weather-temp"
    ).innerHTML = `${result?.current?.temp_c}°C`;

    let weatherInfo = {
      weatherCity: result?.location?.name,
      weatherIconSrc: result?.current?.condition?.icon,
      weatherIconAlt: result?.current?.condition?.text,
      weatherTemp: `${result?.current?.temp_c}°C`,
    };
    localStorage.setItem("weatherInfo", JSON.stringify(weatherInfo));
  } catch (error) {
    console.error(error);
  }
}

// TRENDING CRYPTO FETCHING
async function fetchTrendingCrypto(params) {
  fetch("https://api.coingecko.com/api/v3/search/trending")
    .then((res) => res.json())
    .then((data) => {
      data.coins.forEach((coin) => {
        const img = document.createElement("img");
        img.src = coin.item.small;
        const name = document.createElement("div");
        name.innerHTML = coin.item.name;
        const price = document.createElement("div");
        price.innerHTML = `$${
          Math.floor(coin.item.data.price * 10000) / 10000
        }`;
        const info = document.createElement("div");
        info.append(name, price);
        const card = document.createElement("div");
        card.append(img, info);
        card.className = "crypto-card";
        document.querySelector(".rolling-slide").append(card);
      });
      let copy = document.querySelector(".rolling-slide").cloneNode(true);
      document.querySelector(".finance-rolling-bar").appendChild(copy);
    });
}

fetchTrendingCrypto();

// SELECT USER AVATAR AND SAVE USER INFO
document.querySelector(".user-avatar").addEventListener("click", () => {
  if (document.querySelector(".user-info-modal").style.display == "flex") {
    document.querySelector(".user-info-modal").style.display = "none";
  } else {
    document.querySelector(".user-info-modal").style.display = "flex";
  }
});

let selectedAvatar = null;

function selectAvatar(avatar) {
  document.querySelector(".avatar-select-error").style.display = "none";
  document.querySelector(".avatar-select-error-inner").style.display = "none";

  if (selectedAvatar) {
    selectedAvatar.classList.remove("selected");
  }

  avatar.classList.add("selected");
  selectedAvatar = avatar;
}

document.querySelector(".user-info-form").addEventListener("submit", (e) => {
  e.preventDefault();

  if (selectedAvatar == null) {
    document.querySelector(".avatar-select-error").style.display = "block";
  } else {
    let userInfo = {
      name: `${document.querySelector(".name-input").value}`,
      avatar: `${new URL(selectedAvatar.src).pathname}`,
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    document.querySelector(".user-avatar").src = userInfo.avatar;
    document.querySelector(".user-name-greet").innerHTML =
      "Hi, " + userInfo.name + "<i>!</i>";
    document.querySelector(".user-info-modal").style.display = "none";
    document.querySelector(".user-info-modal-outer").style.display = "none";
    document.querySelector(".search-page").style.display = "block";
    document.querySelector(".name-input-inner").value = userInfo.name;

  }
});

document.querySelector(".user-info-form-inner").addEventListener("submit", (e) => {
  e.preventDefault();

  if (selectedAvatar == null) {
    document.querySelector(".avatar-select-error-inner").style.display = "block";
  } else {
    let userInfo = {
      name: `${document.querySelector(".name-input-inner").value}`,
      avatar: `${new URL(selectedAvatar.src).pathname}`,
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    document.querySelector(".user-avatar").src = userInfo.avatar;
    document.querySelector(".user-name-greet").innerHTML =
      "Hi, " + userInfo.name + "<i>!</i>";
    document.querySelector(".user-info-modal").style.display = "none";
    document.querySelector(".user-info-modal-outer").style.display = "none";
    document.querySelector(".search-page").style.display = "block";
    document.querySelector(".name-input-inner").value = userInfo.name;
  }
});