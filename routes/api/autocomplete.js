const search1 = document.getElementById('search1');
const search2 = document.getElementById('search2');
const matchList = document.getElementById('possible-match1');
const matchList2 = document.getElementById('possible-match2');

search1.addEventListener('input', () => autocompleteActorName(search1.value, matchList));
search2.addEventListener('input', () => autocompleteActorName(search2.value, matchList2));
document.getElementsByTagName("body")[0].addEventListener("click", function(){
    document.querySelectorAll("#possible-match1").forEach(element => {
        element.innerHTML = '';
    });

    document.querySelectorAll("#possible-match2").forEach(element => {
        element.innerHTML = '';
    });
    
  });

async function autocompleteActorName(searchText, element){
    $.post({
        url: '/autocomplete',
        dataType: 'json',
        data: {
            text: searchText
          },
        success: (data) => {
            console.log(data);
            if (searchText == 0 || data.length === 0){
                console.log(data);
                data = [];
                element.innerHTML ='';
            }
            // console.log(data);
            outputHTML(data.slice(0, 6), element);
            $(element).parent().find(".possible-match a").click((e) =>{
                $(element).siblings(".form-control").val($(e.currentTarget).data("name"));
                e.preventDefault();
            })
        }
      });
    

};

function outputHTML(actors, element){
    if(actors.length > 0){
        const html = actors.map(match => `
        
        <a href="#" data-name="${match.name}" class="list-group-item list-group-item-action text-left">${match.name} <small class="text-muted">Known for: ${match.known_for.join(', ')}</small></a>
      
        `).join('');

        element.innerHTML = html;
    }
}

