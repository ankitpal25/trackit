const preloadBox=document.getElementById("preload-box");
const mainBox=document.getElementById("main-box");
const uploadBox=document.getElementById("upload-box");
const conerrBox=document.getElementById("conerr-box");
const showtxtcon=document.getElementById("showtxtcon");
const actualtxt=document.getElementById("actualtxt");
const showtxtimg=document.querySelector("#showtxt>img");
const actualimg=document.getElementById("actualimg");
const imgload=document.getElementById("imgload");
const monthsArr = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
];
const upimg=document.getElementById("upimg");
const imgin=document.getElementById("imgin");
const upcam=document.getElementById("upcam");
const camin=document.getElementById("camin");
const ipbu=document.getElementById("imgprevbeforeupload");
const uptxt=document.getElementById("uptxt");
const txtin=document.getElementById("txtin");
const backfromup=document.getElementById("backfromup");
const date=new Date();
const today=date.getDate();
const tomonth=date.getMonth();
const apiurl='https://script.google.com/macros/s/AKfycbxPW5pBslc380dycunXh3elFebPXR50bC_HkLA50btXzSiCzfV_kqOv0EK31aBA18I/exec';
let clickevent;
let mydata;
let imgobj;

function createcalendarui()
{
    
    mainBox.innerHTML='';
    const monthwisearray=[];
    let eachmontharray=[];
    eachmontharray.push(mydata[0]);

    for(let i=1;i<mydata.length;i++)
    {
        if(mydata[i][0]==mydata[i-1][0])
        {
            eachmontharray.push(mydata[i]);
        }
        else
        {
            monthwisearray.push(eachmontharray);
            eachmontharray=[];
            eachmontharray.push(mydata[i]);
        }
        
    }
    monthwisearray.push(eachmontharray);
    
    for(let i=0;i<monthwisearray.length;i++)
    {

        const monthBox=document.createElement('div');
        monthBox.classList.add('container-fluid','month-box','mb-5');

        const monthheader=document.createElement('div');
        monthheader.classList.add('month-header','d-flex','justify-content-center','align-items-center','mb-4','fw-bolder','fs-5');
        monthheader.innerText=monthsArr[i+3];

        const daterowcon=document.createElement('div');
        daterowcon.classList.add('row','daterowcon');

        for(let j=0;j<monthwisearray[i].length;j++)
        {
            let colorcode=Number(monthwisearray[i][j][2]);
            let clsname;
            switch(colorcode)
            {
                case 0:clsname='active';break;
                case 1:clsname='red';break;
                case 2:clsname='yellow';break;
                case 3:clsname='green';
            }
            const col=document.createElement('div');

            col.classList.add('col-3','col-md-1','d-flex','justify-content-center','align-items-center','fw-bold');

            col.innerHTML=
            `<div class="d-flex w-100 datecircle justify-content-center align-items-center p-2 ${clsname} rounded-circle" id="m-${monthwisearray[i][j][0]}~d-${monthwisearray[i][j][1]}">
            <div class="dateloader rounded-circle w-100"></div>
            ${monthwisearray[i][j][1]}
            </div>`

            addeventtodates(col.querySelector('div'));

            daterowcon.appendChild(col);
        }

        monthBox.appendChild(monthheader);
        monthBox.appendChild(daterowcon);
        mainBox.appendChild(monthBox);
    }
}

function loaddata()
{
    preloadBox.classList.add("shownbox");
    fetch(apiurl)
    .then(res=>res.json())
    .then((data)=>{
        mydata=data;
       
            createcalendarui();
   
        setTimeout(() => {
            preloadBox.classList.remove("shownbox");
            mainBox.classList.add("shownbox");
        }, 10);
    })
    .catch(()=>{
       
        preloadBox.classList.remove("shownbox");
        conerrBox.classList.add("shownbox");
    });
}

conerrBox.querySelector("div").addEventListener("click",function(){
    location.reload();
    
});






function addeventtodates(dc)
{
    dc.addEventListener('click',function(){

        clearTimeout(clickevent);



        clickevent=setTimeout(() => {
        let parts = dc.id.split("~"); 
        let rowcol = parts.map(part => parseInt(part.split("-")[1])); 
        const tempdata=[rowcol[0],rowcol[1]];
        if(dc.classList.contains('active'))
        {
            dc.classList.add("noborder");
            //tempdata should be const // let is dislaoowed as lexical name error
            dc.querySelector('.dateloader').style.display="block";
            
            fetch(apiurl+`?updatecode=true&data=${JSON.stringify(tempdata)}`)
            .then(()=>{
                dc.classList.remove("noborder");
                dc.querySelector('.dateloader').style.display="none";
                dc.classList.remove('active');
                dc.classList.add('yellow');
            
            })
            .catch(()=>{
                dc.classList.remove("noborder");
                dc.querySelector('.dateloader').style.display="none";
               
            })
         
        }
        else if(dc.classList.contains('green'))
        {
           
           let parts = dc.id.split("~"); 
           let rowcol = parts.map(part => parseInt(part.split("-")[1]));
           for(let i=0;i<mydata.length;i++)
           {
            if(mydata[i][0]==rowcol[0] && mydata[i][1]==rowcol[1])
            {
                if(mydata[i][3]==1)
                {
                    let link=mydata[i][4];
                    document.getElementById("showimgcon").style.display="grid";
                    tempload.style.display = "grid";
                    tempload.querySelector("img").src="imgload.gif";
                    let imgid=(link.split("?id=")[1]).split("&export=")[0];
                    let finallink=`https://lh3.google.com/u/0/d/${imgid}`;
                    actualimg.src = finallink;
                    actualimg.onload = function() {
                        setTimeout(() => {
                            tempload.style.display = "none";
                        }, 1000);
                    };
                    actualimg.onerror = function() {
                        tempload.querySelector("img").src="imgerr.png";
                    };
                }
                else
                {
                    showtxtcon.style.display="grid";
                    let tempcontent='';
                    if(mydata[i][4])
                    tempcontent=mydata[i][4].replace(/\n/g, "<br>");
                    actualtxt.innerHTML=tempcontent;
                }
                
                break;
            }
           }


        }




        }, 250);       

    });

        dc.addEventListener('dblclick',function(){
            clearTimeout(clickevent);
            dc.classList.add('dblclicked');
            document.querySelector('.shownbox').classList.remove('shownbox');
            document.querySelector('#upload-box').classList.add('shownbox');
        });


}


uptxt.addEventListener("click",function(){
    document.getElementById("txtpreviewcon").style.display="grid";
    txtin.focus();
});
document.querySelector('#txtbut>.nobut').addEventListener("click",function(){
    txtin.value="";
    document.getElementById("txtpreviewcon").style.display="none";
});
document.querySelector('#txtbut>.yesbut').addEventListener("click",function(){
    let parts = document.querySelector('.datecircle.dblclicked').id.split("~"); 
    let rowcol = parts.map(part => parseInt(part.split("-")[1])); 
    const tempdata=[rowcol[0],rowcol[1],txtin.value];
    this.style.backgroundImage='url("load1.gif")';
    uploadBox.style.pointerEvents="none";
    fetch(apiurl+`?updatetxtsrc=true&data=${JSON.stringify(tempdata)}`)
    .then(()=>{
        document.querySelector('#txtbut>.nobut').click();
        setTimeout(() => {
            
        uploadBox.style.pointerEvents="auto";
        this.style.backgroundImage='url("upload.png")';
        uploadBox.classList.remove("shownbox");
        loaddata();
        }, 10);
        
    })
    .catch(()=>{
        uploadBox.style.pointerEvents="auto";
        this.style.backgroundImage='url("upload.png")';
    })
});







upimg.addEventListener("click",function(){
    imgin.click();
});

upcam.addEventListener("click",function(){
    camin.click();
});

document.querySelector('#imgbut>.nobut').addEventListener("click",function(){
    document.getElementById("imgpreviewcon").style.display="none";
});



document.querySelector('#imgbut>.yesbut').addEventListener("click",function(){
    let parts = document.querySelector('.datecircle.dblclicked').id.split("~"); 
    let rowcol = parts.map(part => parseInt(part.split("-")[1])); 

    this.style.backgroundImage='url("load1.gif")';
    uploadBox.style.pointerEvents="none";

    fetch(apiurl,{
        method:"POST",
        body:JSON.stringify([rowcol[0],rowcol[1],imgobj])
    })
    .then(res=>res.text())
    .then((data)=>{
        if(data=="error")
        {
            uploadBox.style.pointerEvents="auto";
            this.style.backgroundImage='url("upload.png")';
        }
        else
        {
        document.querySelector('#imgbut>.nobut').click();
        setTimeout(() => {
        uploadBox.style.pointerEvents="auto";
        this.style.backgroundImage='url("upload.png")';
        uploadBox.classList.remove("shownbox");
        loaddata();
        }, 10);
        }
    })
    .catch(()=>{
        uploadBox.style.pointerEvents="auto";
        this.style.backgroundImage='url("upload.png")';
    })

});

imgin.addEventListener("change",function(e){
    if(e.target.files.length==0){
        return;
    }
    let fr=new FileReader();
    fr.addEventListener("loadend",function(){
        let res=fr.result;
        ipbu.src=res;
        let spt=res.split("base64,")[1];
        imgobj=
        {
            "base64":spt,
            "type":imgin.files[0].type,
            "name":imgin.files[0].name
        }
       
    });
    fr.readAsDataURL(imgin.files[0]);
    
    document.getElementById("imgpreviewcon").style.display="grid";

})

camin.addEventListener("change",function(e){
    if(e.target.files.length==0){
        return;
    }
    let fr=new FileReader();
    fr.addEventListener("loadend",function(){
        let res=fr.result;
        ipbu.src=res;
        let spt=res.split("base64,")[1];
        imgobj=
        {
            "base64":spt,
            "type":camin.files[0].type,
            "name":camin.files[0].name
        }
       
    });
    fr.readAsDataURL(camin.files[0]);
    
    document.getElementById("imgpreviewcon").style.display="grid";

})


backfromup.addEventListener("click",function()
{
    document.querySelector('.shownbox').classList.remove('shownbox');
    document.querySelector('#main-box').classList.add('shownbox');
    document.querySelector('.datecircle.dblclicked').classList.remove("dblclicked");
});

showtxtimg.addEventListener("click",function(){
    showtxtcon.style.display="none";
});

document.getElementById("closeshowimg").addEventListener("click",function(){
    document.getElementById("showimgcon").style.display="none";
});

let cnt=0;
setInterval(() => {
    const today = new Date();
    const day=today.getDate();
    const hr=today.getHours();
    const min=today.getMinutes();
    const circles=document.querySelectorAll('.datecircle');
    if(cnt===0 && hr===0 && min===0 && circles.length)
    {
        cnt++;
    for(let i=0;i<mydata.length;i++)
    {
        if(mydata[i][2]==-1 && mydata[i][1]==day && mydata[i-1][2]!=-1)
        {
            fetch(apiurl+`?forcechange=true&data=${JSON.stringify(i+1)}`)
            .then(()=>{
                if(mydata[i-1][2]==0)
                {
                    circles[i-1].classList.remove("active");
                    circles[i-1].classList.add("red");
                }
                circles[i].classList.add("active");
            })
            .catch(()=>{
                console.log("error");
            });
        }
    }
    }
}, 1000);

loaddata();