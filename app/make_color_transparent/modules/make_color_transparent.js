export async function makeColorTransparent(image, canvasSrc, toColor = {r: 0, g: 0, b: 0, a: 0}, fromColor = {r: 255, g: 255, b: 255}) {
    const canvas = canvasSrc.getContext('2d');
    const height = image.naturalHeight;
    const width = image.naturalWidth;

    canvasSrc.height = height;
    canvasSrc.width = width;
    canvas.drawImage(image, 0, 0);

    const imageData = canvas.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const pixelsLength = pixels.length;

    for (let i = 0; i < pixelsLength; i += 4) {
        const iR = i;
        const iG = i + 1;
        const iB = i + 2;
        const iA = i + 3;

        const r = pixels[iR];
        const g = pixels[iG];
        const b = pixels[iB];
        const a = pixels[iA];

        if (r === fromColor.r && g === fromColor.g && b === fromColor.b) {
            pixels[iR] = toColor.r;
            pixels[iG] = toColor.g;
            pixels[iB] = toColor.b;
            pixels[iA] = toColor.a;
        }
    }

    canvas.putImageData(imageData, 0, 0);

    // canvasSrc.toBlob(
    //     blob => {console.log(blob)},
    //     'image/png'
    // );
}