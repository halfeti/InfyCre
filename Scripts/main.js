//Variable
var back_canvas = document.getElementById("back-canvas");
class Tool {
    constructor(name){
        this.name = name
        this.value = 0;
        this.fx = undefined;
    }
}
class History {
    constructor(){
        this.list = [];
        this.index = -1;
    }
    
    isEmpty(){
        if(this.list.length==0)    return true;
        else return false;
    }
    
    undo(){
        if(this.isFirst()){
            return null;
        }
        else{
            return this.list[this.index--];
        }
    }
    
    NewDo(obj){
        this.list.splice(++this.index);
        this.list[this.index] = [];
        this.list[this.index].tool = obj.tool.name;
        this.list[this.index].value = {before:obj.value.before,after:obj.value.after};
    }
    
    redo(){
        if(this.isLast()){
            return null
        }
        else return this.list[++this.index];
    }
    
    isLast(){
        if(this.index + 1 == this.list.length) return true;
        else return false;
    }
    
    isFirst(){
        if(this.index == -1) return true;
        else return false;
    }
}
class Change {
    constructor(){
        this.tool = "";
        this.value = [];
    }
}
var filterThumbnail = [];
filterThumbnail.filter_1 = document.getElementById("filter-1");
filterThumbnail.filter_2 = document.getElementById("filter-2");
filterThumbnail.filter_3 = document.getElementById("filter-3");
filterThumbnail.filter_4 = document.getElementById("filter-4");
filterThumbnail.filter_5 = document.getElementById("filter-5");
addAllHandlersNormal(filterThumbnail,"filter-active");
var operation = [];
var doing = false;
var wait_screen = document.getElementById("wait-screen");
var front_canvas = document.getElementById("front-canvas");
var cropper_canvas = document.getElementById("cropper");
var process_canvas = document.getElementById("process");
var fileURL = document.getElementById("file-chooser");
var slider = document.getElementById("slider");
var slider_val = document.getElementById("slider-value");
var confirmed = document.getElementById("confirm");
var wrapper = document.getElementById("image-wrapper");
var save_button = document.getElementById("save");
var undo_button = document.getElementById("undo-butt");
var redo_button = document.getElementById("redo-butt");
var scale_ratio = [];
var IMGloaded=false;
let history = new History();
let change = new Change();
var slideroperation;
var ctxb = back_canvas.getContext('2d');
var ctxf = front_canvas.getContext('2d');
var ctxc = cropper_canvas.getContext('2d');
var ctxp = process_canvas.getContext('2d');
var cropProp = [];
cropProp.x = 0;
cropProp.y = 0;
cropProp.w = 0;
cropProp.h = 0;
var taskR = newThread(convolute),
    taskG = newThread(convolute),
    taskB = newThread(convolute);
terminateWorker();
var stockDataImage;
var canvasPos = front_canvas.getBoundingClientRect();
var canvasData;
var tools = [];
var edit = [];
var blendsh = {name:"blendsh",r:0,g:0,b:0,cname:"black-shadowlight"};
var blendhi = {name:"blendhi",r:0,g:0,b:0,cname:"black-highlight"};
var mousePos = [];
var preRatio;
var color = [];
var croppedData;
var average = 0;
var quality = 0.8;
var saved = true;

//Tool Handler
scale_ratio.scalecus = document.getElementById("scale-customise");
scale_ratio.scale1_1 = document.getElementById("scale-1-1");
scale_ratio.scale3_4 = document.getElementById("scale-3-4");
scale_ratio.scale4_3 = document.getElementById("scale-4-3");
scale_ratio.scale9_16 = document.getElementById("scale-9-16");
scale_ratio.scale16_9 = document.getElementById("scale-16-9");
addAllHandlers(scale_ratio,"scale-active");
addOnclick(scale_ratio,function(){
    ratio = 0;
    switch(this.id){
        case "scale-customise":
            ratio = 0;
            break;
        case "scale-1-1":
            ratio = 1;
            break;
        case "scale-3-4":
            ratio = 3/4;
            break;
        case "scale-4-3":
            ratio = 4/3;
            break;
        case "scale-9-16":
            ratio = 9/16;
            break;
        case "scale-16-9":
            ratio = 16/9;
            break;
        default:
            ratio = 0;
            break;
    }
    if(ratio!=0){
        cropProp.w = ratio*cropProp.h;
        drawCropper();
    }
});


tools.exposure = document.getElementById("exposure");
tools.contrast = document.getElementById("contrast");
tools.sharpen = document.getElementById("sharpen");
tools.temperature = document.getElementById("temperature");
tools.saturation = document.getElementById("saturation");
tools.colorH = document.getElementById("color-highlight");
tools.colorS = document.getElementById("color-shadow");
tools.fade = document.getElementById("fade");
tools.highlight = document.getElementById("highlight");
tools.shadow = document.getElementById("shadow");
tools.blur = document.getElementById("blur");
tools.hue = document.getElementById("hue");
tools.crop = document.getElementById("crop");
tools.resize = document.getElementById("resize");
tools.rotate = document.getElementById("rotate");
tools.grain = document.getElementById("grain");
tools.motionBlur = document.getElementById("motionBlur");
addAllHandlers(tools,"tools-active");

color.shadow = [];
color.highlight = [];
color.shadow.black = document.getElementById("black-shadowlight");
color.shadow.yellow = document.getElementById("yellow-shadowlight");
color.shadow.orange = document.getElementById("orange-shadowlight");
color.shadow.red = document.getElementById("red-shadowlight");
color.shadow.pink = document.getElementById("pink-shadowlight");
color.shadow.purple = document.getElementById("purple-shadowlight");
color.shadow.seablue = document.getElementById("seablue-shadowlight");
color.shadow.skyblue = document.getElementById("skyblue-shadowlight");
color.shadow.green = document.getElementById("green-shadowlight");
addAllHandlers(color.shadow,"color-active");
color.shadow.black.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 0;
    blendsh.g = 0;
    blendsh.b = 0;
    blendsh.cname = this.id;
    edit.colorshadow.value = 0;
    initSliderValue(0,0,0);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.yellow.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 200;
    blendsh.g = 194;
    blendsh.b = 46;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.orange.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 199;
    blendsh.g = 151;
    blendsh.b = 45;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.red.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 199;
    blendsh.g = 47;
    blendsh.b = 46;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.pink.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 197;
    blendsh.g = 65;
    blendsh.b = 125;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.purple.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 132;
    blendsh.g = 46;
    blendsh.b = 199;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.seablue.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 47;
    blendsh.g = 60;
    blendsh.b = 200;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.skyblue.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 46;
    blendsh.g = 171;
    blendsh.b = 199;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.shadow.green.onclick = function(){
    change.value.before = Object.assign({},blendsh);
    blendsh.r = 46;
    blendsh.g = 199;
    blendsh.b = 59;
    blendsh.cname = this.id;
    edit.colorshadow.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendsh;
    change.value.after = Object.assign({},blendsh);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}

color.highlight.black = document.getElementById("black-highlight");
color.highlight.yellow = document.getElementById("yellow-highlight");
color.highlight.orange = document.getElementById("orange-highlight");
color.highlight.red = document.getElementById("red-highlight");
color.highlight.pink = document.getElementById("pink-highlight");
color.highlight.purple = document.getElementById("purple-highlight");
color.highlight.seablue = document.getElementById("seablue-highlight");
color.highlight.skyblue = document.getElementById("skyblue-highlight");
color.highlight.green = document.getElementById("green-highlight");
addAllHandlers(color.highlight,"color-active");
color.highlight.black.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 0;
    blendhi.g = 0;
    blendhi.b = 0;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 0;
    initSliderValue(0,0,0);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.yellow.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 230;
    blendhi.g = 228;
    blendhi.b = 119;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.orange.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 230;
    blendhi.g = 187;
    blendhi.b = 119;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.red.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 229;
    blendhi.g = 119;
    blendhi.b = 118;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.pink.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 233;
    blendhi.g = 140;
    blendhi.b = 184;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.purple.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 181;
    blendhi.g = 119;
    blendhi.b = 230;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.seablue.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 118;
    blendhi.g = 130;
    blendhi.b = 230;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.skyblue.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 119;
    blendhi.g = 210;
    blendhi.b = 229;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}
color.highlight.green.onclick = function(){
    change.value.before = Object.assign({},blendhi);
    blendhi.r = 119;
    blendhi.g = 230;
    blendhi.b = 128;
    blendhi.cname = this.id;
    edit.colorhighlight.value = 50;
    initSliderValue(0,100,50);
    change.tool = blendhi;
    change.value.after = Object.assign({},blendhi);
    history.NewDo(change);
    undo_button.classList.remove("do-unavailable");
    showPre();
}

edit.exposure = new Tool("exposure");
edit.contrast = new Tool("contrast");
edit.sharpen = new Tool("sharpen");
edit.saturation = new Tool("saturation");
edit.temperature = new Tool("temperature");
edit.colorshadow = new Tool("color-shadow");
edit.colorhighlight = new Tool("color-highlight");
edit.fade = new Tool("fade");
edit.highlight = new Tool("hightlight");
edit.shadow = new Tool("shadow");
edit.blur = new Tool("blur");
edit.hue = new Tool("hue");
edit.grain = new Tool("grain");
edit.motionBlur = new Tool("motionBlur");

//DOM DOM DOM

fileURL.onchange = function(){
    var file = fileURL.files[0];
    var reader = new FileReader()
    reader.onload = function(e){
        var dataURI = e.target.result;
        var img = new Image();
        img.onload = function(){
            document.getElementById("welcome").style.display = "none";
            back_canvas.width = fitTransform(img.width,img.height).width;
            back_canvas.height = fitTransform(img.width,img.height).height;
            ctxb.drawImage(img,0,0,fitTransform(img.width,img.height).width,fitTransform(img.width,img.height).height);
            back_canvas.style.marginTop = (wrapper.offsetHeight - back_canvas.height)/2 + "px";
            back_canvas.style.marginLeft = (wrapper.offsetWidth - back_canvas.width)/2 + "px";
            process_canvas.width = img.width;
            process_canvas.height = img.height;
            ctxp.drawImage(img,0,0,img.width,img.height);
            stockDataImage = ctxp.getImageData(0,0,img.width,img.height);
            IMGloaded=true;
            save_button.classList.remove("do-unavailable");
            document.getElementsByClassName("slide-bar-wrapper").item(0).style.display = "block";
            preRatio = back_canvas.width / img.width;
            croppedData = ctxb.getImageData(0,0,back_canvas.width,back_canvas.height);
            showPre();
            filterThumbnailsLoad();
            for(var i=0;i<stockDataImage.data.length;i+=4){
                average = (average + ((stockDataImage.data[i] + stockDataImage.data[i+1] + stockDataImage.data[i+2])/3))/2;
            }
            average = (average+128)/2;
        }
        img.src = dataURI;
    };
    reader.readAsDataURL(file);
    back_canvas.style.opacity = "1";
}

save_button.onclick = async function(){
    if(saved){
        await processSave();
        await save_button.click();
        saved = false;
    }
    else{
        save_button.href = "#";
        saved = await true;
    }
}

undo_button.onclick = function(){
    var temp = history.undo();
    if(temp != null){
        if(temp.tool == "blendsh"){
            blendsh = Object.assign(temp.value.before);
            if(temp.value.before.r == 0 && temp.value.before.g == 0 && temp.value.before.b == 0){
                edit.colorshadow.value = 0;
                initSliderValue(0,0,0);
            }
            else if(edit.colorshadow.value == 0){
                edit.colorshadow.value = 50;
                initSliderValue(0,100,50);
            }
            else{
                edit.colorshadow.value = history.list[history.index].value.after;
                initSliderValue(0,100,edit.colorshadow.value);
            }
            removeAllClasses(color.shadow,"color-active");
            document.getElementById(blendsh.cname).classList.add("color-active");
            console.log("undo" + " " + temp.tool);
        }
        else if(temp.tool == "blendhi"){
            blendhi = Object.assign(temp.value.before);
            if(temp.value.before.r == 0 && temp.value.before.g == 0 && temp.value.before.b == 0){
                edit.colorhighlight.value = 0;
                initSliderValue(0,0,0);
            }
            else if(edit.colorhighlight.value == 0){
                edit.colorhighlight.value = 50;
                initSliderValue(0,100,50);
            }
            else{
                edit.colorhighlight.value = history.list[history.index].value.after;
                initSliderValue(0,100,edit.colorhighlight.value);
            }
            removeAllClasses(color.highlight,"color-active");
            document.getElementById(blendhi.cname).classList.add("color-active");
            console.log("undo" + " " + temp.tool);
        }
        else{
            getToolByName(temp.tool).value = temp.value.before; initSliderValue(getSliderMinMax(temp.tool).min,getSliderMinMax(temp.tool).max,temp.value.before);
            console.log(temp.tool + ": " + temp.value.after + "->" + temp.value.before);
        }
        showPre();
        if(history.isFirst()){
            undo_button.classList.add("do-unavailable");
        }
        redo_button.classList.remove("do-unavailable");
    }
}

redo_button.onclick = function(){
    var temp = history.redo();
    if(temp != null){
        if(temp.tool == "blendsh"){
            blendsh = Object.assign(temp.value.after);
            if(temp.value.after.r == 0 && temp.value.after.g == 0 && temp.value.after.b == 0){
                edit.colorshadow.value = 0;
                initSliderValue(0,0,0);
            }
            else if(edit.colorshadow.value == 0){
                edit.colorshadow.value = 50;
                initSliderValue(0,100,50);
            }
            else {
                initSliderValue(0,100,edit.colorshadow.value);
            }
            removeAllClasses(color.shadow,"color-active");
            document.getElementById(blendsh.cname).classList.add("color-active");
            console.log("redo" + " " + temp.tool);
        }
        else if(temp.tool == "blendhi"){
            blendhi = Object.assign(temp.value.after);
            if(temp.value.after.r == 0 && temp.value.after.g == 0 && temp.value.after.b == 0){
                edit.colorhighlight.value = 0;
                initSliderValue(0,0,0);
            }
            else if(edit.colorhighlight.value == 0){
                edit.colorhighlight.value = 50;
                initSliderValue(0,100,50);
            }
            else{
                initSliderValue(0,100,edit.highlight.value);
            }
            removeAllClasses(color.highlight,"color-active");
            document.getElementById(blendhi.cname).classList.add("color-active");
            console.log("redo" + " " + temp.tool);
        }
        else{
            initSliderValue(getSliderMinMax(temp.tool).min,getSliderMinMax(temp.tool).max,temp.value.after);
            getToolByName(temp.tool).value = temp.value.after;
            console.log(temp.tool + ": " + temp.value.before + "->" + temp.value.after);
        }
        showPre();
        if(history.isLast()){
            redo_button.classList.add("do-unavailable")
        }
        undo_button.classList.remove("do-unavailable");
    }
}

cropper_canvas.onmousemove = function(e){
    mousePos.x = parseInt(e.clientX - canvasPos.left);
    mousePos.y = parseInt(e.clientY - canvasPos.top);
    switch(checkCropperMousePos()){
        case 0:
            cropper_canvas.style.cursor = "crosshair";
            break;
        case 1:
            cropper_canvas.style.cursor = "nw-resize";
            break;
        case 2:
            cropper_canvas.style.cursor = "n-resize";
            break;
        case 3:
            cropper_canvas.style.cursor = "ne-resize";
            break;
        case 4:
            cropper_canvas.style.cursor = "e-resize";
            break;
        case 5:
            cropper_canvas.style.cursor = "se-resize";
            break;
        case 6:
            cropper_canvas.style.cursor = "s-resize";
            break;
        case 7:
            cropper_canvas.style.cursor = "sw-resize";
            break;
        case 8:
            cropper_canvas.style.cursor = "w-resize";
            break;
        default:
            cropper_canvas.style.cursor = "move";
            break;
    }
}

cropper_canvas.addEventListener('mousedown',function(){
   operation['mousedown'](); 
});

cropper_canvas.addEventListener('mousemove',function(){
   operation['mousemove']();
});

cropper_canvas.addEventListener('mouseup',function(){
   operation['mouseup']();
});

confirmed.onclick = function(){
    croppedData = cropImage();
    cropper_canvas.style.display = "none";
    confirmed.style.display = "none";
    document.getElementsByClassName("scale-crop").item(0).style.display = "none";
    showPre();
    filterThumbnailsLoad();
}

slider.addEventListener('mousedown',function(){
    change.tool = getActiveTool();
    change.value.before = change.tool.value;
});

slider.addEventListener('mouseup',function(){
    change.value.after = slider.value;
    if(change.tool != null && change.value.after != change.value.before){
        history.NewDo(change);
        undo_button.classList.remove("do-unavailable")
        redo_button.classList.add("do-unavailable");
    }
});

slider.oninput = function(){
    slider_val.value = slider.value;
    canvasData = ctxb.getImageData(0,0,back_canvas.width,back_canvas.height);
    slideroperation(canvasData,slider.value);
    canvasData.width;
}

slider_val.oninput = function(){
    if(slider_val.value>100) slider_val.value = 100;
    else if(slider_val.value<-100) slider_val.value = -100;
    slider.value = slider_val.value;
    canvasData = ctxb.getImageData(0,0,back_canvas.width,back_canvas.height);
    slideroperation(canvasData,slider.value);
}

tools.crop.onclick = function(){
    if(IMGloaded){
        var ratio = 0;
        cropper_canvas.style.display = "block";
        back_canvas.style.display = "block";
        back_canvas.style.opacity = "1";
        front_canvas.style.display = "none";
        front_canvas.style.opacity = "0";
        cropper_canvas.width = back_canvas.width;
        cropper_canvas.height = back_canvas.height;
        cropper_canvas.style.marginLeft = back_canvas.style.marginLeft;
        cropper_canvas.style.marginTop = back_canvas.style.marginTop;
        confirmed.style.display = "inline-block";
        if(cropProp.w != 0 && cropProp.h != 0)  drawCropper();
    }
    operation['mousedown'] = function(){
        doing = true;
        var downPos = [];
            downPos.x = mousePos.x,
            downPos.y = mousePos.y;
        switch(checkCropperMousePos()){
            case 0:
                cropProp.x = mousePos.x;
                cropProp.y = mousePos.y;
                cropProp.w = 0;
                cropProp.h = 0;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.w = mousePos.x-downPos.x;
                        cropProp.h = mousePos.y-downPos.y;
                        drawCropper();
                    }
                }
                operation['mouseup']=function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                }
                break;
            case 1:
                var temp = [];
                if(ratio == 0) ratio = cropProp.w/cropProp.h;
                temp.x = cropProp.x;
                temp.y = cropProp.y;
                temp.w = cropProp.w;
                temp.h = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.x = temp.x + (mousePos.x-downPos.x);
                        cropProp.y = temp.y + parseInt((mousePos.x-downPos.x)/ratio);
                        cropProp.w = temp.w - (mousePos.x-downPos.x);
                        cropProp.h = temp.h - (parseInt((mousePos.x-downPos.x)/ratio));
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    
                }
                break;
            case 2:
                var temp = [];
                temp.y = cropProp.y;
                temp.h = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.y = temp.y + (mousePos.y - downPos.y);
                        cropProp.h = temp.h - (mousePos.y - downPos.y);
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    activeHandler(scale_ratio.scalecus,scale_ratio,"scale-active");
                }
                break;
            case 3:
                var temp = [];
                if(ratio == 0) ratio = cropProp.w/cropProp.h;
                temp.y = cropProp.y;
                temp.w = cropProp.w;
                temp.h = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.y = temp.y - parseInt((mousePos.x-downPos.x)/ratio);
                        cropProp.w = temp.w + (mousePos.x-downPos.x);
                        cropProp.h = temp.h + parseInt((mousePos.x-downPos.x)/ratio);
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                }
                break;
            case 4:
                var temp = cropProp.w;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.w = temp + mousePos.x - downPos.x;
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    activeHandler(scale_ratio.scalecus,scale_ratio,"scale-active");
                }
                break;
            case 5:
                var temp = [];
                if(ratio == 0) ratio = cropProp.w/cropProp.h;
                temp.w = cropProp.w;
                temp.h = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.w = temp.w + (mousePos.x-downPos.x);
                        cropProp.h = temp.h + parseInt((mousePos.x-downPos.x)/ratio);
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                }
                break;
            case 6:
                var temp = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.h = temp + mousePos.y - downPos.y;
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    activeHandler(scale_ratio.scalecus,scale_ratio,"scale-active");
                }
                break;
            case 7:
                var temp = [];
                if(ratio == 0) ratio = cropProp.w/cropProp.h;
                temp.x = cropProp.x;
                temp.w = cropProp.w;
                temp.h = cropProp.h;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.x = temp.x + (mousePos.x-downPos.x);
                        cropProp.w = temp.w - (mousePos.x-downPos.x);
                        cropProp.h = temp.h - parseInt((mousePos.x-downPos.x)/ratio);
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    
                }
                break;
            case 8:
                var temp = [];
                temp.x = cropProp.x;
                temp.w = cropProp.w;
                operation['mousemove'] = function(){
                    if(doing){
                        cropProp.x = temp.x + (mousePos.x-downPos.x);
                        cropProp.w = temp.w - (mousePos.x-downPos.x);
                        drawCropper();
                    }
                }
                operation['mouseup'] = function(){
                    doing = false;
                    if(cropProp.w<0){
                        cropProp.x+=cropProp.w;
                        cropProp.w = 0-cropProp.w;
                    }
                    if(cropProp.h<0){
                        cropProp.y+=cropProp.h;
                        cropProp.h = 0-cropProp.h;
                    }
                    activeHandler(scale_ratio.scalecus,scale_ratio,"scale-active");
                }
                break;
            default:
                var temp = [];
                temp.x = cropProp.x;
                temp.y = cropProp.y;
                operation['mousemove'] = function(){
                    if(doing){
                        if(cropProp.x > 0 && (cropProp.x+cropProp.w) < cropper_canvas.width){
                            cropProp.x = temp.x + (mousePos.x - downPos.x);
                        }
                        else if(cropProp.x <= 0 && (mousePos.x - downPos.x) > 0){
                            cropProp.x = temp.x + (mousePos.x - downPos.x);
                        }
                        else if((cropProp.x+cropProp.w) >= cropper_canvas.width && (mousePos.x - downPos.x) < 0){
                            cropProp.x = temp.x + (mousePos.x - downPos.x);
                        }
                        else {
                            downPos.x = mousePos.x;
                            temp.x = cropProp.x;
                        }
                        if(cropProp.y > 0 && (cropProp.y+cropProp.h) < cropper_canvas.height){
                            cropProp.y = temp.y + (mousePos.y - downPos.y);
                        }
                        else if(cropProp.y <= 0 && (mousePos.y - downPos.y) > 0){
                            cropProp.y = temp.y + (mousePos.y - downPos.y);
                        }
                        else if((cropProp.y+cropProp.h) >= cropper_canvas.height && (mousePos.y - downPos.y) < 0){
                            cropProp.y = temp.y + (mousePos.y - downPos.y);
                        }
                        else {
                            downPos.y = mousePos.y;
                            temp.y = cropProp.y;
                        }
                        drawCropper();
                    }
                };
                operation['mouseup']=function(){
                    doing = false;
                };
                break;
        }
    };
}

tools.exposure.onclick = function(){
    slideroperation = function(){
        edit.exposure.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.exposure.value);
    slider_val.value = edit.exposure.value;
}

tools.contrast.onclick = function(){
    slideroperation = function(){
        edit.contrast.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.contrast.value);
}

tools.sharpen.onclick = function(){
    if(edit.blur.value!=0){
        if(confirm("The blur function may not affect if you change sharpen. Do you want to process?")){
            edit.blur.value = 0;
            showPre();
            slideroperation = function(){
                edit.sharpen.value = slider.value;
                showPre();
            }
            initSliderValue(0,100,edit.sharpen.value);
        }
        else{
            slideroperation = function(){
                if(confirm("The blur function may not affect if you change sharpen. Do you want to process?")){
                    edit.blur.value = 0;
                    slideroperation = function(){
                        edit.sharpen.value = slider.value;
                        showPre();
                    }
                    initSliderValue(0,100,edit.sharpen.value);
                }
            }
        }
    }
    else{
        slideroperation = function(){
            edit.sharpen.value = slider.value;
            showPre();
        }
        initSliderValue(0,100,edit.sharpen.value);
    }
}

tools.temperature.onclick = function(){
    slideroperation = function(){
        edit.temperature.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.temperature.value);
}

tools.saturation.onclick = function(){
    slideroperation = function(){
        edit.saturation.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.saturation.value);
}

tools.colorS.onclick = function(){
    slideroperation = function(){
        edit.colorshadow.value = slider.value;
        showPre();
    }
    initSliderValue(0,100,edit.colorshadow.value);
}

tools.colorH.onclick = function(){
    slideroperation = function(){
        edit.colorhighlight.value = slider.value;
        showPre();
    }
    initSliderValue(0,100,edit.colorhighlight.value);
}

tools.fade.onclick = function(){
    slideroperation = function(){
        edit.fade.value = slider.value;
        showPre();
    }
    initSliderValue(0,100,edit.fade.value);
}

tools.highlight.onclick = function(){
    slideroperation = function(){
        edit.highlight.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.highlight.value);
}

tools.shadow.onclick = function(){
    slideroperation = function(){
        edit.shadow.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.shadow.value);
}

tools.blur.onclick = function(){
    if(edit.sharpen.value!=0){
        if(confirm("The Blur function may not affect unless you set the sharpen value to 0. Do you want to reset sharpen value to 0?")){
            edit.sharpen.value = 0;
            showPre();
            slideroperation = function(){
                edit.blur.value = slider.value;
                showPre();
            }
            initSliderValue(0,100,edit.blur.value);
        }
        else{
            slideroperation = function(){
                if(confirm("The Blur function may not affect unless you set the sharpen value to 0. Do you want to reset sharpen value to 0?")){
                    edit.sharpen.value = 0;
                    slideroperation = function(){
                        edit.blur.value = slider.value;
                        showPre();
                    }
                    initSliderValue(0,100,edit.blur.value);
                }
            }
        }
    }
    else {
        slideroperation = function(){
                edit.blur.value = slider.value;
                showPre();
            }
            initSliderValue(0,100,edit.blur.value);
    }
}

tools.hue.onclick = function(){
    slideroperation = function(){
        edit.hue.value = slider.value;
        showPre();
    }
    initSliderValue(-100,100,edit.hue.value);
}

tools.grain.onclick = function(){
    slideroperation = function(){
        edit.grain.value = slider.value;
        showPre();
    }
    initSliderValue(0,100,edit.grain.value);
}

tools.motionBlur.onclick = function(){
    slideroperation = function(){
        edit.motionBlur.value = slider.value;
        showPre();
    }
    initSliderValue(0,100,edit.motionBlur.value);
}

filterThumbnail.filter_1.onclick = function(){
    resetEdit();
    showPre();
}

filterThumbnail.filter_2.onclick = function(){
    resetEdit();
    edit.saturation.value = -100;
    edit.grain.value = 60;
    edit.contrast.value = 40;
    showPre();
}

filterThumbnail.filter_3.onclick = function(){
    resetEdit();
    blendsh.r = 132;
    blendsh.g = 46;
    blendsh.b = 99;
    activeHandlerNormal(color.shadow.purple,color.shadow,"color-active");
    edit.colorshadow.value = 30;
    edit.contrast.value = 30;
    edit.fade.value = 44;
    edit.highlight.value = 66;
    edit.saturation.value = -9;
    edit.shadow.value = -58;
    edit.temperature.value = 97;
    showPre();
}

filterThumbnail.filter_4.onclick = function(){
    resetEdit();
    blendsh.r = 46;
    blendsh.g = 171;
    blendsh.b = 199;
    activeHandlerNormal(color.shadow.skyblue,color.shadow,"color-active");
    edit.colorshadow.value = 41;
    edit.contrast.value = 67;
    edit.exposure.value = -5;
    edit.fade.value = 27;
    edit.highlight.value = 100;
    edit.saturation.value = -29;
    edit.shadow.value = -59;
    edit.temperature.value = 28;
    showPre();
}

filterThumbnail.filter_5.onclick = function(){
    resetEdit();
    blendsh.r = 200;
    blendsh.g = 194;
    blendsh.b = 46;
    activeHandlerNormal(color.shadow.yellow,color.shadow,"color-active");
    edit.colorshadow.value = 50;
    edit.contrast.value = 10;
    edit.exposure.value = -7;
    edit.fade.value = 17;
    edit.highlight.value = -12;
    edit.hue.value = -10;
    edit.saturation.value = -16;
    edit.shadow.value = -34;
    edit.temperature.value = -71;
    showPre();
}

//CORE FUNCTION

function resetEdit(){
    for(var item in edit){
        edit[item].value = 0;
    }
    removeAllClasses(color.shadow,"color-active");
    removeAllClasses(color.highlight,"color-active");
}

function filterThumbnailsLoad(){
    var temp = resizeImageData(croppedData,0,70);
    var temp1 = new ImageData(
        new Uint8ClampedArray(temp.data),
        temp.width,
        temp.height
    );
    filterThumbnail.filter_1.width = temp1.width;
    filterThumbnail.filter_1.height = temp1.height;
    filterThumbnail.filter_1.getContext("2d").putImageData(temp1,0,0);
    var temp2 = new ImageData(
        new Uint8ClampedArray(temp.data),
        temp.width,
        temp.height
    );
    //filter2do
    temp2 = edit.saturation.fx(temp2,-100);
    temp2 = edit.grain.fx(temp2,60);
    temp2 = edit.contrast.fx(temp2,40);
    //end
    filterThumbnail.filter_2.width = temp2.width;
    filterThumbnail.filter_2.height = temp2.height;
    filterThumbnail.filter_2.getContext("2d").putImageData(temp2,0,0);
    var temp3 = new ImageData(
        new Uint8ClampedArray(temp.data),
        temp.width,
        temp.height
    );
    //filter3do
    temp3 = colosha(temp3,30,{r:132,g:46,b:99});
    temp3 = edit.contrast.fx(temp3,30);
    temp3 = edit.fade.fx(temp3,44);
    temp3 = edit.highlight.fx(temp3,66);
    temp3 = edit.saturation.fx(temp3,-9);
    temp3 = edit.shadow.fx(temp3,-58);
    temp3 = edit.temperature.fx(temp3,97);
    //end
    filterThumbnail.filter_3.width = temp3.width;
    filterThumbnail.filter_3.height = temp3.height;
    filterThumbnail.filter_3.getContext("2d").putImageData(temp3,0,0);
    var temp4 = new ImageData(
        new Uint8ClampedArray(temp.data),
        temp.width,
        temp.height
    );
    //filter4do
    temp4 = colosha(temp4,41,{r:46,g:171,b:199});
    temp4 = edit.contrast.fx(temp4,67);
    temp4 = edit.exposure.fx(temp4,-5)
    temp4 = edit.fade.fx(temp4,27);
    temp4 = edit.grain.fx(temp4,50);
    temp4 = edit.highlight.fx(temp4,100);
    temp4 = edit.saturation.fx(temp4,-29);
    temp4 = edit.shadow.fx(temp4,-59);
    temp4 = edit.temperature.fx(temp4,-28);
    //end
    filterThumbnail.filter_4.width = temp4.width;
    filterThumbnail.filter_4.height = temp4.height;
    filterThumbnail.filter_4.getContext("2d").putImageData(temp4,0,0);
    var temp5 = new ImageData(
        new Uint8ClampedArray(temp.data),
        temp.width,
        temp.height
    );
    //filter5do
    temp5 = colosha(temp5,50,{r:200,g:194,b:46});
    temp5 = edit.contrast.fx(temp5,10);
    temp5 = edit.exposure.fx(temp5,-7)
    temp5 = edit.fade.fx(temp5,17);
    temp5 = edit.highlight.fx(temp5,-12);
    temp5 = edit.hue.fx(temp5,-10);
    temp5 = edit.saturation.fx(temp5,-16);
    temp5 = edit.shadow.fx(temp5,-34);
    temp5 = edit.temperature.fx(temp5,-71);
    //end
    filterThumbnail.filter_5.width = temp5.width;
    filterThumbnail.filter_5.height = temp5.height;
    filterThumbnail.filter_5.getContext("2d").putImageData(temp5,0,0);
}

async function processSave(){
    if(IMGloaded && saved){
        wait_screen.style.display = await "block";
        var Data;
        if(cropProp.w>0&&cropProp.h>0){
            Data = ctxp.getImageData(cropProp.x/preRatio,cropProp.y/preRatio,cropProp.w/preRatio,cropProp.h/preRatio);
        }
        else{
            Data = ctxp.getImageData(0,0,process_canvas.width,process_canvas.height);
        }
        for(var item in edit){
            if(edit[item].value != 0){
                if(edit[item].fx!=undefined){
                    Data = await edit[item].fx(Data,edit[item].value);
                }
            }
        }
        process_canvas.width = Data.width;
        process_canvas.height = Data.height;
        await ctxp.putImageData(Data,0,0);
        if(navigator.userAgent.indexOf("Chrome")!=-1){
            save_button.download = "Image_Instafake.jpg";
            save_button.href = await process_canvas.toDataURL("image/jpeg",quality).replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            wait_screen.style.display = "none";
        }
        else{
            var win=window.open('about:blank','image from canvas');
            win.document.write("<img src='"+process_canvas.toDataURL("image/jpeg",quality)+"' alt='from canvas'/>");
        }
        process_canvas.width = stockDataImage.width;
        process_canvas.height = stockDataImage.height;
        ctxp.putImageData(stockDataImage,0,0);
    }
}

function terminateWorker(){
    taskR.terminate();
    taskG.terminate();
    taskB.terminate();
}

function initSlider(min,max){
    slider.max = max;
    slider.min = min;
    slider_val.max = max;
    slider_val.min = min;
}

function initSliderValue(min,max,value){
    slider.max = max;
    slider.min = min;
    slider_val.max = max;
    slider_val.min = min;
    slider.value = value;
    slider_val.value = value;
}

function getSliderMinMax(name){
    switch(name){
        case "sharpen":
            return {min:0,max:100};
        case "blur":
            return {min:0,max:100};
        case "color-highlight":
            return {min:0,max:100};
        case "color-shadow":
            return {min:0,max:100};
        case "grain":
            return {min:0,max:100};
        case "fade":
            return {min:0,max:100};
        case "motionBlur":
            return {min:0,max:100};
        default:
            return {min:-100,max:100};
    }
}

function addAllFunction(arr,fx){
    for(var item in arr){
        arr[item].onclick = fx;
    }
}

function addAllHandlers(arr, classname){
    for(var item in arr){
        arr[item].onmousedown = addHandler(arr[item],arr,classname);
    }
}

function addAllHandlersNormal(arr, classname){
    for(var item in arr){
        arr[item].onmousedown = addHandlerNormal(arr[item],arr,classname);
    }
}

function addHandlerNormal(element,arr,classname){
    return function(){
        if(IMGloaded){
            removeAllClasses(arr,classname);
            element.classList.add(classname);
        }
    }
}

function addHandler(element,arr,classname){
    return function(){
        if(IMGloaded){
            removeAllClasses(arr,classname);
            if(element.id == "crop"){
                document.getElementsByClassName("slide-bar-wrapper").item(0).style.display = "none";
                document.getElementsByClassName("scale-crop").item(0).style.display = "block";
            }
            else if(element.id.includes("scale")){
                //donothing;
            }
            else{
                document.getElementsByClassName("slide-bar-wrapper").item(0).style.display = "block";
                document.getElementsByClassName("scale-crop").item(0).style.display = "none";
                cropper_canvas.style.display = "none";
                confirmed.style.display = "none";
                showPre();
            }
            element.classList.add(classname);
        }
        else {
        //chua chon anh thi lam gi?
        }
    }
}

function activeHandler(element,arr,classname){
    removeAllClasses(arr,classname);
    if(element.id == "crop"){
        document.getElementsByClassName("slide-bar-wrapper").item(0).style.display = "none";
        document.getElementsByClassName("scale-crop").item(0).style.display = "block";
    }
    else if(element.id.includes("scale")){
        //donothing;x
    }
    else{
        document.getElementsByClassName("slide-bar-wrapper").item(0).style.display = "block";
        document.getElementsByClassName("scale-crop").item(0).style.display = "none";
        cropper_canvas.style.display = "none";
        confirmed.style.display = "none";
    }
    element.classList.add(classname);
}

function activeHandlerNormal(element,arr,classname){
    removeAllClasses(arr,classname);
    element.classList.add(classname);
}

function removeAllClasses(arr,classname){
    for(var item in arr){
        arr[item].classList.remove(classname);
    }
}

function getActiveTool(){
    var Atool = document.getElementsByClassName("tools-active");
    if(Atool.length == 0)   return null;
    var item = Atool.item(0).id;
    switch(item){
        case "exposure":
            return edit.exposure;
        case "contrast":
            return edit.contrast;
        case "sharpen":
            return edit.sharpen;
        case "temperature":
            return edit.temperature;
        case "saturation":
            return edit.saturation;
        case "color-highlight":
            return edit.colorhighlight;
        case "color-shadow":
            return edit.colorshadow;
        case "fade":
            return edit.fade;
        case "highlight":
            return edit.highlight;
        case "shadow":
            return edit.shadow;
        case "blur":
            return edit.blur;
        case "hue":
            return edit.hue;
        case "grain":
            return edit.grain;
        case "motionBlur":
            return edit.motionBlur;
        default:
            return null;
    }
}

function getToolByName(name){
    for(var item in edit){
        if(edit[item].name == name) return edit[item];
    }
    return null;
}

function resizeImageData(Data,wid,hei){
    var ratio = Data.width/Data.height;
    if(wid==0){
        h = hei;
        w = hei * ratio;
        var output = ctxp.createImageData(w,h);
    }
    else if(hei==0){
        w = wid;
        h = wid / ratio;
        var output = ctxp.createImageData(w,h);
    }
    else{
        w = wid;
        h = hei;
        var output = ctxp.createImageData(w,h);
    }
    output = toImageData(resizeMatrix(toMatrix(Data,0),w,h),resizeMatrix(toMatrix(Data,1),w,h),resizeMatrix(toMatrix(Data,2),w,h),resizeMatrix(toMatrix(Data,3),w,h));
    return output;
}
//under Construction

function resizeMatrix(Matrix,w,h){
    matW = Matrix.length;
    matH = Matrix[0].length;
    var wRa,hRa;
    wRa = w/matW;
    hRa = h/matH;
    if(w==0){
        wRa = hRa * matW / matH;
    }
    else if(h==0){
        hRa = wRa / matW * matH;
    }
    var output = new Array(Math.floor(matW*wRa));
    for(var k = 0 ; k < Math.floor(matW*wRa) ; k++){
        output[k] = new Array(Math.floor(matH*hRa));
    }
    for(var j = 0; j < Math.floor(matH*hRa) ; j++){
        for(var i = 0 ; i < Math.floor(matW*wRa) ; i++){
            output[i][j] = Matrix[Math.floor(i/wRa)][Math.floor(j/hRa)];
        }
    }
    return output;
}
//under Construction

async function showPre(){
    if(IMGloaded){
        var Data;
        Data = new ImageData(
            new Uint8ClampedArray(croppedData.data),
            croppedData.width,
            croppedData.height
        );
        for(var item in edit){
            if(edit[item].value != 0){
                if(edit[item].fx!=undefined){
                    Data = await edit[item].fx(Data,edit[item].value);
                }
            }
            else if(edit[item] == edit.motionBlur){
                terminateWorker();
            }
        }
        front_canvas.width = Data.width;
        front_canvas.height = Data.height;
        front_canvas.style.display = "block";
        back_canvas.style.display = "none";
        front_canvas.style.opacity = "1";
        await ctxf.putImageData(Data,0,0);
        back_canvas.style.opacity = "0";
        front_canvas.style.marginTop = (wrapper.offsetHeight - back_canvas.height)/2 + "px";
        back_canvas.style.marginTop = front_canvas.style.marginTop;
        front_canvas.style.marginLeft = (wrapper.offsetWidth - back_canvas.width)/2 + "px";
        back_canvas.style.marginLeft = front_canvas.style.marginLeft;
        canvasPos = front_canvas.getBoundingClientRect();
    }
}

function drawCropper(){
    ctxc.fillStyle = "#000";
    ctxc.fillRect(0,0,cropper_canvas.width,cropper_canvas.height);
    ctxc.clearRect(cropProp.x,cropProp.y,cropProp.w,cropProp.h);
    ctxc.beginPath();
    ctxc.strokeStyle = "#FFF";
    ctxc.lineWidth = 2;
    ctxc.strokeRect(cropProp.x,cropProp.y,cropProp.w,cropProp.h);
    ctxc.moveTo(cropProp.x + cropProp.w/3, cropProp.y);
    ctxc.lineTo(cropProp.x + cropProp.w/3, cropProp.y + cropProp.h);
    ctxc.stroke();
    ctxc.moveTo(cropProp.x + 2*cropProp.w/3, cropProp.y);
    ctxc.lineTo(cropProp.x + 2*cropProp.w/3, cropProp.y + cropProp.h);
    ctxc.stroke();
    ctxc.moveTo(cropProp.x, cropProp.y + cropProp.h/3);
    ctxc.lineTo(cropProp.x + cropProp.w, cropProp.y + cropProp.h/3);
    ctxc.stroke();
    ctxc.moveTo(cropProp.x, cropProp.y + 2*cropProp.h/3);
    ctxc.lineTo(cropProp.x + cropProp.w, cropProp.y + 2*cropProp.h/3);
    ctxc.stroke();
}

function checkCropperMousePos(){
    if((mousePos.x<cropProp.x) || (mousePos.x > (cropProp.x+cropProp.w)) || (mousePos.y < cropProp.y) || (mousePos.y > (cropProp.y+cropProp.h))) return 0;
    else if((mousePos.x>=cropProp.x) && ((mousePos.x - cropProp.x) <= 10)){
        if((mousePos.y>cropProp.y) && ((mousePos.y - cropProp.y) <= 10)) return 1;
        else if((mousePos.y>cropProp.y+cropProp.h-10)&&(mousePos.y<=cropProp.y+cropProp.h)) return 7;
        else if((mousePos.y>=cropProp.y+10)&&(mousePos.y<=cropProp.y+cropProp.h-10)) return 8;
        else return 0;
    }
    else if((mousePos.x>=cropProp.x+10)&&((mousePos.x - cropProp.x - cropProp.w + 10)<=0)){
        if((mousePos.y>=cropProp.y)&&((mousePos.y - cropProp.y)<=10)) return 2;
        else if((mousePos.y>=cropProp.y+cropProp.h-10)&&(mousePos.y<=cropProp.y+cropProp.h)) return 6;
        else return 9;
    }
    else if((mousePos.x>=cropProp.x+cropProp.w-10)&&((mousePos.x)<=(cropProp.x + cropProp.w))){
        if((mousePos.y>=cropProp.y)&&((mousePos.y - cropProp.y)<=10)) return 3;
        else if((mousePos.y>=cropProp.y+10)&&(mousePos.y<=cropProp.y+cropProp.h-10)) return 4;
        else if((mousePos.y>=cropProp.y+cropProp.h-10)&&(mousePos.y<=cropProp.y+cropProp.h)) return 5;
        else return 0;
    }
    else return 9;
}

function fitTransform(width,height){
    var res = [];
    var possibleW = 640;
    var possibleH = 480;
    if(possibleW>(wrapper.offsetWidth-150)){
        possibleW = wrapper.offsetWidth-150;
    }
    if(possibleH>(wrapper.offsetHeight-150)){
        possibleH = wrapper.offsetHeight-150;
    }
    if(width<(possibleW) && height<(possibleH)){
        res.width = width;
        res.height = height;
        return(res);
    }
    var ratio = width/height;
    if(((possibleW)/ratio)<(possibleH)) {
        res.height = (possibleW)/ratio;
        res.width = possibleW;
    }
    else {
        res.height = possibleH;
        res.width = (possibleH)*ratio;
    }
    res.height = Math.floor(res.height);
    res.width = Math.floor(res.width);
    return res;
}

function RGB2HSL(r,g,b){
    var h,s,l,min,max,delta;
    r/=255;
    g/=255;
    b/=255;
    min = Math.min(r,g,b);
    max = Math.max(r,g,b);
    l = (max+min)/2;
    delta = max -min;
    if(delta!=0){
        s = delta/max;
    }
    else {
        s=0;
        h=0;
        return [h,s,l];
    }
    s = (l > 0.5 ? delta / (2 - max - min) : delta / (max + min));
    switch (max) {
      case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
      case g: h = (b - r) / delta + 2; break;
      case b: h = (r - g) / delta + 4; break;
    }
    h /= 6;
    return [h,s,l];
}

function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
}

function HSLtoRGB(h,s,l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [ r * 255, g * 255, b * 255 ];
}

function toMatrix(Data,offset){
    var w = Data.width;
    var h = Data.height;
    var matrix = new Array(w);
    for(var j=0;j<w;j++){
        matrix[j] = new Array(h);
    }
    var l = w * h;
    var r,g,b,a,x,y,i;
    switch(offset){
        case 0 :
            for (i = 0; i < l; i++) {
                // get color of pixel
                r = Data.data[i*4]; // Red
                g = Data.data[i*4+1]; // Green
                b = Data.data[i*4+2]; // Blue
                a = Data.data[i*4+3]; // Alpha
                // get the position of pixel
                y = parseInt(i / w, 10);
                x = i - y * w;
                matrix[x][y] = r;
            }
            break;
        case 1 :
            for (i = 0; i < l; i++) {
                // get color of pixel
                r = Data.data[i*4]; // Red
                g = Data.data[i*4+1]; // Green
                b = Data.data[i*4+2]; // Blue
                a = Data.data[i*4+3]; // Alpha
                // get the position of pixel
                y = parseInt(i / w, 10);
                x = i - y * w;
                matrix[x][y] = g;
            }
            break;
        case 2 :
            for (i = 0; i < l; i++) {
                // get color of pixel
                r = Data.data[i*4]; // Red
                g = Data.data[i*4+1]; // Green
                b = Data.data[i*4+2]; // Blue
                a = Data.data[i*4+3]; // Alpha
                // get the position of pixel
                y = parseInt(i / w, 10);
                x = i - y * w;
                matrix[x][y] = b;
            }
            break;
        default :
            for (i = 0; i < l; i++) {
                // get color of pixel
                r = Data.data[i*4]; // Red
                g = Data.data[i*4+1]; // Green
                b = Data.data[i*4+2]; // Blue
                a = Data.data[i*4+3]; // Alpha
                // get the position of pixel
                y = parseInt(i / w, 10);
                x = i - y * w;
                matrix[x][y] = a;
            }
            break;
    }
    return matrix;
}

function toImageData(rmatrix,gmatrix,bmatrix,amatrix){
    var w = rmatrix.length;
    var h = rmatrix[0].length;
    var imageData = ctxb.createImageData(w,h);
    for(var i = 0;i<imageData.width*imageData.height;i++){
        imageData.data[i*4] = rmatrix[i - parseInt(i / w, 10) * w][parseInt(i / w, 10)];
        imageData.data[i*4+1] = gmatrix[i - parseInt(i / w, 10) * w][parseInt(i / w, 10)];
        imageData.data[i*4+2] = bmatrix[i - parseInt(i / w, 10) * w][parseInt(i / w, 10)];
        imageData.data[i*4+3] = amatrix[i - parseInt(i / w, 10) * w][parseInt(i / w, 10)];
    }
    return imageData;
}

function convolute(src,kernel){
    var srcW = src.length,
        srcH = src[0].length,
        kernelW = kernel.length,
        kernelH = kernel[0].length,
        kernelDot = kernelW*kernelH,
        start = Math.floor(kernelW/2),
        output = new Array(srcW);
    for(var k=0;k<srcW;k++){
        output[k] = new Array(srcH);
    }
    
    for(var j = 0;j<srcH;j++){
        for(var i = 0; i<srcW;i++){
            var temp=0;
            var temp2=0;
            var temp3=0;
            var kernelDotMissed = 1;
            for(var m = 0;m<kernelH;m++){
                for(var n = 0;n<kernelW;n++){
                    if(((i-start+n)<0)||((j-start+m)<0)||((i-start+n)>srcW-1)||((j-start+m)>srcH-1)){
                        kernelDotMissed++;
                        temp3 = temp3+(kernel[n][m]+temp3)/(kernelDot-kernelDotMissed);
                    }
                    else{
                        temp2 += src[i-start+n][j-start+m];
                        temp += src[i-start+n][j-start+m]*(kernel[n][m]);
                    }
                    
                }
            }
            temp+=temp2*temp3;
            output[i][j] = temp;
        }
    }
    return output;
}

function JSONconvolute(JSONsrc,JSONkernel){
    var src = JSON.parse(JSONsrc);
    var kernel = JSON.parse(JSONkernel);
    var srcW = src.length,
        srcH = src[0].length,
        kernelW = kernel.length,
        kernelH = kernel[0].length,
        kernelDot = kernelW*kernelH,
        start = Math.floor(kernelW/2),
        output = new Array(srcW);
    for(var k=0;k<srcW;k++){
        output[k] = new Array(srcH);
    }
    
    for(var j = 0;j<srcH;j++){
        for(var i = 0; i<srcW;i++){
            var temp=0;
            var temp2=0;
            var temp3=0;
            var kernelDotMissed = 1;
            for(var m = 0;m<kernelH;m++){
                for(var n = 0;n<kernelW;n++){
                    if(((i-start+n)<0)||((j-start+m)<0)||((i-start+n)>srcW-1)||((j-start+m)>srcH-1)){
                        kernelDotMissed++;
                        temp3 = temp3+(kernel[n][m]+temp3)/(kernelDot-kernelDotMissed);
                    }
                    else{
                        temp2 += src[i-start+n][j-start+m];
                        temp += src[i-start+n][j-start+m]*(kernel[n][m]);
                    }
                    
                }
            }
            temp+=temp2*temp3;
            output[i][j] = temp;
        }
    }
    return JSON.stringify(output);
}

function cropImage(){
    if(cropProp.w>0&&cropProp.h>0){
        var croppedData = ctxp.getImageData(cropProp.x/preRatio,cropProp.y/preRatio,cropProp.w/preRatio,cropProp.h/preRatio);
        var res = fitTransform(croppedData.width,croppedData.height);
        return resizeImageData(croppedData,res.width,res.height);
    }
    else{
        return ctxb.getImageData(0,0,back_canvas.width,back_canvas.height);
    }
}

function motionBlurKernelGen(size,angle){
    var kernel = [];
    for(var i=0;i<size*20+1;i++){
        kernel[i] = [];
    }
    for(var j=0;j<size*20+1;j++){
        for(var i=0;i<size*20+1;i++){
            if(i==j){
                kernel[i][j] = 1/(size*20+1);
            }
            else    kernel[i][j] = 0;
        }
    }
    return kernel;
`   `}

function newThread(funcObj){
    var blobURL = URL.createObjectURL(new Blob(['onmessage = function(e){var data = JSON.parse(e.data);  var fact = convolute(data.Data,data.kernel);', funcObj.toString(),';postMessage(JSON.stringify(fact));self.close();};'], {type:'application/javascript'}));
    var worker = new Worker(blobURL);
    return worker;
}

function threadsConvo(Data,kernel){
    return new Promise(function(resolve, reject){
        var rMatrix,gMatrix,bMatrix;
        terminateWorker();
        taskR = newThread(convolute);
        taskG = newThread(convolute);
        taskB = newThread(convolute);
        var taskcheck = {'done':0,'num':0};
        function taskInit(num){
            taskcheck.num = num;
            taskcheck.done = 0;
        }

        function taskDone(func){
            taskcheck.done++;
            if(taskcheck.done==taskcheck.num){
                func();
            }
        }
        taskInit(3);
        function doneFunc(){
            resolve(toImageData(rMatrix,gMatrix,bMatrix,toMatrix(Data,3)));
        }
        taskR.postMessage(JSON.stringify({'Data':toMatrix(Data,0),'kernel':kernel}));
        taskR.onmessage = function(e){
            rMatrix = JSON.parse(e.data);
            taskDone(doneFunc);
        }
        taskG.postMessage(JSON.stringify({'Data':toMatrix(Data,1),'kernel':kernel}));
        taskG.onmessage = function(e){
            gMatrix = JSON.parse(e.data);
            taskDone(doneFunc);
        }
        taskB.postMessage(JSON.stringify({'Data':toMatrix(Data,2),'kernel':kernel}));
        taskB.onmessage = function(e){
            bMatrix = JSON.parse(e.data);
            taskDone(doneFunc);
        }
    })
}

function addOnclick(arr,funcObj){
    for(var item in arr){
        arr[item].onclick = funcObj;
    }
}

edit.exposure.fx = function (Data, value) {
    if(value>0){
        for(var i=0;i<Data.data.length;i+=4){
            Data.data[i]+=1.0*value;
            Data.data[i+1]+=1.0*value;
            Data.data[i+2]+=1.0*value;
        }
    }
    else{
        value = -value;
        for(var i=0;i<Data.data.length;i+=4){
            Data.data[i]-=1.0*value;
            Data.data[i+1]-=1.0*value;
            Data.data[i+2]-=1.0*value;
        }
    }
    return Data;
}

edit.contrast.fx = function(Data,value){
    if(value>0){
        for(var j=0;j<Data.data.length;j++){
            if(Data.data[j]<=average)
                Data.data[j]-=1*value*Math.abs(Data.data[j]-average)/255;
            else
                Data.data[j]+=1*value*Math.abs(Data.data[j]-average)/255;
        }
    }
    else{
        value = -value;
        for(var j=0;j<Data.data.length;j++){
            if(Data.data[j]<=average)
                Data.data[j]+=1*value*Math.abs(Data.data[j]-average)/255;
            else
                Data.data[j]-=1*value*Math.abs(Data.data[j]-average)/255;
        }
    }
    return Data;
}

edit.sharpen.fx = async function(Data,value){
    //Nhớ set lại slider trong [0,100]
    var weight;
    weight = value;
    var kernel = [
                [0,0-1*(weight)/100,0],
                [0-1*(weight)/100,1+4*(weight)/100,0-1*(weight)/100],
                [0,0-1*(weight)/100,0]
                 ];
    return await threadsConvo(Data,kernel);
}

edit.temperature.fx = function (Data, value) {
    if(value>0){
        for(var i=0;i<Data.data.length;i+=4){
            Data.data[i]+=0.25*value;
            Data.data[i+1]+=0.25*value;
        }
    }
    else{
        for(var i=0;i<Data.data.length;i+=4){
            Data.data[i+2]-=0.5*value;
        }
    }
    return Data;
}

edit.saturation.fx = function(Data,value){
    var tempData = [];
    var temp,temp2;
    for(var i=0;i<Data.data.length;i+=4){
        temp = RGB2HSL(Data.data[i],Data.data[i+1],Data.data[i+2]);
        tempData[i] = temp[0];
        if(value>0)
            tempData[i+1] = temp[1] + (1-temp[1])*value/400;
        else
            tempData[i+1] = temp[1] + (temp[1])*value/100;
        tempData[i+2] = temp[2];
        temp2 = HSLtoRGB(tempData[i],tempData[i+1],tempData[i+2]);
        Data.data[i] = temp2[0];
        Data.data[i+1] = temp2[1];
        Data.data[i+2] = temp2[2];
        Data.data[i+3] = 255;
    }
    return Data;
}

edit.colorshadow.fx = function(Data,value){
    for(var j=0;j<Data.data.length;j+=4){
        if(Data.data[j]+Data.data[j+1]+Data.data[j+2]<=average*3){
            Data.data[j]+=blendsh.r*value/150*(average-Data.data[j])/average;
            Data.data[j+1]+=blendsh.g*value/150*(average-Data.data[j+1])/average;
            Data.data[j+2]+=blendsh.b*value/150*(average-Data.data[j+2])/average;
        }
    }
    return Data;
}

function colosha(Data,value,blend){
    for(var j=0;j<Data.data.length;j+=4){
        if(Data.data[j]+Data.data[j+1]+Data.data[j+2]<=average*3){
            Data.data[j]+=blend.r*value/150*(average-Data.data[j])/average;
            Data.data[j+1]+=blend.g*value/150*(average-Data.data[j+1])/average;
            Data.data[j+2]+=blend.b*value/150*(average-Data.data[j+2])/average;
        }
    }
    return Data;
}

edit.colorhighlight.fx = function(Data,value){
    for(var j=0;j<Data.data.length;j+=4){
        if(Data.data[j]+Data.data[j+1]+Data.data[j+2]>=average*3){
            Data.data[j]-=(255-blendhi.r)*value/50*(Data.data[j]-average)/average;
            Data.data[j+1]-=(255-blendhi.g)*value/50*(Data.data[j+1]-average)/average;
            Data.data[j+2]-=(255-blendhi.b)*value/50*(Data.data[j+2]-average)/average;
        }
    }
    return Data;
}

function colohi(Data,value,blend){
    for(var j=0;j<Data.data.length;j+=4){
        if(Data.data[j]+Data.data[j+1]+Data.data[j+2]>=average*3){
            Data.data[j]-=(255-blend.r)*value/50*(Data.data[j]-average)/average;
            Data.data[j+1]-=(255-blend.g)*value/50*(Data.data[j+1]-average)/average;
            Data.data[j+2]-=(255-blend.b)*value/50*(Data.data[j+2]-average)/average;
        }
    }
    return Data;
}

edit.fade.fx = function(Data,value){
    for(var j=0;j<Data.data.length;j++){
        if(Data.data[j]>=average)
            Data.data[j]-=1*value*Math.abs(Data.data[j]-average)/255;
        else    Data.data[j]+=1*value*Math.abs(Data.data[j]-average)/255;
    }
    return Data;
}

edit.highlight.fx = function(Data,value){
    if(value>0){
        for(var j=0;j<Data.data.length;j+=4){
            if(Data.data[j]+Data.data[j+1]+Data.data[j+2]>=average*3){
                Data.data[j]+=0.7*value*Math.abs(Data.data[j]-average)/255;
                Data.data[j+1]+=0.7*value*Math.abs(Data.data[j+1]-average)/255;
                Data.data[j+2]+=0.7*value*Math.abs(Data.data[j+2]-average)/255;
            }
        }
    }
    else{
        value = -value;
        for(var j=0;j<Data.data.length;j+=4){
            if(Data.data[j]+Data.data[j+1]+Data.data[j+2]>=average*3){
                Data.data[j]-=0.7*value*Math.abs(Data.data[j]-average)/255;
                Data.data[j+1]-=0.7*value*Math.abs(Data.data[j+1]-average)/255;
                Data.data[j+2]-=0.7*value*Math.abs(Data.data[j+2]-average)/255;
            }
        }
    }
    return Data;
}

edit.shadow.fx = function(Data,value){
    if(value>0){
        for(var j=0;j<Data.data.length;j+=4){
            if(Data.data[j]+Data.data[j+1]+Data.data[j+2]<=average*3){
                Data.data[j]+=0.7*value*Math.abs(Data.data[j]-average)/255;
                Data.data[j+1]+=0.7*value*Math.abs(Data.data[j+1]-average)/255;
                Data.data[j+2]+=0.7*value*Math.abs(Data.data[j+2]-average)/255;
            }
        }
    }
    else{
        value = -value;
        for(var j=0;j<Data.data.length;j+=4){
            if(Data.data[j]+Data.data[j+1]+Data.data[j+2]<=average*3){
                Data.data[j]-=0.7*value*Math.abs(Data.data[j]-average)/255;
                Data.data[j+1]-=0.7*value*Math.abs(Data.data[j+1]-average)/255;
                Data.data[j+2]-=0.7*value*Math.abs(Data.data[j+2]-average)/255;
            }
        }
    }
    return Data;
}

edit.blur.fx = async function(Data,value){
    //Nhớ set lại slider trong [0,100]
    var weight;
    var kernel;
    weight = 0+value/50;
    var f = (1/(2*Math.PI*Math.pow(weight,2)))*(Math.pow(Math.E,-(2/(2*Math.pow(weight,2))))*4 + Math.pow(Math.E,-(1/(2*Math.pow(weight,2))))*4+1);
    if(value==0)
        kernel = [[0,0,0],[0,1,0],[0,0,0]];
    else
        kernel = [[((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(2/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(1/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(2/(2*Math.pow(weight,2)))))/f],[((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(1/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(0/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(1/(2*Math.pow(weight,2)))))/f],[((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(2/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(1/(2*Math.pow(weight,2)))))/f,((1/(2*Math.PI*Math.pow(weight,2)))*Math.pow(Math.E,-(2/(2*Math.pow(weight,2)))))/f]];
    return await threadsConvo(Data,kernel);
}

edit.hue.fx = function(Data,val){
    var value = val/2;
    var tempData = [];
    var temp,temp2;
    for(var i=0;i<Data.data.length;i+=4){
        temp = RGB2HSL(Data.data[i],Data.data[i+1],Data.data[i+2]);
        if((temp[0]+value/100)>1)
            tempData[i] = temp[0]+value/100 - 1;
        else if((temp[0]+value/100)<0)
            tempData[i] = 1 + temp[0]+value/100;
        else tempData[i] = temp[0]+value/100;
        tempData[i+1] = temp[1];
        tempData[i+2] = temp[2];
        temp2 = HSLtoRGB(tempData[i],tempData[i+1],tempData[i+2]);
        Data.data[i] = temp2[0];
        Data.data[i+1] = temp2[1];
        Data.data[i+2] = temp2[2];
        Data.data[i+3] = 255;
    }
    return Data;
}

edit.grain.fx = function(Data,value){
    var options = {
            grainOpacity: 0.1*value/100,
            grainDensity: 50/value,
            grainWidth: 1,
            grainHeight: 1,

    };
    for(var i = 0 ; i < Data.width*Data.height;i+=Math.floor(Math.random()*options.grainDensity+1)){
        var rgb = Math.random() * 256 | 0;
        Data.data[i*4] = Data.data[i*4]*(1-options.grainOpacity*(255-Data.data[i*4])/255) + rgb*options.grainOpacity*(255-Data.data[i*4])/255;
        Data.data[i*4+1] = Data.data[i*4+1]*(1-options.grainOpacity*(255-Data.data[i*4+1])/255) + rgb*options.grainOpacity*(255-Data.data[i*4+1])/255;
        Data.data[i*4+2] = Data.data[i*4+2]*(1-options.grainOpacity*(255-Data.data[i*4+2])/255) + rgb*options.grainOpacity*(255-Data.data[i*4+2])/255;
    }
    return Data;
}

edit.motionBlur.fx = async function(Data,value){
    var angle = (value%10+1)/10;
    var size = (Math.floor(value/10)+1)/10;
    var kernel = motionBlurKernelGen(size, angle);
    return await threadsConvo(Data,kernel);
}