import { makeColorTransparent } from "../../gears/modules/make_color_transparent.js";

const selectors = {
  image: {
    source: '#source-image',
    canvas: '#canvas'
  },
};

document.getElementById('input').addEventListener('change', doIt);

function doIt(e) {
  const reader = new FileReader();
  const file = e.target.files[0];
  reader.addEventListener('load', e => {
    const result = e.target.result;
    document.querySelector(selectors.image.source).src = result;
    setTimeout(() => { // Wait until image loads fully
      makeColorTransparent(
        document.querySelector(selectors.image.source),
        document.querySelector(selectors.image.canvas)
      );
    }, 0);
  });
  reader.readAsDataURL(file);
}