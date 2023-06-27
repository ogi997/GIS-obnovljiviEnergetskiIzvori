let drawPolygon = document.getElementsByClassName('mapbox-gl-draw_polygon');
let drawLine = document.getElementsByClassName("mapbox-gl-draw_line");
let trash = document.getElementsByClassName("mapbox-gl-draw_trash");
export const checkControlsIsActive = () => {
    if (!drawPolygon[0] || !drawLine[0] || !trash[0]) return;
    return drawPolygon[0].className.includes("active") || drawLine[0].className.includes("active") || trash[0].className.includes("active");
};
export const disableControls = () => {
    if (!drawPolygon[0] || !drawLine[0] || !trash[0]) return;
    drawPolygon[0].disabled = true;
    drawLine[0].disabled = true;
    trash[0].disabled = true;
};
export const enableControls = () => {
    if (!drawPolygon[0] || !drawLine[0] || !trash[0]) return;
    drawPolygon[0].disabled = false;
    drawLine[0].disabled = false;
    trash[0].disabled = false;
};
