var delay = function(input) {
  console.log('delay running');
  setTimeout(() => delaylevel2(input + 1), 3000);
};

var delaylevel2 = function(input) {
  setTimeout(function() {
    input++;
    console.log('delaylevel2 running', input);
    return input;
  }, 3000);
};

function test() {
  var arr = [1, 2, 3, 4, 5, 6, 7];
  var promises = [];
  arr.map(cur => {
    return (cur = delay(cur));
  });

  return Promise.all(arr).then(data => {
    console.log('should run at the end', data);
  });
}

test();
// delaylevel2(4);
