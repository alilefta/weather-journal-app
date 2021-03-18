/* Global Variables */
const APIURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const APIKEY = '&appid=f20d62c24bafab987722d901dc74af75';
// Create a new date instance dynamically with JS
const d = new Date();
const newDate = `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;

const getData = async (url = '') => {
  const request = await fetch(url);
  try {
    if (request.ok) {
      const data = await request.json();
      // console.log(data);
      return data;
    }
  } catch (err) {
    console.log('Error:', err);
  }
};

const sendData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const updateUI = async (data) => {
  const date = document.querySelector('#date');
  const temp = document.querySelector('#temp');
  const content = document.querySelector('#content');

  await data.forEach((e) => {
    const dateP = document.createElement('p');
    const tempP = document.createElement('p');
    const contentP = document.createElement('p');

    dateP.innerText = e.date;
    tempP.innerText = `${e.temp}°C`;
    if (e.content !== '') {
      contentP.innerText = e.content;
    } else {
      contentP.innerText = '-';
    }

    date.appendChild(dateP);
    temp.appendChild(tempP);
    content.appendChild(contentP);
  });
};

const weatherFetch = async (url = '', APIKEY = '', zipCode = '', units = '&units=metric') => {
  const fullRequestedURL = `${url + zipCode},${APIKEY}${units}`;

  await fetch(fullRequestedURL).then((response) => {
    if (response.ok) {
      return response.json();
    } if (response.status === 404) {
      return Promise.reject('Error 404');
    }
    return Promise.reject('Some other error stuff', response.status);
  })
    .then((data) => data)
    .catch((error) => {
      console.log('There is an Error:', error);
    });
};

const searchForWeather = () => {
  const zipCodeInput = document.querySelector('#zip');
  const feelings = document.querySelector('#feelings');
  const generateBTN = document.querySelector('#generate');
  generateBTN.addEventListener('click', () => {
    if (zipCodeInput.value !== '') {
      weatherFetch(APIURL, APIKEY, zipCodeInput.value, '').then((data) => {
        // If there is NO ZIP code put a default degree
        if (typeof data === 'object') {
          return data.main.temp;
        }
        return 10;
      }).then((tempreture) => {
        const data = {
          temp: tempreture,
          date: newDate.toString(),
          content: feelings.value,
        };
        sendData('http://localhost:4022/weather', data).then((res) => {
          // Clean #entryHolder contents before applying a new content
          document.querySelector('#date').innerHTML = '';
          document.querySelector('#temp').innerHTML = '';
          document.querySelector('#content').innerHTML = '';

          updateUI(res);
        });
        zipCodeInput.value = '';
        feelings.value = '';
      });
    }
  });
};

// searchForWeather()
getData('http://localhost:4022/weather').then(() => {
  searchForWeather();
});
