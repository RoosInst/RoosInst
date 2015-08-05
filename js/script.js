/* Author: Roos Instruments, Ryan Benech
  */
$('#about').click(function() {
  $('#about-content').slideUp('slow', function() {
  });
});

function sortList(listId)
{
var ul = document.getElementById(listId);
arrList = new Array();
j = 0;
for (i=0; i<ul.childNodes.length; i++) {
if (ul.childNodes[i].innerHTML == undefined) continue;
arrList[j] = ul.childNodes[i].innerHTML;
j++;
}
j = 0;
arrList.sort();
for (i=0; i<ul.childNodes.length; i++) {
if (ul.childNodes[i].innerHTML == undefined) continue;
ul.childNodes[i].innerHTML = arrList[j];
j++;
}
}
