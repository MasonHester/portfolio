export default container => {
    const createCanvas = (document, container) => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        return canvas;
    };

    const canvas = createCanvas(document, container);
    console.log(canvas);
}