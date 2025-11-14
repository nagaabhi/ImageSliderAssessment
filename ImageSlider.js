const sliderContainer = document.getElementById('slide-container');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const textElements = document.querySelectorAll('.slide-text');
const customizationPanel = {
  indicator: document.getElementById('selection-indicator'),
  colorPicker: document.getElementById('color-picker'),
  alignmentBtns: document.querySelectorAll('.align-btn'),
  fontFamilySelect: document.getElementById('font-family-select'),
  fontSizeInput: document.getElementById('font-size-input'),
  fontSizeValue: document.getElementById('font-size-value')
};

let currentSlide = 0;
let selectedTextElement = null; customization


const initializeTextPositions = () => {
  textElements.forEach(activeElement => {
    const parent = activeElement.closest('.slide');
    if (parent && !activeElement.style.left) {

      const centerLeft = (parent.offsetWidth / 2) - (activeElement.offsetWidth / 2);
      const centerTop = (parent.offsetHeight / 2) - (activeElement.offsetHeight / 2);

      activeElement.style.left = `${centerLeft}px`;
      activeElement.style.top = `${centerTop}px`;
      activeElement.style.transform = 'none'; point
    }
  });
};


window.addEventListener('load', initializeTextPositions);
window.addEventListener('resize', initializeTextPositions);



const updateSlider = () => {
  const offset = -currentSlide * 25; 
  sliderContainer.style.transform = `translateX(${offset}%)`;


  setTimeout(() => {
    const currentText = document.querySelector(`.slide-text[data-slide-index="${currentSlide}"]`);
    selectTextElement(currentText);

    initializeTextPositions();
  }, 500);
};

const goToPrevSlide = () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
};

const goToNextSlide = () => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
};

prevBtn.addEventListener('click', goToPrevSlide);
nextBtn.addEventListener('click', goToNextSlide);


updateSlider();




const selectTextElement = (element) => {
  if (selectedTextElement) {
    selectedTextElement.classList.remove('outline-indigo-500', 'outline-2', 'outline', 'ring-4');
  }

  selectedTextElement = element;
  if (selectedTextElement) {
    selectedTextElement.classList.add('outline-indigo-500', 'outline-2', 'outline', 'ring-4');
    selectedTextElement.focus();
    customizationPanel.indicator.classList.remove('hidden');


    customizationPanel.colorPicker.value = selectedTextElement.style.color || '#FFFFFF';
    customizationPanel.fontSizeInput.value = parseInt(selectedTextElement.style.fontSize) || 32;
    customizationPanel.fontSizeValue.textContent = customizationPanel.fontSizeInput.value;
    customizationPanel.fontFamilySelect.value = selectedTextElement.dataset.fontFamily || 'inter';


    document.querySelectorAll('.align-btn').forEach(btn => btn.classList.remove('bg-indigo-500', 'text-white'));
    const currentAlign = selectedTextElement.style.textAlign || 'center';
    const activeBtn = document.querySelector(`.align-btn[data-align="${currentAlign}"]`);
    if (activeBtn) {
      activeBtn.classList.add('bg-indigo-500', 'text-white');
    }

  } else {
    customizationPanel.indicator.classList.add('hidden');
  }
};


textElements.forEach(text => {
  text.addEventListener('click', (e) => {
    e.stopPropagation();
    selectTextElement(e.target);
  });
  text.addEventListener('focus', (e) => selectTextElement(e.target));
});


document.addEventListener('click', (e) => {
  if (selectedTextElement &&
    !e.target.closest('.slide-text') &&
    !e.target.closest('.w-full.md\\:w-1\\/3')) {

    selectedTextElement.classList.remove('outline-indigo-500', 'outline-2', 'outline', 'ring-4');
    selectedTextElement = null;
    customizationPanel.indicator.classList.add('hidden');
  }
});



let isDragging = false;
let activeElement = null;
let xOffset = 0, yOffset = 0;

const dragStart = (e) => {
  if (e.target && e.target.classList.contains('slide-text')) {
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    activeElement = e.target;
    isDragging = true;
    activeElement.classList.add('dragging');


    activeElement.style.transform = 'none';


    const currentLeft = parseFloat(activeElement.style.left) || activeElement.offsetLeft;
    const currentTop = parseFloat(activeElement.style.top) || activeElement.offsetTop;

corner
    xOffset = clientX - currentLeft;
    yOffset = clientY - currentTop;


    activeElement.contentEditable = 'false';
  }
};

const dragEnd = (e) => {
  if (activeElement) {
    isDragging = false;
    activeElement.classList.remove('dragging');

  }
};

const drag = (e) => {
  if (!isDragging || !activeElement) return;

  e.preventDefault();

  const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

  const parent = activeElement.closest('.slide');
  if (!parent) return;

  let finalX = clientX - xOffset;
  let finalY = clientY - yOffset;


  const minX = 0;
  const minY = 0;

  const maxX = parent.offsetWidth - activeElement.offsetWidth;
  const maxY = parent.offsetHeight - activeElement.offsetHeight;


  if (finalX < minX) finalX = minX;
  if (finalX > maxX) finalX = maxX;
  if (finalY < minY) finalY = minY;
  if (finalY > maxY) finalY = maxY;


  activeElement.style.left = `${finalX}px`;
  activeElement.style.top = `${finalY}px`;
};


document.addEventListener('mouseup', () => {
  if (activeElement) {
    activeElement.contentEditable = 'true';
    activeElement = null;
  }
});



document.addEventListener('mousedown', dragStart);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);

document.addEventListener('touchstart', dragStart);
document.addEventListener('touchend', dragEnd);
document.addEventListener('touchmove', drag);




const applyStyle = (property, value) => {
  if (selectedTextElement) {
    selectedTextElement.style[property] = value;
  }
};


customizationPanel.colorPicker.addEventListener('input', (e) => {
  applyStyle('color', e.target.value);
});


customizationPanel.alignmentBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const align = btn.dataset.align;
    applyStyle('textAlign', align);


    customizationPanel.alignmentBtns.forEach(b => b.classList.remove('bg-indigo-500', 'text-white'));
    btn.classList.add('bg-indigo-500', 'text-white');
  });
});


customizationPanel.fontFamilySelect.addEventListener('change', (e) => {
  const fontFamily = e.target.value;
  let cssFontValue = '';

  
  switch (fontFamily) {
    case 'inter':
      cssFontValue = 'Inter, sans-serif';
      break;
    case 'serif':
      cssFontValue = 'Georgia, serif';
      break;
    case 'mono':
      cssFontValue = 'Menlo, monospace';
      break;
    case 'cursive':
      cssFontValue = 'cursive';
      break;
    default:
      cssFontValue = 'Inter, sans-serif';
  }

  applyStyle('fontFamily', cssFontValue);

  if (selectedTextElement) {
    selectedTextElement.dataset.fontFamily = fontFamily;
  }
});


customizationPanel.fontSizeInput.addEventListener('input', (e) => {
  const size = e.target.value + 'px';
  customizationPanel.fontSizeValue.textContent = e.target.value;
  applyStyle('fontSize', size);
});