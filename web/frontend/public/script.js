const host = "https://8927-171-60-148-191.in.ngrok.io";
const links  = document.head.getElementsByTagName("link");
let status;

async function getIconBar (){
    let shape = '';
    let iconSize = '';
    let appStatus = '';
    let isMobile = '';
    const method = "GET";
    const responseShop = await fetch(`${host}/api/media_icons/icons_configurations?shop_url=${shopUrl}`, {
        method,
        headers:{ "ngrok-skip-browser-warning":"xyz", "User-Agent":"xyz" }
    });
    if (responseShop.ok){
        const data = await responseShop.json();
        console.log(data)
        status = isHomePage(data[0].appearance_location);
        barPosition(data[0].position, data[0].app_status, data[0].vertical_position, data[0].horizontal_position, data[0].minimization, data[0].mobile_behaviour);
        shape = data[0].shape; iconSize = data[0].icon_size; appStatus = data[0].app_status; isMobile = data[0].mobile_behaviour
    }

    const responseIcons = await fetch(`${host}/api/media_icons/icons_links?shop_url=${shopUrl}`, {
        method,
        headers:{ "ngrok-skip-browser-warning":"xyz", "User-Agent":"xyz" }
    });
    if (responseIcons.ok){
        const data = await responseIcons.json();
        for (const key in data)
        {
            if (data.hasOwnProperty(key))
            {
                const url = data[key].icon_link;
                const color = data[key].icon_color;
                const icon = data[key].icon;
                const title = data[key].icon_title;
                list(url, color, shape, icon, iconSize, appStatus, isMobile, title);
            }
        }
    }
}

_ = getIconBar();

document.body.style.position = "relative";
function create(htmlStr) {
    const frag = document.createDocumentFragment(),
        temp = document.createElement('div');
        temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.lastChild);
    }
    return frag;
}

function setPosition(position, verticalPosition, horizontalPosition, minimization, ){
    let fragment;
    switch (position) {
        case "Top Left":
            fragment = create('<div id = "a" style="display: block; position: fixed; line-height:0; z-index:5; top: ' + verticalPosition + '%; left:' + horizontalPosition + '%;"><button id="close" style="border: none; cursor: pointer; background-color: #bedddb; padding: 0; font-size: 150%; line-height: 0.5; position: fixed;">&times;</button><div id = mediaIcon style=" "><div></div></div></div>');
            document.body.append(fragment);
            break;
        case "Top Right":
            fragment = create('<div id = "a" style="display: block; position: fixed; line-height:0; z-index:5; top: ' + verticalPosition + '%; right:' + horizontalPosition + '%;"><button id="close" style="border: none; cursor: pointer; background-color: #bedddb; padding: 0; font-size: 150%; line-height: 0.5; position: fixed;">&times;</button><div id = mediaIcon style=" "><div></div></div></div>');
            document.body.append(fragment);
            break;
        case "Bottom Left":
            fragment = create('<div id = "a" style="display: block; position: fixed; line-height:0; z-index:5; bottom: ' + verticalPosition + '%; left:' + horizontalPosition + '%;"><button id="close" style="border: none; cursor: pointer; background-color: #bedddb; padding: 0; font-size: 150%; line-height: 0.5; position: fixed;">&times;</button><div id = mediaIcon style=" "><div></div></div></div>');
            document.body.append(fragment);
            break;
        default:
            fragment = create('<div id = "a" style="display: block; position: fixed; line-height:0; z-index:5; bottom: ' + verticalPosition + '%; right:' + horizontalPosition + '%;"><button id="close" style="border: none; cursor: pointer; background-color: #bedddb; padding: 0; font-size: 150%; line-height: 0.5; position: fixed;">&times;</button><div id = mediaIcon style=" "><div></div></div></div>');
            document.body.append(fragment);
    }
    if(minimization){
        const targetDiv = document.getElementById("mediaIcon");
        const sideElement = document.getElementById("a")
        const closeBtn = document.getElementById("close");
        switch (position) {
            case "Top Left":
                closeBtn.onclick = function () {
                    if (targetDiv.style.display !== "none") {
                        setStyleOnHide(targetDiv, closeBtn);
                        sideElement.style.top = "50px";
                        sideElement.style.left = "50px";
                    }else {
                        setStyleOnShow(targetDiv, closeBtn);
                        sideElement.style.top = verticalPosition+"%";
                        sideElement.style.left = horizontalPosition+"%";
                    }
                }
                break
            case "Top Right":
                closeBtn.onclick = function () {
                    if (targetDiv.style.display !== "none") {
                        setStyleOnHide(targetDiv, closeBtn);
                        sideElement.style.top = "50px";
                        sideElement.style.right = "100px";
                    }else {
                        setStyleOnShow(targetDiv, closeBtn);
                        sideElement.style.top = verticalPosition+"%"
                        sideElement.style.right = horizontalPosition+"%";
                    }
                }
                break
            case "Bottom Left":
                closeBtn.onclick = function () {
                    if (targetDiv.style.display !== "none") {
                        setStyleOnHide(targetDiv, closeBtn);
                        sideElement.style.bottom = "50px";
                        sideElement.style.left = "50px";
                    }else {
                        setStyleOnShow(targetDiv, closeBtn);
                        sideElement.style.bottom = verticalPosition+"%";
                        sideElement.style.left = horizontalPosition+"%";
                    }
                }
                break
            default:
                closeBtn.onclick = function () {
                    if (targetDiv.style.display !== "none") {
                        setStyleOnHide(targetDiv, closeBtn);
                        sideElement.style.bottom = "100px";
                        sideElement.style.right = "100px";
                    }else {
                        setStyleOnShow(targetDiv, closeBtn);
                        sideElement.style.bottom = verticalPosition+"%";
                        sideElement.style.right = horizontalPosition+"%";
                    }
                }
        }
    }else {
        const closeBtn = document.getElementById("close");
        closeBtn.style.display = "none";
    }
}

function setStyleOnShow(targetDiv, closeBtn){
    targetDiv.style.display = "block";
    closeBtn.innerHTML = "&times;";
    closeBtn.style.color = 'initial';
    closeBtn.style.padding = "0";
    closeBtn.style.height = "fit-content";
    closeBtn.style.width = "fit-content";
    closeBtn.style.borderRadius = "0%";
}

function setStyleOnHide(targetDiv, closeBtn){
    targetDiv.style.display = "none";
    closeBtn.innerHTML = '&#10133;';
    closeBtn.style.color = '#454f5b';
    closeBtn.style.padding = "5px";
    closeBtn.style.height = "50px";
    closeBtn.style.width = "50px";
    closeBtn.style.borderRadius = "50%";
}

function setShape(url, color, shape, iconImg, iconSize, title){
    console.log(color)
    let media = create('');
    if (shape === "rectangle") {
        const style = "background-color:" + color + ";"
        media = create('<div id=' + title + ' style=' + style + '><a href=' + url + ' target= "_blank" rel="noreferrer noopener"><img src=' + host + iconImg + ' width=' + iconSize + 'px height=' + iconSize + 'px  alt=""/></a></div><br>');
    } else if (shape === "circle") {
        const style = "background-color:" + color + ";" + "border-radius:50%;" + "margin:" + "2px;" + "display:" + "inline-table;" + "padding:" + "5px;"
        media = create('<div id='+ title + ' style=' + style + '><a href=' + url + ' target = "_blank" rel="noreferrer noopener"><img src=' + host + iconImg + ' width=' + iconSize + 'px height=' + iconSize + 'px  alt=""/></a></div><br>');
    }
    const icon = document.getElementById("mediaIcon");
    icon.append(media);

    document.getElementById(title).addEventListener("mouseover", function() {
        document.getElementById(title).style.backgroundColor = "white";
    });

    document.getElementById(title).addEventListener("mouseout", function() {
        document.getElementById(title).style.backgroundColor = color;
    });
}

function isHomePage(appearanceLocation){
    let status = false;
    if(appearanceLocation === "homePage"){
        for(let i = 0; i < links.length; i++){
            if(links[i].rel === "canonical" && links[i].href === shopUrl+"/"){
                status = true;
            }
        }
    }else if(appearanceLocation === "entireStore"){
        status = true;
    }

    return status;
}



function barPosition(position, appStatus, verticalPosition, horizontalPosition, minimization, isMobile) {
  if (appStatus === "App enabled") {
        if(isMobile){
            status?setPosition(position, verticalPosition, horizontalPosition, minimization):null
        }else {
            if(screen.availWidth >= 480){
                status?setPosition(position, verticalPosition, horizontalPosition, minimization):null
            }
        }
    }
}

function list(url, color, shape, iconImg, iconSize, appStatus, isMobile, title) {
    if (appStatus === "App enabled") {
        if(isMobile){
            status?setShape(url, color, shape, iconImg, iconSize, title):null
        }else {
            if(screen.availWidth >= 480){
                status?setShape(url, color, shape, iconImg, iconSize, title):null
            }
        }
    }
}
