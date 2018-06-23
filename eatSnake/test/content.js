var a = [[1, 2], [1, 3], [1, 2], [1, 4]];

var b = a.filter(m => !a[0] && m === a[0]).length;
console.log(b);

var c = a.filter(m => m == a[0]);
console.log(c);
