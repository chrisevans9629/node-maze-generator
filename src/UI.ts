import { MazeGenerator } from "./MazeGenerator";

let canvas = document.getElementById("canvas") as HTMLCanvasElement;

let width = 400;

canvas.width = width;
canvas.height = width;

let cell = 20;
let dots = 4;
let walls = 4;
let o = cell / 2;
let doo = dots/2;

let m = canvas.width / 2;

let ctx = canvas.getContext("2d");

ctx.translate(m, m);

export function DrawCell(x: number, y: number, data: string) {
    x = x * cell;
    y = y * cell;

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, cell, cell);

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.lineWidth = walls;
    if (data[0] === "0") {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cell);
        ctx.stroke();
    }
    if (data[1] === "0") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y);
        ctx.stroke();
    }
    if (data[2] === "0") {
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x + cell, y + cell);
        ctx.stroke();
    }
    if (data[3] === "0") {
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x + cell, y + cell);
        ctx.stroke();
    }


    ctx.fillRect(x-doo, y-doo, dots, dots);
    ctx.fillRect(x + cell - doo, y - doo, dots, dots);
    ctx.fillRect(x + cell - doo, y + cell - doo, dots, dots);
    ctx.fillRect(x - doo, y + cell - doo, dots, dots);
    //ctx.moveTo(x, y);
    //ctx.lineTo(x+cell, y);
    //ctx.stroke();
}
export function DrawDot(x: number, y: number, color: string) {
    x = x * cell + o;
    y = y * cell + o;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x-doo, y-doo, dots, dots);
}

export function Translate(x:number, y:number) {
    const transform = ctx.getTransform();

    // Get the current x and y translation values
    const currentX = transform.m41;
    const currentY = transform.m42;

    console.log(currentX, currentY);

    //20=10
    //100-110+20=10
    ctx.translate(m - currentX + -x * cell, m - currentY + -y * cell);

    ctx.clearRect(-currentX, -currentY, canvas.width, canvas.height);

}

export function Draw(maze:MazeGenerator, x:number, y:number) {
    Translate(x, y);
    maze.explored.forEach(e => {
        DrawCell(e.x, e.y, e.door);
    });
    DrawDot(x, y, "red");
}
