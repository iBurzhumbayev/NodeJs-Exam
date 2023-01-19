// Вывод времени

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

function timeBegan() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.querySelector('.header__time').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function() {
      timeBegan()
    }, 500);
  }
  timeBegan();




//   let arr = [];
// let obj = { key1: 'value1', key2: 'value2', key3: 'value2' }

// arr = Object.entries(obj).filter(([key]) => key !== 'key2').map(([key, value]) => ({[key]: value}));

// // В итоге получим массив объектов:
// [
//   {key1: 'value1'}, 
//   {key3: 'value3'}
// ]


  