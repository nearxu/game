var a = [[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]];
var timer = setInterval(function() {
  a.forEach(m => {
    if (m[1] >= 6) {
      m[1] = 0;
    } else {
      m[1]++;
    }
  });
  console.log(a, "a");
}, 1000);

console.log(a);
