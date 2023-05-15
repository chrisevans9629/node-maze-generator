import { MazeGenerator } from "./MazeGenerator";


export class MazeCanvasRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cell: number = 20;
    dots = 4;
    walls = 4;
    cellCenter: number;
    dotCenter: number;
    doorFrame = 5;
    middle: number;
    constructor(id: string, width: number, height: number) {
        let element = document.getElementById(id);

        if (element instanceof HTMLCanvasElement) {
            this.canvas = element;
        }
        else {
            this.canvas = new HTMLCanvasElement();
            element.appendChild(this.canvas);
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.cellCenter = this.cell / 2;
        this.dotCenter = this.dots / 2;
        this.middle = this.canvas.width / 2;

        this.ctx.translate(this.middle, this.middle);
    }

    DrawLine(fromX: number, fromY: number, toX: number, toY: number) {
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
    }


    DrawCell(x: number, y: number, data: string, color: string) {
        let cell = this.cell;
        let ctx = this.ctx;
        let walls = this.walls;
        let doorFrame = this.doorFrame;
        let dots = this.dots;
        let dotCenter = this.dotCenter;

        x = x * cell;
        y = y * cell;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cell, cell);

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.lineWidth = walls;
        if (data[0] === "0") {
            this.DrawLine(x, y, x, y + cell);
        }
        else {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + doorFrame);
            ctx.stroke();

            ctx.moveTo(x, y + cell);
            ctx.lineTo(x, y + cell - doorFrame);
            ctx.stroke();
        }

        if (data[1] === "0") {
            this.DrawLine(x, y, x + cell, y);
        }
        else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + doorFrame, y);
            ctx.stroke();

            ctx.moveTo(x + cell, y);
            ctx.lineTo(x + cell - doorFrame, y);
            ctx.stroke();
        }

        if (data[2] === "0") {
            this.DrawLine(x + cell, y, x + cell, y + cell);
        }
        else {
            ctx.moveTo(x + cell, y);
            ctx.lineTo(x + cell, y + doorFrame);
            ctx.stroke();

            ctx.moveTo(x + cell, y + cell);
            ctx.lineTo(x + cell, y + cell - doorFrame);
            ctx.stroke();
        }

        if (data[3] === "0") {
            this.DrawLine(x, y + cell, x + cell, y + cell);
        }
        else {
            ctx.moveTo(x, y + cell);
            ctx.lineTo(x + doorFrame, y + cell);
            ctx.stroke();

            ctx.moveTo(x + cell, y + cell);
            ctx.lineTo(x + cell - doorFrame, y + cell);
            ctx.stroke();
        }

        ctx.fillRect(x - dotCenter, y - dotCenter, dots, dots);
        ctx.fillRect(x + cell - dotCenter, y - dotCenter, dots, dots);
        ctx.fillRect(x + cell - dotCenter, y + cell - dotCenter, dots, dots);
        ctx.fillRect(x - dotCenter, y + cell - dotCenter, dots, dots);
    }


    DrawDot(x: number, y: number, color: string) {
        x = x * this.cell + this.cellCenter;
        y = y * this.cell + this.cellCenter;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - this.dotCenter, y - this.dotCenter, this.dots, this.dots);
    }

    Translate(x: number, y: number) {
        const transform = this.ctx.getTransform();
    
        // Get the current x and y translation values
        const currentX = transform.m41;
        const currentY = transform.m42;
    
        //console.log(currentX, currentY);
    
        //20=10
        //100-110+20=10
        this.ctx.translate(this.middle - currentX + -x * this.cell, this.middle - currentY + -y * this.cell);
    
        this.ctx.clearRect(-currentX, -currentY, this.canvas.width, this.canvas.height);
    
    }

    Draw(maze: MazeGenerator, x: number, y: number) {
        this.Translate(x, y);
        maze.explored.forEach(e => {
            this.DrawCell(e.x, e.y, e.door, e.color);
        });
        this.DrawDot(x, y, "red");
    }
}

