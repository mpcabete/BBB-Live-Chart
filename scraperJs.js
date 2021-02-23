  
  function getFollowers(){
    //  um é pra tela com 1 mes e a outra pra tela principal
    let n
    if(document.URL.includes('monthly')){
      n = document.getElementById('socialblade-user-content').children[4].children.length
    }else{
      n =document.querySelector('#socialblade-user-content').children[10].children.length 
    }
    
    let username = document.querySelector('#YouTubeUserTopInfoBlockTop a').innerText
    var objs = []
    let date
    let followers
    for(let i = 0;i <= n-3;i++){
      if(document.URL.includes('monthly')){    
        date = document.getElementById('socialblade-user-content').children[4].children[i].children[0].children[0].innerText
        followers = document.getElementById('socialblade-user-content').children[4].children[i].children[1].children[1].innerText
      }else{ 
        date = document.querySelector('#socialblade-user-content').children[10].children[i].children[0].children[0].innerText
        followers = document.querySelector('#socialblade-user-content').children[10].children[i].children[1].children[1].innerText
      }
      followers = followers.replaceAll(',','')
      objs.push({date:new Date(date),username:username, followers:followers})
      
    }
    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      
      element.style.display = 'none';
      document.body.appendChild(element);
      
      element.click();
      
      document.body.removeChild(element);
    }
    download(username + '.json',JSON.stringify(objs))
    return objs.length
  }
  getFollowers()
    
    