// ===================SHOW MENU ===========
const navMenu = document.getElementById("nav-menu"),
navToggle = document.getElementById('nav-toggle'),
navClose = document.getElementById("nav-close")

// Menu show
navToggle.addEventListener('click',()=>{
    navMenu.classList.add('show-menu')  
    navToggle.style.opacity="0"
})

// Menu hidden
navClose.addEventListener('click',()=>{
    navMenu.classList.remove('show-menu')
    navToggle.style.opacity="1"
})

window.onscroll=()=>{
    navMenu.classList.remove('show-menu')
    navToggle.style.opacity="1"
}

window.addEventListener('scroll', function() {
    var navbar = document.getElementById('header');
  
    if (window.scrollY > 50) {
      header.style.opacity = '1';
    } else{
        header.style.opacity='0.8'
    }

  });
//////////////////////////////////////////
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };
  
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNumber = parseInt(target.getAttribute('data-target'));
        incrementNumber(target, targetNumber);
        observer.unobserve(target);
      }
    });
  };
  
  const incrementNumber = (element, target) => {
    let currentNumber = 0;
    const increment = () => {
      if (currentNumber < target) {
        currentNumber++;
        element.textContent = currentNumber;
        setTimeout(increment, 30);
      }
    };
    increment();
  };
  
  const observer = new IntersectionObserver(handleIntersection, options);
  
  document.querySelectorAll('.item').forEach(item => {
    observer.observe(item);
  });
  
  /////////////////////////////////////////////////////////////////////////////

  function updateCountdown() {
    const targetDate = new Date('2024-02-17T10:13:00'); // Replace with your specific date
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        document.getElementById('countdown').innerHTML = 'Challenge begin!!';
    } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        document.getElementById('digit__days').innerHTML = days;
        document.getElementById('digit__hours').innerHTML = hours;
        document.getElementById('digit__minutes').innerHTML = minutes;
        document.getElementById('digit__seconds').innerHTML = seconds;


        requestAnimationFrame(updateCountdown);
    }
}


/////////////////////////////////////////////////////////////

function showTable(tableNumber) {
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');
    const button1 = document.getElementById('btnday1');
    const button2 = document.getElementById('btnday2');
    const ligne1 = document.getElementById('ligne1');
    const ligne2 = document.getElementById('ligne2');

    table1.classList.remove('active');
    table2.classList.remove('active');

    if (tableNumber === 1) {
      table1.classList.add('active');
      button1.classList.remove('btn-inactive');
      button1.classList.add('btn-active');
      ligne1.classList.remove('ligne-inactive');
      ligne1.classList.add('ligne-active');
      button2.classList.remove('btn-active');
      button2.classList.add('btn-inactive');
      ligne2.classList.add('ligne-inactive');
      ligne2.classList.remove('ligne-active');

    } else if (tableNumber === 2) {
      table2.classList.add('active');
      button2.classList.remove('btn-inactive');
      button2.classList.add('btn-active');
      ligne2.classList.remove('ligne-inactive');
      ligne2.classList.add('ligne-active');
      button1.classList.remove('btn-active');
      button1.classList.add('btn-inactive');
      ligne1.classList.add('ligne-inactive');
      ligne1.classList.remove('ligne-active');
    }
  }

////////////////////////////sponsors carousel/////////////////////////////:
  
const carousel = document.querySelector('.carousel')
const wrapper = document.querySelector('.wrapper')
firstImg = carousel.querySelectorAll("img")[0];
arrowIcons = document.querySelectorAll('.wrapper i')

let isDragStart  = false , isDragging = false ,prevPageX ,prevScrollLeft ,positionDiff;

const showHideIcons =()=>{
    let scrollWidth = carousel.scrollWidth  - carousel.clientWidth;
    arrowIcons[0].style.display= carousel.scrollLeft == 0 ?"none" : "block";
    arrowIcons[1].style.display= carousel.scrollLeft == scrollWidth ?"none" : "block";
}

arrowIcons.forEach(icon =>{
    icon.addEventListener( 'click' , ()=>{
        let firstImgWidth =  firstImg.clientWidth + 14;
        carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(()=>showHideIcons(),60)
    })
})

const autoSlide =() =>{
    if(carousel.scrollLeft == (carousel.scrollWidth  - carousel.clientWidth)) return;

    positionDiff= Math.abs(positionDiff)
    let firstImgWidth  = firstImg.clientWidth + 20;
    let valDifference = firstImgWidth - positionDiff;
    if(carousel.scrollLeft > prevScrollLeft){
        return carousel.scrollLeft +=positionDiff >firstImgWidth / 3 ? valDifference : -positionDiff;
    }
    carousel.scrollLeft -=positionDiff >firstImgWidth / 3 ? valDifference : -positionDiff;

}

const dragStart = (e)=>{
    isDragStart =  true;
    prevPageX= e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e)=>{
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX)- prevPageX;
    carousel.scrollLeft  = prevScrollLeft - positionDiff;
    showHideIcons()
} 

const dragStop = ()=>{
    isDragStart = false
    carousel.classList.remove("dragging")
    if(!isDragging) return;
    isDragging = false
    autoSlide();
}
function startAutoPlay() {
  intervalId = setInterval(() => {
    if(carousel.scrollLeft == (carousel.scrollWidth  - carousel.clientWidth)){
    carousel.scrollLeft = 0;
    return
    }
    else{
    let firstImgWidth =  firstImg.clientWidth + 14;
    carousel.scrollLeft += firstImgWidth;
    setTimeout(()=>showHideIcons(),60)
    }
  }, 3000);
}

function stopAutoPlay() {
  clearInterval(intervalId);
}
startAutoPlay()


carousel.addEventListener("mousedown",dragStart)
carousel.addEventListener("touchstart",dragStart)

wrapper.addEventListener('mousedown',stopAutoPlay)
wrapper.addEventListener('touchstart',stopAutoPlay)

carousel.addEventListener('mousemove',dragging)
carousel.addEventListener('touchmove',dragging)

wrapper.addEventListener('mousemove',stopAutoPlay)
wrapper.addEventListener('touchmove',stopAutoPlay)


carousel.addEventListener('mouseup',dragStop)
carousel.addEventListener('mouseleave',dragStop)
carousel.addEventListener('touchend',dragStop)

wrapper.addEventListener('mouseleave',startAutoPlay)
wrapper.addEventListener('touchend',startAutoPlay)
updateCountdown();

function redirectToCreateTeam() {
  window.location.href = '/coding-moon-form';
}
function redirectToSignIn() {
  window.location.href = '/sign-in';
}
function redirectToManage() {
  window.location.href = '/create-team';
}