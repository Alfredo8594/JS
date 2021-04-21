const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Looping through images */

for(let i = 0 ; i < 5 ;i++) {
    const nuevaImagen= document.createElement('img');
    nuevaImagen.setAttribute('src', 'images/pic' + (i+1) + '.jpg');
    thumbBar.appendChild(nuevaImagen);
    nuevaImagen.onclick=function(e) {
        displayedImage.src = e.target.src;
    }
}

/* Wiring up the Darken/Lighten button */
btn.onclick=function()
{
    const darkLigth = btn.getAttribute('class');
    if(darkLigth==='dark')
    {
        btn.setAttribute('class','light');
        btn.textContent='Lighten';
        overlay.style.backgroundColor="rgba(0,0,0,0.5)";
    }else
    {
        btn.setAttribute('class','dark');
        btn.textContent='Darken';
        overlay.style.backgroundColor="rgba(0,0,0,0)";
    }
}